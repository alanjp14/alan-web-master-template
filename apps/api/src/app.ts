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

import { getActivity, getStats } from "./data";
import { env, isDev } from "./env";

export const API_VERSION = "0.1.0";

const startedAt = Date.now();

/**
 * The Hono application, separated from the server entry (`index.ts`) so tests
 * can exercise it with `app.request(...)` without binding a port.
 */
export const app = new Hono();

app.use("*", logger());

app.use(
  `${API_BASE_PATH}/*`,
  cors({
    origin: (origin) => {
      if (isDev) return origin ?? "*";
      return env.allowedOrigins.includes(origin) ? origin : null;
    },
    allowMethods: ["GET", "OPTIONS"],
    maxAge: 600,
  }),
);

const v1 = new Hono();

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
      message: status === 500 && !isDev ? "Internal Server Error" : err.message,
      code: status === 404 ? "not_found" : status === 500 ? "internal" : "error",
    },
  };
  if (status === 500) console.error(err);
  return c.json(body, status);
});
