# Deployment

## Local

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Render

Build command:

```bash
npm install && npm run build
```

Start command:

```bash
npm start
```

Environment variables:

```text
RETOOL_API_URL=...
RETOOL_API_KEY=...
AUTH_SECRET=<long-random-secret>
```

Do not put private Retool/API/payment secrets in variables beginning with `NEXT_PUBLIC_`.

## Before production

Replace demo authentication with a real identity system and persistent user store. Add payment verification, object/video storage, backups, audit logs, rate limiting, email/SMS notifications, and the required institutional/accreditation processes.
