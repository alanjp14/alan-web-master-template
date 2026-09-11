import { describe, expect, it } from "bun:test";
import { API_BASE_PATH, type SubnetCalcResponse } from "@app/shared";
import { app } from "./app";

const base = API_BASE_PATH;

describe("IT Web Tools API", () => {
  it("POST /tools/subnet-calc calculates IPv4 subnet metrics correctly", async () => {
    const res = await app.request(`${base}/tools/subnet-calc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ip: "192.168.1.50", prefix: 24 }),
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as SubnetCalcResponse;
    expect(body.ip).toBe("192.168.1.50");
    expect(body.prefix).toBe(24);
    expect(body.netmask).toBe("255.255.255.0");
    expect(body.networkAddress).toBe("192.168.1.0");
    expect(body.broadcastAddress).toBe("192.168.1.255");
    expect(body.firstUsableIp).toBe("192.168.1.1");
    expect(body.lastUsableIp).toBe("192.168.1.254");
    expect(body.usableHosts).toBe(254);
    expect(body.ipClass).toBe("C");
  });

  it("POST /tools/subnet-calc returns 400 on invalid IP or prefix", async () => {
    const res = await app.request(`${base}/tools/subnet-calc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ip: "invalid-ip", prefix: 99 }),
    });

    expect(res.status).toBe(400);
  });

  it("POST /tools/dns-lookup returns 400 when domain is missing", async () => {
    const res = await app.request(`${base}/tools/dns-lookup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    expect(res.status).toBe(400);
  });

  it("POST /tools/ssl-check returns 400 when domain is missing", async () => {
    const res = await app.request(`${base}/tools/ssl-check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    expect(res.status).toBe(400);
  });

  it("POST /tools/http-status returns 400 when URL is missing", async () => {
    const res = await app.request(`${base}/tools/http-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    expect(res.status).toBe(400);
  });
});
