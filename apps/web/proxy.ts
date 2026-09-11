import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Route groups don't add a URL segment, so the paths they actually serve —
 * not the `(dashboard)` / `(topnav)` folder names — are what has to be
 * listed here. Keep this in sync with `app/(dashboard)/` and
 * `app/(topnav)/`; add a route's real path when you add a page to either
 * group.
 */
const PROTECTED_PATHS = ["/dashboard", "/analytics", "/settings", "/showcase", "/workspace"];

function isProtected(pathname: string): boolean {
  return PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

/**
 * Optimistic auth gate — the `proxy.ts` file convention (renamed from
 * `middleware.ts` in Next.js 16; see node_modules/next/dist/docs/01-app/
 * 03-api-reference/03-file-conventions/proxy.md). Redirects to `/sign-in`
 * when the session cookie is simply absent, with no database round-trip —
 * `getSessionCookie` only checks that a well-formed cookie exists, it does
 * not validate it. This is Better Auth's documented pattern for proxy/
 * middleware, which historically ran on the Edge runtime with no DB access;
 * Proxy defaults to the Node.js runtime as of Next 16, but the same cheap
 * check is still the right one to run before every request.
 *
 * It is a UX redirect, not the security boundary: a forged or stale cookie
 * passes this check and is only rejected once a Server Component or API
 * route calls `getServerSession()` / `requireAuth`, which do hit the
 * database. Never render sensitive data based on this check alone.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (!isProtected(pathname)) return NextResponse.next();

  const sessionCookie = getSessionCookie(request);
  if (sessionCookie) return NextResponse.next();

  const signInUrl = new URL("/sign-in", request.url);
  signInUrl.searchParams.set("redirect", `${pathname}${search}`);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|appearance-init.js).*)"],
};
