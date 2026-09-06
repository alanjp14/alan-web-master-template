import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// No nonce here deliberately: a nonce-based CSP requires every page to be
// dynamically rendered (Next.js can only inject a nonce per-request), which
// would take this template's fully static build and force it onto a server
// for every request. `'unsafe-inline'` is weaker, but it's the tradeoff Next
// itself documents for apps that want CSP without giving up static
// rendering — see node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md.
// `'unsafe-eval'` is scoped to dev only: React uses it there to reconstruct
// server error stacks in the browser; neither React nor Next use it in a
// production build.
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const nextConfig: NextConfig = {
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
