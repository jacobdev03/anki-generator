"""Isolated browser-test server. Never imported by the production entry point."""

import os
from pathlib import Path
import subprocess
import sys
import tempfile

BACKEND = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND))


def main():
    cache = BACKEND / ".pytest_cache"
    cache.mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="e2e-", dir=cache) as directory:
        work = Path(directory)
        # Override inherited settings before dotenv or application imports.
        os.environ.update({
            "DATABASE_URL": "sqlite:///" + (work / "test.sqlite").as_posix(),
            "OPENAI_API_KEY": "e2e-placeholder-not-a-real-key",
            "JWT_SECRET_KEY": "local-e2e-only-signing-secret-do-not-use-in-production",
            "JWT_ALGORITHM": "HS256",
            "FRONTEND_URL": "http://127.0.0.1:3102",
            "STRIPE_SECRET_KEY": "",
            "STRIPE_WEBHOOK_SECRET": "",
            "STRIPE_PRICE_ID_100_CREDITS": "",
            "TEMP": directory,
            "TMP": directory,
        })
        tempfile.tempdir = directory
        subprocess.run([sys.executable, "-m", "alembic", "upgrade", "head"], cwd=BACKEND, check=True)

        from main import app
        from app.services.ai import AIService
        from app.database import SessionLocal, engine
        from app.models.user import User
        from app.api.endpoints.auth import get_password_hash
        import uvicorn

        async def generate_test_cards(text):
            # Fail if upload/extraction no longer forwards the fixture's content.
            if "phospholipid bilayer" not in text or "mitochondria" not in text.lower():
                raise ValueError("Expected the biology PDF's extracted text")
            return [
                {"front": "Z czego zbudowana jest błona komórkowa?", "back": "Z dwuwarstwy fosfolipidowej."},
                {"front": "Co produkują mitochondria?", "back": "ATP."},
            ]

        AIService.generate_cards_from_chunk = staticmethod(generate_test_cards)
        with SessionLocal() as db:
            db.add(User(username="no-credits", email="empty@example.invalid", credits=0,
                        hashed_password=get_password_hash("e2e-password")))
            db.commit()

        try:
            uvicorn.run(app, host="127.0.0.1", port=8102)
        finally:
            engine.dispose()


if __name__ == "__main__":
    main()
