import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

import { auth } from "../auth";

type AuthSession = Awaited<ReturnType<typeof auth.api.getSession>>;

/** What `c.get("user")` / `c.get("session")` resolve to on a protected route. */
export type AuthVariables = {
  user: NonNullable<AuthSession>["user"];
  session: NonNullable<AuthSession>["session"];
};

/**
 * Resolves the caller's session from the request's cookies and rejects with
 * 401 if there isn't one. Apply to any route that needs a signed-in user:
 *
 * ```ts
 * v1.get("/me", requireAuth, (c) => c.json(c.get("user")));
 * ```
 */
export const requireAuth = createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
  const result = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!result) {
    throw new HTTPException(401, { message: "Authentication required" });
  }

  c.set("user", result.user);
  c.set("session", result.session);
  await next();
});
