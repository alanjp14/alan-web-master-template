# @app/api

The backend for this template — a [Hono](https://hono.dev) application on the
[Bun](https://bun.sh) runtime, with [Better Auth](https://www.better-auth.com)
(email/password) backed by Postgres via [Drizzle ORM](https://orm.drizzle.team).

## Run

```bash
docker compose up -d db              # from the repo root — local Postgres
pnpm --filter @app/api db:migrate    # apply the schema
bun install                          # from here: pnpm install (repo root)
bun dev                              # or: pnpm --filter @app/api dev
```

Serves on `http://localhost:3001` (`API_PORT`). `bun --watch` restarts on
change. No `.env` needed for local dev — `src/env.ts`'s defaults point at the
`docker-compose.yml` database.

## Endpoints

### Auth — `/api/auth/*` (Better Auth)

Sign-up, sign-in, sign-out, session lookup, password reset request — the
full set Better Auth's email/password provider exposes. The web app doesn't
call these directly; see `apps/web/lib/auth-client.ts` and
`apps/web/next.config.ts`'s rewrite for why. Configuration (secret, cookie
attributes, trusted origins) lives in `src/auth.ts`.

### JSON API — `/api/v1/*` (`API_BASE_PATH` in `@app/shared`)

| Method | Path        | Returns (`@app/shared`) | Auth        | Purpose                          |
| ------ | ----------- | ------------------------ | ----------- | --------------------------------- |
| GET    | `/health`   | `Health`                  | —           | Liveness, uptime, version         |
| GET    | `/stats`    | `Stat[]`                  | —           | Dashboard headline numbers        |
| GET    | `/activity` | `Activity`                | —           | Sparkline series + source breakdown |
| GET    | `/me`       | `AuthUser`                | **session** | Reference protected route — copy this pattern |

Every non-2xx response uses the `ApiError` shape. Add `requireAuth` (from
`src/middleware/auth.ts`) to any new route that needs a signed-in caller —
see `/me` in `src/app.ts` for the pattern.

## Layout

```
src/
  index.ts        Bun server entry — `export default { port, fetch }`
  app.ts          Hono app: CORS, /api/auth mount, routes, error handling
  auth.ts         Better Auth instance (Drizzle adapter, email/password)
  env.ts          Runtime config — dev-safe defaults, required-in-prod checks
  data.ts         In-memory sample data for /stats, /activity — replace with real queries
  db/
    schema.ts     Better Auth's core tables (user, session, account, verification)
    client.ts     Drizzle + postgres.js connection
  middleware/
    auth.ts       `requireAuth` — resolves the session or returns 401
  app.test.ts     `bun test` for the public routes
  auth.test.ts    `bun test` for the auth flow — needs a running, migrated Postgres
```

## Database

Schema lives in `src/db/schema.ts`, migrations are generated SQL in
`drizzle/`. Add your own domain tables in sibling files under `src/db/` and
export them from `db/index.ts`; leave the four auth tables alone.

| Command                        | What it does                                  |
| ------------------------------- | ---------------------------------------------- |
| `pnpm --filter @app/api db:generate` | Diff `schema.ts` against the last migration, write new SQL |
| `pnpm --filter @app/api db:migrate`  | Apply pending migrations to `DATABASE_URL`    |
| `pnpm --filter @app/api db:push`     | Push schema straight to the DB, no migration file (prototyping only) |
| `pnpm --filter @app/api db:studio`   | Open Drizzle Studio (browse/edit data)        |

Or run these with `bun`/`bunx` directly from `apps/api/` — see
`package.json`.

## Configuration

See [`.env.example`](.env.example). Nothing is required for local dev;
`DATABASE_URL` and `BETTER_AUTH_SECRET` are **required** once
`NODE_ENV=production` (the process refuses to start without them).

## Scripts

| Command              | What it does                          |
| --------------------- | -------------------------------------- |
| `bun dev`             | Watch-mode server on `API_PORT`       |
| `bun start`           | Server, no watch                       |
| `bun run build`       | Bundle to `dist/` with `bun build`    |
| `bun run typecheck`   | `tsc --noEmit`                        |
| `bun test`            | Run `src/*.test.ts` (needs a migrated Postgres for `auth.test.ts`) |
| `bun run lint`        | ESLint (typescript-eslint)             |
| `bun run db:*`        | Drizzle Kit — see Database above       |
