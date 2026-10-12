# Local configuration

## Docker Compose

If a local configuration file already exists, edit it instead of overwriting it
with an example. The example files contain placeholders, not working credentials.

From the repository root, create your local configuration:

```powershell
Copy-Item .env.example .env
```

Edit `.env` and replace `DB_PASSWORD`, `OPENAI_API_KEY` and `JWT_SECRET_KEY`.
Generate a random secret with:

```powershell
python -c "import secrets; print(secrets.token_hex(32))"
```

Use an alphanumeric or hexadecimal database password because Compose inserts
it directly into the connection URL. If reusing an existing PostgreSQL volume,
keep its current password; changing `.env` does not change that database password.

Start the backend and database:

```powershell
docker compose up --build db backend
```

To run the frontend in a second terminal with npm:

```powershell
cd frontend
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Alternatively, run all three services in Docker from the repository root:

```powershell
docker compose up --build
```

The frontend is at http://localhost:3000 and API documentation is at
http://localhost:8000/docs. Root `.env` is read by Compose; it is not automatically
loaded by a frontend started with npm.

## Configuration files

| Example file | Local copy | Used by |
| --- | --- | --- |
| `.env.example` | `.env` | Docker Compose |
| `backend/.env.example` | `backend/.env` | Backend run directly with Python |
| `frontend/.env.example` | `frontend/.env.local` | Frontend run with npm |

For the local Python backend, configure `DATABASE_URL` to point to your actual
PostgreSQL database and follow [backend startup](backend/README.md).
Compose constructs its backend URL automatically and sets `JWT_ALGORITHM=HS256`.

The application needs a real OpenAI key to generate flashcards. A dummy key can
be used for startup, registration and login checks, but cannot generate cards.

## Optional payments

Leave these variables empty when testing the application without payments:

```env
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_100_CREDITS=
```

For payment testing, use Stripe test-mode credentials, a test price for 100 credits,
and a webhook signing secret for events forwarded to `/api/webhook`.
Empty payment settings do not prevent startup; payment features require configuration.

## Updating configuration

Shell environment variables take precedence over `.env`. An earlier PowerShell
assignment such as `$env:OPENAI_API_KEY` can therefore override the value in the file.

After changing backend configuration, recreate the backend container:

```powershell
docker compose up -d --force-recreate backend
```

Include `-p anki-start-test` in each Compose command when continuing the separate
test project created earlier. This keeps commands targeting the same database volume.

The public `NEXT_PUBLIC_API_URL` is embedded in the frontend at build time.
Rebuild a Docker frontend after changing it; restart `npm run dev` for local development.
Only the public API URL belongs in the frontend configuration.

Real `.env` files are ignored by Git and Docker. Only `.env.example` files should
be committed. Docker supplies backend settings at runtime and the frontend's public
URL as a build argument.
