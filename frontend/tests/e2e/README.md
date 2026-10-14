# Application flow tests

Playwright starts Chromium, a real Next.js production build on port 3102 and an
isolated FastAPI server on port 8102. Both ports must be free. Stop a running
frontend dev server first: the test build uses the same `.next` output directory.

## First run

Install Python 3.12 and Node.js 20.9 or newer. From the repository root on Windows:

```powershell
python -m venv backend/venv
backend/venv/Scripts/python.exe -m pip install -r backend/requirements.txt
cd frontend
npm ci
npx playwright install chromium
npm run test:e2e
```

Reuse an existing backend virtual environment rather than recreating it. On Linux
or macOS, use `python -m venv backend/.venv` and
`backend/.venv/bin/python -m pip install -r backend/requirements.txt` before running
the frontend commands. Linux may need `npx playwright install --with-deps chromium`.

The configuration detects `backend/venv` or `backend/.venv`; otherwise it uses
`python` from PATH. For a different installation, explicitly select the interpreter:

```powershell
$env:E2E_PYTHON = 'C:/path/to/venv/Scripts/python.exe'
npm run test:e2e
```

After setup, `npm run test:e2e` is the only command needed. It builds the frontend,
starts the two test servers, runs the tests and stops the servers. The HTML report
is available with `npm run test:e2e:report`. Failed tests retain traces, screenshots
and video under `test-results/`.

## Isolation and coverage

`backend/tests/e2e_server.py` overrides database, OpenAI, JWT and Stripe settings
before importing the app. It applies the real migrations to a new temporary SQLite
database and replaces only `AIService.generate_cards_from_chunk` with a deterministic
response. This separate test entry point is never loaded by `main.py` or Docker startup.
No OpenAI/Stripe account, Docker service or real `.env` configuration is needed.
Test files and database files stay under ignored output directories.

The sample PDF contains one page of selectable English biology text, more than
500 characters, fitting in one upload chunk. The controlled AI response checks
that expected text actually reached it. OCR and the live OpenAI API are outside
this suite; SQLite coverage does not replace PostgreSQL integration checks.

The tests exercise:

- Registration through the landing page, logout and login.
- Real PDF upload and extraction, two generated cards and a 50 → 49 credit change.
- Saving, reloading the library, editing a card, logging in again and reopening it.
- Downloading an APKG and checking its SQLite notes/cards and edited content.
- Rejecting oversized and non-PDF inputs before sending an upload request.
- Displaying the insufficient-credit error without allowing a deck to be saved.

The suite validates the package structure; it does not launch the Anki desktop app.
Accounts have unique names, so retries do not depend on records from earlier tests.

## GitHub Actions

`.github/workflows/ci.yml` runs on pushes to `master`/`main`, pull requests and manual
dispatch. It checks migrations, lint and types, then uses the same Playwright command
to build and test the frontend. The report and failure traces are retained for seven
days. All credentials in this suite are disposable test values; no repository
secrets are required. The workflow performs checks only; it does not deploy.
