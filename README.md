# Family Password Manager

A full-stack Next.js App Router password manager for a parent and family members. The browser extension is not included yet; extension-ready APIs are implemented for future integration.

## Stack

- Next.js 16 App Router with TypeScript
- Tailwind CSS
- Prisma ORM with PostgreSQL / Prisma Postgres
- Custom JWT auth with HTTP-only cookies
- bcrypt password hashing
- AES-256-GCM vault encryption
- One-time API keys and revocable extension sessions

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example`.

The app requires a real PostgreSQL database. For Prisma Postgres, create a database in Prisma Data Platform, copy its connection string, and paste it as `DATABASE_URL`.

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/family_password_manager?sslmode=require"
JWT_SECRET="replace-with-at-least-32-random-characters"
ENCRYPTION_KEY="replace-with-32-byte-base64-key-from-openssl-rand-base64-32"
NEXT_PUBLIC_APP_NAME="Family Password Manager"
```

Generate an encryption key on Windows PowerShell:

```powershell
$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$rng.Dispose()
[Convert]::ToBase64String($bytes)
```

Or with OpenSSL:

```bash
openssl rand -base64 32
```

3. Apply database migrations:

```bash
npm run prisma:migrate
```

4. Run locally:

```bash
npm run dev
```

## Validation

```bash
npm run lint
npm run typecheck
npm run build
```

## API Surface

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Passwords:

- `POST /api/passwords`
- `GET /api/passwords`
- `GET /api/passwords/:id`
- `PUT /api/passwords/:id`
- `DELETE /api/passwords/:id`

Family:

- `POST /api/family`
- `GET /api/family`
- `PUT /api/family/:id`
- `DELETE /api/family/:id`

Assignments:

- `POST /api/assignments`
- `GET /api/assignments`
- `DELETE /api/assignments/:id`

API keys and extension:

- `POST /api/api-keys/generate`
- `GET /api/api-keys`
- `DELETE /api/api-keys/:id`
- `POST /api/extension/login`
- `GET /api/extension/passwords`
- `POST /api/extension/update-password`
- `POST /api/parent/sessions/:id/revoke`
- `GET /api/health`

## Security Notes

- Plain saved passwords are encrypted with AES-256-GCM before storage.
- Account passwords are hashed with bcrypt.
- API keys and extension session tokens are hashed before storage.
- Generated API keys are returned only once.
- Extension login marks an API key as used immediately.
- Parent pages are protected by cookie-based route proxying and API-level auth checks.
