# Anki Generator frontend

The frontend uses Next.js and npm. `package-lock.json` is the dependency lockfile;
the Docker build also installs dependencies with `npm ci`.

From the `frontend` directory, install dependencies and create local configuration:

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Open http://localhost:3000. The backend should be available at
http://localhost:8000; the browser API URL is configured by `NEXT_PUBLIC_API_URL`.

For a local production build on Windows, start the standalone server (the same
output used by the Docker image):

```powershell
npm run build
Copy-Item public .next/standalone -Recurse -Force
Copy-Item .next/static .next/standalone/.next -Recurse -Force
$env:PORT = '3000'
$env:HOSTNAME = '127.0.0.1'
node .next/standalone/server.js
```

Copying the public and static assets is necessary because the standalone build
does not include them automatically. For a cross-platform production setup,
use the frontend service in Docker Compose.

`NEXT_PUBLIC_API_URL` is embedded at build time. Rebuild after changing it.
The frontend must never receive OpenAI, Stripe or JWT secrets.

See [configuration](../CONFIGURATION.md) for Docker Compose setup and
[backend setup](../backend/README.md) for migrations and local Python startup.
