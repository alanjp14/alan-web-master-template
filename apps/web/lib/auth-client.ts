"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Browser-side Better Auth client.
 *
 * `baseURL` is this **web app's own** public URL, not `apps/api`'s — Better
 * Auth appends its default `/api/auth` path to it, and `next.config.ts`'s
 * `rewrites()` proxies that path to the API server-side. The browser only
 * ever talks to its own origin, so the session cookie it receives is
 * first-party — no cross-site cookie / SameSite complications even when
 * `apps/web` and `apps/api` are deployed to different domains (e.g. Vercel +
 * a VPS). See docs/arsitektur-monorepo.md.
 *
 * Must be an absolute URL (Better Auth validates this client-side) — hence
 * the env var rather than a relative path. Server Components and middleware
 * use `lib/auth-server.ts` instead; that one talks to `apps/api` directly.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
});

export const { signIn, signUp, signOut, useSession } = authClient;
