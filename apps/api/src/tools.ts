import dns from "node:dns/promises";
import tls from "node:tls";
import { Hono } from "hono";
import type {
  DnsLookupRequest,
  DnsLookupResponse,
  DnsRecord,
  HttpStatusRequest,
  HttpStatusResponse,
  SslCheckRequest,
  SslCheckResponse,
  SubnetCalcRequest,
  SubnetCalcResponse,
} from "@app/shared";

export const toolsRouter = new Hono();

/**
 * 1. POST /tools/dns-lookup
 * Resolves DNS records using high-performance native DNS resolution.
 */
toolsRouter.post("/dns-lookup", async (c) => {
  const body = await c.req.json<DnsLookupRequest>().catch(() => null);
  const domain = body?.domain?.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  const recordType = (body?.recordType || "ANY").toUpperCase();

  if (!domain) {
    return c.json({ error: { message: "Domain name is required", code: "bad_request" } }, 400);
  }

  const start = performance.now();
  const records: DnsRecord[] = [];

  try {
    if (recordType === "A" || recordType === "ANY") {
      const a = await dns.resolve4(domain, { ttl: true }).catch(() => []);
      for (const item of a) {
        records.push({ type: "A", value: item.address, ttl: item.ttl });
      }
    }

    if (recordType === "AAAA" || recordType === "ANY") {
      const aaaa = await dns.resolve6(domain, { ttl: true }).catch(() => []);
      for (const item of aaaa) {
        records.push({ type: "AAAA", value: item.address, ttl: item.ttl });
      }
    }

    if (recordType === "MX" || recordType === "ANY") {
      const mx = await dns.resolveMx(domain).catch(() => []);
      for (const item of mx) {
        records.push({ type: "MX", value: item.exchange, priority: item.priority });
      }
    }

    if (recordType === "TXT" || recordType === "ANY") {
      const txt = await dns.resolveTxt(domain).catch(() => []);
      for (const item of txt) {
        records.push({ type: "TXT", value: item.join(" ") });
      }
    }

    if (recordType === "NS" || recordType === "ANY") {
      const ns = await dns.resolveNs(domain).catch(() => []);
      for (const item of ns) {
        records.push({ type: "NS", value: item });
      }
    }

    if (recordType === "CNAME" || recordType === "ANY") {
      const cname = await dns.resolveCname(domain).catch(() => []);
      for (const item of cname) {
        records.push({ type: "CNAME", value: item });
      }
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "DNS resolution failed";
    return c.json({ error: { message: msg, code: "dns_error" } }, 400);
  }

  const responseTimeMs = Math.round(performance.now() - start);

  const res: DnsLookupResponse = {
    domain,
    recordType,
    records,
    responseTimeMs,
  };

  return c.json(res);
});

/**
 * 2. POST /tools/ssl-check
 * Inspects TLS certificate details and expiration dates via TLS socket.
 */
toolsRouter.post("/ssl-check", async (c) => {
  const body = await c.req.json<SslCheckRequest>().catch(() => null);
  const domain = body?.domain?.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  const port = Number(body?.port) || 443;

  if (!domain) {
    return c.json({ error: { message: "Domain name is required", code: "bad_request" } }, 400);
  }

  return new Promise<Response>((resolve) => {
    const timer = setTimeout(() => {
      socket.destroy();
      resolve(
        c.json(
          {
            error: {
              message: `Connection to ${domain}:${port} timed out after 5000ms`,
              code: "timeout",
            },
          },
          504
        )
      );
    }, 5000);

    const socket = tls.connect(
      {
        host: domain,
        port,
        servername: domain,
        rejectUnauthorized: false,
      },
      () => {
        clearTimeout(timer);
        const cert = socket.getPeerCertificate();
        const protocol = socket.getProtocol() || "TLS";
        const cipher = socket.getCipher()?.name;
        const authorized = socket.authorized;

        socket.end();

        if (!cert || Object.keys(cert).length === 0) {
          return resolve(
            c.json(
              {
                error: {
                  message: `No SSL/TLS certificate provided by ${domain}`,
                  code: "no_cert",
                },
              },
              400
            )
          );
        }

        const validTo = new Date(cert.valid_to).toISOString();
        const validFrom = new Date(cert.valid_from).toISOString();
        const daysRemaining = Math.max(
          0,
          Math.floor((new Date(cert.valid_to).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        );

        const issuerString =
          typeof cert.issuer === "object" && cert.issuer
            ? cert.issuer.O || cert.issuer.CN || JSON.stringify(cert.issuer)
            : String(cert.issuer || "Unknown");

        const subjectString =
          typeof cert.subject === "object" && cert.subject
            ? cert.subject.CN || cert.subject.O || domain
            : domain;

        const res: SslCheckResponse = {
          domain,
          port,
          valid: daysRemaining > 0 && authorized,
          issuer: issuerString,
          subject: subjectString,
          validFrom,
          validTo,
          daysRemaining,
          protocol,
          cipher,
          authorized,
        };

        resolve(c.json(res));
      }
    );

    socket.on("error", (err: Error) => {
      clearTimeout(timer);
      socket.destroy();
      resolve(
        c.json(
          {
            error: {
              message: `SSL check failed: ${err.message}`,
              code: "ssl_error",
            },
          },
          400
        )
      );
    });
  });
});

/**
 * 3. POST /tools/http-status
 * Inspects HTTP response status, TTFB latency, and security headers.
 */
toolsRouter.post("/http-status", async (c) => {
  const body = await c.req.json<HttpStatusRequest>().catch(() => null);
  let targetUrl = body?.url?.trim();

  if (!targetUrl) {
    return c.json({ error: { message: "URL is required", code: "bad_request" } }, 400);
  }

  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = `https://${targetUrl}`;
  }

  try {
    new URL(targetUrl);
  } catch {
    return c.json({ error: { message: "Invalid URL format", code: "bad_request" } }, 400);
  }

  const start = performance.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(targetUrl, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "User-Agent": "Alan-IT-Tools-Inspector/1.0",
        Accept: "*/*",
      },
      redirect: "follow",
    });
    clearTimeout(timeoutId);

    const responseTimeMs = Math.round(performance.now() - start);

    const headersRecord: Record<string, string> = {};
    res.headers.forEach((val, key) => {
      headersRecord[key.toLowerCase()] = val;
    });

    const responsePayload: HttpStatusResponse = {
      url: targetUrl,
      status: res.status,
      statusText: res.statusText || String(res.status),
      responseTimeMs,
      headers: headersRecord,
      securityAudit: {
        hsts: "strict-transport-security" in headersRecord,
        csp: "content-security-policy" in headersRecord,
        xFrameOptions: "x-frame-options" in headersRecord,
        xContentTypeOptions: "x-content-type-options" in headersRecord,
        referrerPolicy: "referrer-policy" in headersRecord,
      },
    };

    return c.json(responsePayload);
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const msg = err instanceof Error ? err.message : "Failed to fetch URL";
    return c.json({ error: { message: `Request failed: ${msg}`, code: "fetch_error" } }, 400);
  }
});

