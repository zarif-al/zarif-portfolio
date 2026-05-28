# Zarif's Portfolio

A developer portfolio showcasing projects, writing, and experience — built with [Payload CMS 3](https://payloadcms.com) and [Next.js 16](https://nextjs.org).

## Prerequisites

- **Node.js** ≥ 18.20.2 (≥ 20.9.0 recommended)
- **pnpm** ≥ 9
- **MongoDB** running locally or via the included Docker Compose stack

## Getting started

```bash
# 1. Clone and install
git clone <repo-url> zarif-portfolio
pnpm install

# 2. Copy the environment file and fill in your values
cp .env.example .env

# 3. Start MongoDB (if not already running)
docker compose up -d mongo

# 4. Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the frontend and [http://localhost:3000/admin](http://localhost:3000/admin) for the Payload admin panel. Create your first user at `/admin` on first visit.
