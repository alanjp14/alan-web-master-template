import { defineConfig } from "drizzle-kit";

/**
 * `drizzle-kit generate` reads `src/db/schema.ts` and writes SQL migrations
 * to `drizzle/`; `drizzle-kit migrate` applies them to `DATABASE_URL`. See
 * package.json's `db:*` scripts and docs/arsitektur-monorepo.md.
 *
 * Reads `process.env` directly (not `src/env.ts`, which is Bun-specific) —
 * drizzle-kit's CLI may load this file outside the Bun runtime.
 */
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://app:app@localhost:55432/app",
  },
});