/**
 * 4. POST /tools/subnet-calc
 * Performs IPv4 subnet calculations, bitwise masks, and host ranges.
 */
toolsRouter.post("/subnet-calc", async (c) => {
  const body = await c.req.json<SubnetCalcRequest>().catch(() => null);
  const ip = body?.ip?.trim();
  const prefix = Number(body?.prefix);

  if (!ip || isNaN(prefix) || prefix < 0 || prefix > 32) {
    return c.json(
      { error: { message: "Valid IPv4 address and prefix (0-32) are required", code: "bad_request" } },
      400
    );
  }

  const octets = ip.split(".").map(Number);
  if (octets.length !== 4 || octets.some((o) => isNaN(o) || o < 0 || o > 255)) {
    return c.json(
      { error: { message: "Invalid IPv4 address format (e.g. 192.168.1.1)", code: "bad_request" } },
      400
    );
  }

  // Helper: int to IP string
  const intToIp = (int: number): string => {
    return [
      (int >>> 24) & 255,
      (int >>> 16) & 255,
      (int >>> 8) & 255,
      int & 255,
    ].join(".");
  };

  const ipInt =
    ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;

  const maskInt = prefix === 0 ? 0 : ((0xffffffff << (32 - prefix)) >>> 0);
  const wildcardInt = ~maskInt >>> 0;
  const netInt = (ipInt & maskInt) >>> 0;
  const broadInt = (netInt | wildcardInt) >>> 0;

  const totalHosts = prefix === 32 ? 1 : Math.pow(2, 32 - prefix);
  let usableHosts = 0;
  let firstUsable = "";
  let lastUsable = "";

  if (prefix === 32) {
    usableHosts = 1;
    firstUsable = intToIp(ipInt);
    lastUsable = intToIp(ipInt);
  } else if (prefix === 31) {
    usableHosts = 2;
    firstUsable = intToIp(netInt);
    lastUsable = intToIp(broadInt);
  } else {
    usableHosts = totalHosts - 2;
    firstUsable = intToIp(netInt + 1);
    lastUsable = intToIp(broadInt - 1);
  }

  // Class detection
  const firstOctet = octets[0];
  let ipClass = "A";
  if (firstOctet >= 128 && firstOctet <= 191) ipClass = "B";
  else if (firstOctet >= 192 && firstOctet <= 223) ipClass = "C";
  else if (firstOctet >= 224 && firstOctet <= 239) ipClass = "D (Multicast)";
  else if (firstOctet >= 240) ipClass = "E (Experimental)";

  const res: SubnetCalcResponse = {
    ip,
    prefix,
    netmask: intToIp(maskInt),
    wildcardMask: intToIp(wildcardInt),
    networkAddress: intToIp(netInt),
    broadcastAddress: intToIp(broadInt),
    firstUsableIp: firstUsable,
    lastUsableIp: lastUsable,
    totalHosts,
    usableHosts,
    ipClass,
  };

  return c.json(res);
});
