import { app } from "./app";
import { env } from "./env";

/**
 * Bun server entry. `bun run src/index.ts` (or `bun --watch` in dev) picks up
 * this default export and serves it — no `Bun.serve` boilerplate needed.
 * See node_modules/bun-types or https://bun.sh/docs/api/http#export-default-syntax
 */
const server = {
  port: env.port,
  fetch: app.fetch,
};

console.log(`@app/api listening on http://localhost:${env.port}${"/api/v1"}`);

export default server;
