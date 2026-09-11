import { describe, expect, it } from "bun:test";

import { app } from "./app";

/**
 * Exercises the real Better Auth + Drizzle + Postgres stack — these hit the
 * database configured by `DATABASE_URL` (see `src/env.ts`), unlike
 * `app.test.ts`'s routes. Needs a running Postgres with migrations applied:
 *
 *   docker compose up -d db
 *   pnpm --filter @app/api db:migrate
 *   bun test
 *
 * A fresh random email per run avoids colliding with a previous run's data
 * in a persistent dev database.
 */

function signUpPayload() {
  const id = crypto.randomUUID();
  return {
    email: `test-${id}@example.com`,
    password: "correct-horse-battery-staple",
    name: "Test User",
  };
}

function cookieFrom(res: Response): string {
  const setCookie = res.headers.get("set-cookie");
  if (!setCookie) throw new Error("Expected a Set-Cookie header");
  return setCookie.split(";")[0]!;
}

describe("auth (Better Auth + Postgres)", () => {
  it("signs up, returns a session cookie, and GET /me reflects the user", async () => {
    const payload = signUpPayload();

    const signUp = await app.request("/api/auth/sign-up/email", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "http://localhost:3000" },
      body: JSON.stringify(payload),
    });
    expect(signUp.status).toBe(200);
    const cookie = cookieFrom(signUp);

    const me = await app.request("/api/v1/me", { headers: { Cookie: cookie } });
    expect(me.status).toBe(200);
    const body = (await me.json()) as { email: string; name: string };
    expect(body.email).toBe(payload.email);
    expect(body.name).toBe(payload.name);
  });

  it("rejects sign-in with the wrong password", async () => {
    const payload = signUpPayload();
    await app.request("/api/auth/sign-up/email", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "http://localhost:3000" },
      body: JSON.stringify(payload),
    });

    const signIn = await app.request("/api/auth/sign-in/email", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "http://localhost:3000" },
      body: JSON.stringify({ email: payload.email, password: "wrong-password" }),
    });
    expect(signIn.status).toBe(401);
  });

  it("GET /me without a session returns 401", async () => {
    const res = await app.request("/api/v1/me");
    expect(res.status).toBe(401);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("error");
  });

  it("sign-out clears the session — /me then returns 401", async () => {
    const payload = signUpPayload();
    const signUp = await app.request("/api/auth/sign-up/email", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "http://localhost:3000" },
      body: JSON.stringify(payload),
    });
    const cookie = cookieFrom(signUp);

    const signOut = await app.request("/api/auth/sign-out", {
      method: "POST",
      headers: { Cookie: cookie, Origin: "http://localhost:3000" },
    });
    expect(signOut.status).toBe(200);

    const me = await app.request("/api/v1/me", { headers: { Cookie: cookie } });
    expect(me.status).toBe(401);
  });
});
