import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "./db/client";
import * as schema from "./db/schema";
import { env } from "./env";

/**
 * The single Better Auth instance for the whole system. It owns the
 * database (via the Drizzle adapter) and issues the session cookie — the
 * web app never talks to Postgres directly, only to this through
 * `/api/auth/*` (see `app.ts`) and `apps/web/lib/auth-client.ts`.
 *
 * Email/password only for now; add an OAuth provider (`socialProviders`) or
 * plugin here when a client project needs one — the schema and routes stay
 * the same.
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  baseURL: env.authBaseUrl,
  secret: env.authSecret,
  // Origins allowed to receive the session cookie / call auth endpoints
  // cross-site. In this template the web app proxies to the API through a
  // Next.js rewrite (see apps/web/next.config.ts), so the browser only ever
  // talks to its own origin — this list matters for direct
  // server-to-server calls and for any client that skips the proxy.
  trustedOrigins: env.allowedOrigins,
  emailAndPassword: {
    enabled: true,
    // No transactional email wired up yet (see docs/MONITORING.md's
    // pattern of "dormant until configured") — verification simply isn't
    // required until a client project adds a mailer here.
    requireEmailVerification: false,
  },
  advanced: {
    // The web app and API are on different ports/domains; the cookie has to
    // survive that hop when the browser talks to the API directly (e.g. in
    // dev, before/without the Next.js rewrite proxy).
    defaultCookieAttributes: env.isDev
      ? {}
      : { sameSite: "none", secure: true },
  },
});

export type Auth = typeof auth;
