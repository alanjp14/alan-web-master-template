import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";

import {
  API_BASE_PATH,
  API_ROUTES,
  type ApiError,
  type Health,
} from "@app/shared";

import { auth } from "./auth";
import { getActivity, getStats } from "./data";
import { env } from "./env";
import { requireAuth, type AuthVariables } from "./middleware/auth";

export const API_VERSION = "0.1.0";

const startedAt = Date.now();

/**
 * The Hono application, separated from the server entry (`index.ts`) so tests
 * can exercise it with `app.request(...)` without binding a port.
 */
export const app = new Hono<{ Variables: AuthVariables }>();

app.use("*", logger());

// One CORS policy for both the auth routes and the JSON API: `credentials:
// true` is required for the browser to send/receive the session cookie, and
// that in turn requires echoing a specific origin — `Access-Control-Allow-
// Origin: *` is invalid alongside credentials, per the Fetch spec.
const corsMiddleware = cors({
  origin: (origin) => {
    if (env.isDev) return origin ?? "*";
    return origin !== undefined && env.allowedOrigins.includes(origin) ? origin : null;
  },
  allowMethods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  maxAge: 600,
});

app.use("/api/auth/*", corsMiddleware);
app.use(`${API_BASE_PATH}/*`, corsMiddleware);

// Better Auth owns everything under /api/auth — sign-up, sign-in, sign-out,
// session lookup. The web app talks to this through a Next.js rewrite (see
// apps/web/next.config.ts) so the cookie is first-party from the browser's
// perspective; see docs/arsitektur-monorepo.md for why.
app.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw));

const v1 = new Hono<{ Variables: AuthVariables }>();

v1.get(API_ROUTES.health, (c) => {
  const body: Health = {
    status: "ok",
    uptime: Math.floor((Date.now() - startedAt) / 1000),
    timestamp: new Date().toISOString(),
    version: API_VERSION,
  };
  return c.json(body);
});

v1.get(API_ROUTES.stats, (c) => c.json(getStats()));

v1.get(API_ROUTES.activity, (c) => c.json(getActivity()));

// Reference protected route: the pattern to copy for any endpoint that
// needs a signed-in caller. `requireAuth` returns 401 before this runs if
// the request has no valid session.
v1.get(API_ROUTES.me, requireAuth, (c) => {
  const user = c.get("user");
  return c.json({ id: user.id, name: user.name, email: user.email });
});

app.route(API_BASE_PATH, v1);

app.notFound((c) => {
  const body: ApiError = {
    error: { message: `No route for ${c.req.method} ${c.req.path}`, code: "not_found" },
  };
  return c.json(body, 404);
});

app.onError((err, c) => {
  const status = err instanceof HTTPException ? err.status : 500;
  const body: ApiError = {
    error: {
      message: status === 500 && !env.isDev ? "Internal Server Error" : err.message,
      code: status === 404 ? "not_found" : status === 500 ? "internal" : "error",
    },
  };
  if (status === 500) console.error(err);
  return c.json(body, status);
});
