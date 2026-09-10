import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// The Bun API (`@app/api`) the browser calls from `lib/api-client.ts`. It's a
// separate origin, so it has to be named in `connect-src` or the CSP blocks
// every fetch to it. Derived from the same env var the client uses; the
// localhost fallback matches the API's dev port.
const apiOrigin = (() => {
  try {
    return new URL(
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
    ).origin;
  } catch {
    return "http://localhost:3001";
  }
})();

// No nonce here deliberately: a nonce-based CSP requires every page to be
// dynamically rendered (Next.js can only inject a nonce per-request), which
// would take this template's fully static build and force it onto a server
// for every request. `'unsafe-inline'` is weaker, but it's the tradeoff Next
// itself documents for apps that want CSP without giving up static
// rendering — see node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md.
// `'unsafe-eval'` is scoped to dev only: React uses it there to reconstruct
// server error stacks in the browser; neither React nor Next use it in a
// production build.
//
// `va.vercel-scripts.com` and `www.clarity.ms` are here for the monitoring
// integrations in instrumentation-client.ts / app/layout.tsx (see
// docs/MONITORING.md) — both load an external script and send data back to
// it, so they need both script-src and connect-src. Sentry needs neither:
// it's disabled with no DSN configured, and once one is, its ingest URL is
// project-specific, so add it to connect-src yourself at that point (the
// DSN's own host is the value to add).
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://www.clarity.ms${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  connect-src 'self' ${apiOrigin} https://va.vercel-scripts.com https://www.clarity.ms;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const nextConfig: NextConfig = {
  // Don't advertise the framework (and, historically, its version) to every
  // visitor and scanner. One less hint for someone fingerprinting the stack.
  poweredByHeader: false,

  // `@app/shared` is published inside the monorepo as raw TypeScript (no
  // build step), so Next has to compile it the same way it compiles this
  // app's own source.
  transpilePackages: ["@app/shared"],

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: cspHeader },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Isolate this origin's browsing-context group. `allow-popups` keeps
          // an OAuth / payment popup able to talk back to its opener, so this
          // stays correct once a consuming app adds a popup-based sign-in.
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          // Cross-origin sites can't read this app's responses (defence against
          // Spectre-style cross-origin leaks). Assets meant to be embedded
          // elsewhere would need a looser value on their own route.
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
          // Don't leak browsing behaviour by pre-resolving DNS for off-site
          // links the user hasn't clicked.
          { key: "X-DNS-Prefetch-Control", value: "off" },
          // Only takes effect once the app is actually served over HTTPS —
          // harmless over plain HTTP locally, where browsers ignore it.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
