import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from uuid import uuid4

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.engine import make_url


BACKEND_DIR = Path(__file__).resolve().parents[1]


class MigrationTests(unittest.TestCase):
    def setUp(self):
        postgres_url = os.environ.get("MIGRATION_TEST_POSTGRES_URL")
        if postgres_url:
            schema = "anki_migration_" + uuid4().hex
            admin_engine = create_engine(postgres_url)
            with admin_engine.begin() as connection:
                connection.execute(text(f'CREATE SCHEMA "{schema}"'))

            def remove_schema():
                try:
                    with admin_engine.begin() as connection:
                        connection.execute(text(f'DROP SCHEMA "{schema}" CASCADE'))
                finally:
                    admin_engine.dispose()

            self.addCleanup(remove_schema)
            self.database_url = make_url(postgres_url).update_query_dict(
                {"options": f"-csearch_path={schema}"}
            ).render_as_string(hide_password=False)
        else:
            cache_dir = BACKEND_DIR / ".pytest_cache"
            cache_dir.mkdir(exist_ok=True)
            self.directory = tempfile.TemporaryDirectory(dir=cache_dir)
            self.addCleanup(self.directory.cleanup)
            self.database_url = "sqlite:///" + Path(
                self.directory.name, "migration.sqlite"
            ).as_posix()
        self.engine = create_engine(self.database_url)
        self.addCleanup(self.engine.dispose)

    def alembic(self, *arguments):
        environment = {**os.environ, "DATABASE_URL": self.database_url}
        result = subprocess.run(
            [sys.executable, "-m", "alembic", *arguments],
            cwd=BACKEND_DIR,
            env=environment,
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_empty_database_can_upgrade_and_store_related_records(self):
        self.alembic("upgrade", "head")
        self.assertTrue(
            {"users", "decks", "flashcards"}.issubset(
                inspect(self.engine).get_table_names()
            )
        )
        with self.engine.begin() as connection:
            connection.execute(text(
                "INSERT INTO users (id, username, email, hashed_password, credits) "
                "VALUES (1, 'test-user', 'test@example.invalid', 'test-hash', 50)"
            ))
            connection.execute(text(
                "INSERT INTO decks (id, user_id, title) VALUES (1, 1, 'Test deck')"
            ))
            connection.execute(text(
                "INSERT INTO flashcards (id, deck_id, front, back) "
                "VALUES (1, 1, 'Question', 'Answer')"
            ))
            self.assertEqual(connection.scalar(text(
                "SELECT COUNT(*) FROM flashcards JOIN decks "
                "ON decks.id = flashcards.deck_id JOIN users "
                "ON users.id = decks.user_id"
            )), 1)

    def test_repeated_upgrade_preserves_existing_records(self):
        self.alembic("upgrade", "head")
        with self.engine.begin() as connection:
            connection.execute(text(
                "INSERT INTO users (username, email, hashed_password, credits) "
                "VALUES ('existing-user', 'existing@example.invalid', 'test-hash', 17)"
            ))
        self.alembic("upgrade", "head")
        with self.engine.connect() as connection:
            self.assertEqual(connection.scalar(text(
                "SELECT credits FROM users WHERE username = 'existing-user'"
            )), 17)

    def test_migrations_can_downgrade_to_empty_database(self):
        self.alembic("upgrade", "head")
        self.alembic("downgrade", "base")
        self.assertFalse(
            {"users", "decks", "flashcards"}.intersection(
                inspect(self.engine).get_table_names()
            )
        )

    def test_previously_stamped_database_skips_new_baseline(self):
        # Represent an installation already stamped before the baseline existed.
        with self.engine.begin() as connection:
            connection.execute(text(
                "CREATE TABLE users (id INTEGER PRIMARY KEY, username VARCHAR, "
                "email VARCHAR, hashed_password VARCHAR, credits INTEGER)"
            ))
            connection.execute(text(
                "INSERT INTO users VALUES "
                "(1, 'legacy-user', 'legacy@example.invalid', 'test-hash', 23)"
            ))
        self.alembic("stamp", "3e6aa5b6cad6")
        self.alembic("upgrade", "head")
        with self.engine.connect() as connection:
            self.assertEqual(connection.scalar(text(
                "SELECT credits FROM users WHERE username = 'legacy-user'"
            )), 23)


if __name__ == "__main__":
    unittest.main()
