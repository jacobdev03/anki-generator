# Backend startup and migrations

Install the backend dependencies in a Python virtual environment:

```sh
pip install -r requirements.txt
```

Configure `DATABASE_URL` in `backend/.env` for PostgreSQL, for example:

```env
DATABASE_URL=postgresql+psycopg2://USER:PASSWORD@HOST:5432/DATABASE
```

The application also requires `OPENAI_API_KEY`, `JWT_SECRET_KEY` and
`JWT_ALGORITHM=HS256`. Stripe configuration is needed for payment features.

From the `backend` directory, initialize or upgrade the database before starting
the API:

```sh
alembic upgrade head
uvicorn main:app --host 0.0.0.0 --port 8000
```

The backend Docker image performs `alembic upgrade head` automatically before
starting Uvicorn. If migration fails, the API does not start. Docker Compose waits
for PostgreSQL's health check before starting the backend. Supply Compose's
environment variables through a root `.env` or `--env-file`; these include
`DB_PASSWORD`, `OPENAI_API_KEY`, `JWT_SECRET_KEY` and the Stripe settings.

## Existing databases

The missing users-table baseline (`6b2c4e8a901f`) precedes the original revision
`7896fa3e3d17`. Databases already stamped at an original revision keep their
existing tables and records; Alembic does not rerun preceding migrations.

For a database containing tables but no Alembic revision, inspect its schema and
back it up before choosing a matching stamp. Do not run `stamp head` blindly:
stamping records a revision without applying any schema changes. Do not remove
the existing PostgreSQL volume to repair migrations.

## Migration regression tests

From the `backend` directory:

```sh
python -m unittest discover -s tests -v
```

By default, these tests run the real Alembic CLI against temporary SQLite databases. They
cover fresh installation, related records, repeated upgrade, an installation
already stamped before the baseline was added, and downgrade to an empty schema.
They never connect to the database configured in your local `.env`.

To run the same tests against PostgreSQL, explicitly set
`MIGRATION_TEST_POSTGRES_URL` to a dedicated test database URL. Each test creates
and removes its own randomly named schema in that database. The test database
user must have permission to create schemas.
