/**
 * The API's shape as data: base path, version, and every route the web app
 * is allowed to call. Import these instead of hand-writing URL strings so a
 * renamed route is a compile error, not a 404 at runtime.
 */

/** Mounted under this prefix by `@app/api` (see `apps/api/src/app.ts`). */
export const API_BASE_PATH = "/api/v1" as const;

/** Every endpoint the web app calls, relative to {@link API_BASE_PATH}. */
export const API_ROUTES = {
  health: "/health",
  stats: "/stats",
  activity: "/activity",
} as const;

export type ApiRouteName = keyof typeof API_ROUTES;

/** Build an absolute API URL from a configured origin and a known route. */
export function apiUrl(origin: string, route: ApiRouteName): string {
  return `${origin.replace(/\/$/, "")}${API_BASE_PATH}${API_ROUTES[route]}`;
}
