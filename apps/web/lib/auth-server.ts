import "server-only";

import { headers } from "next/headers";

import { API_ORIGIN } from "@/lib/api-client";

export interface ServerSession {
  user: { id: string; name: string; email: string };
}

/**
 * Session lookup for Server Components and Route Handlers. Unlike
 * `lib/auth-client.ts`, this talks to `apps/api` directly — a server-to-
 * server call bypasses `next.config.ts`'s browser-facing rewrite, so it has
 * to name the API's real origin. The incoming request's `Cookie` header is
 * forwarded as-is; its value validates against the database regardless of
 * which host received it; only the browser cares about the cookie's
 * `Domain`/`SameSite` attributes.
 *
 * Returns `null` on any failure (no cookie, expired session, API
 * unreachable) — callers decide whether that means "redirect to sign-in" or
 * "render as signed-out".
 */
export async function getServerSession(): Promise<ServerSession | null> {
  const cookie = (await headers()).get("cookie");
  if (!cookie) return null;

  try {
    const res = await fetch(`${API_ORIGIN}/api/auth/get-session`, {
      headers: { cookie },
      // Session state changes on every sign-in/out; never let Next cache it.
      cache: "no-store",
    });
    if (!res.ok) return null;

    const body: unknown = await res.json();
    if (
      typeof body !== "object" ||
      body === null ||
      !("user" in body) ||
      body.user === null
    ) {
      return null;
    }
    return body as ServerSession;
  } catch {
    return null;
  }
}
