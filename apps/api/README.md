# @app/api

The backend for this template — a [Hono](https://hono.dev) application on the
[Bun](https://bun.sh) runtime. Small on purpose: a health check plus two
read-only endpoints that back the web app's dashboard, wired so the
request/response types are shared with `@app/web` through `@app/shared`.

## Run

```bash
bun install            # from the repo root: pnpm install
bun dev                # or: pnpm --filter @app/api dev
```

Serves on `http://localhost:3001` (`API_PORT`). `bun --watch` restarts on
change.

## Endpoints

All under `/api/v1` (`API_BASE_PATH` in `@app/shared`):

| Method | Path        | Returns (`@app/shared`) | Purpose                          |
| ------ | ----------- | ----------------------- | -------------------------------- |
| GET    | `/health`   | `Health`                | Liveness, uptime, version        |
| GET    | `/stats`    | `Stat[]`                | Dashboard headline numbers       |
| GET    | `/activity` | `Activity`              | Sparkline series + source breakdown |

Every non-2xx response uses the `ApiError` shape.

## Layout

```
src/
  index.ts    Bun server entry — `export default { port, fetch }`
  app.ts      Hono app: middleware (CORS, logger), routes, error handling
  env.ts      Runtime config with dev-safe defaults
  data.ts     In-memory sample data — replace with real queries
  app.test.ts `bun test` coverage for every route
```

## Configuration

See [`.env.example`](.env.example). Nothing is required for local dev.

## Scripts

| Command          | What it does                          |
| ---------------- | ------------------------------------- |
| `bun dev`        | Watch-mode server on `API_PORT`      |
| `bun start`      | Server, no watch                      |
| `bun run build`  | Bundle to `dist/` with `bun build`   |
| `bun run typecheck` | `tsc --noEmit`                     |
| `bun test`       | Run `src/*.test.ts`                   |
| `bun run lint`   | ESLint (typescript-eslint)            |
