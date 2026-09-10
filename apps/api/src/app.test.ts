import { describe, expect, it } from "bun:test";

import {
  API_BASE_PATH,
  type Activity,
  type ApiError,
  type Health,
  type Stat,
} from "@app/shared";

import { app } from "./app";

const base = API_BASE_PATH;

describe("@app/api routes", () => {
  it("GET /health reports ok with a version and numeric uptime", async () => {
    const res = await app.request(`${base}/health`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as Health;
    expect(body.status).toBe("ok");
    expect(typeof body.uptime).toBe("number");
    expect(body.version).toBeTruthy();
  });

  it("GET /stats returns a non-empty list of well-formed stats", async () => {
    const res = await app.request(`${base}/stats`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as Stat[];
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    for (const stat of body) {
      expect(typeof stat.id).toBe("string");
      expect(["up", "down", "flat"]).toContain(stat.trend);
    }
  });

  it("GET /activity returns a sparkline and a breakdown", async () => {
    const res = await app.request(`${base}/activity`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as Activity;
    expect(body.sparkline.length).toBeGreaterThan(0);
    expect(body.breakdown.length).toBeGreaterThan(0);
  });

  it("unknown routes return the uniform 404 error body", async () => {
    const res = await app.request(`${base}/nope`);
    expect(res.status).toBe(404);
    const body = (await res.json()) as ApiError;
    expect(body.error.code).toBe("not_found");
  });

  it("answers CORS preflight for an allowed origin", async () => {
    const res = await app.request(`${base}/stats`, {
      method: "OPTIONS",
      headers: { Origin: "http://localhost:3000", "Access-Control-Request-Method": "GET" },
    });
    expect(res.headers.get("access-control-allow-origin")).toBe("http://localhost:3000");
  });
});
