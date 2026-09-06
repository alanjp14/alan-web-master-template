# Security

## Reporting a vulnerability

This is a template repository with no production deployment or user data of
its own. If you find a security issue in the template's code (as opposed to
its dependencies — see below), open an issue or contact the maintainer
directly rather than a public disclosure.

## Audit — Phase 17

Scope: XSS, sensitive data exposure, environment variables, secrets
handling, authentication/authorization flow, dependency vulnerabilities.

### Findings & fixes applied

- **No security response headers.** `next.config.ts` set none. Added:
  - `Content-Security-Policy` — `default-src 'self'` plus a scoped allowlist.
    Uses `'unsafe-inline'` for `script-src`/`style-src` rather than a nonce:
    a nonce-based CSP requires every page to render dynamically per-request
    (Next can only inject a nonce into a live response), which would force
    this template's fully static build onto a server for every request —
    not a "safe" tradeoff for a hardening pass. `'unsafe-eval'` is enabled
    only when `NODE_ENV === "development"` (React's own dev-mode stack
    reconstruction needs it; neither React nor Next use it in production).
  - `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
    `Referrer-Policy: strict-origin-when-cross-origin`,
    `Permissions-Policy: camera=(), microphone=(), geolocation=()` — none of
    which this app uses, so denying them by default costs nothing.
  - `Strict-Transport-Security` — a no-op over plain HTTP (e.g. local dev);
    takes effect once actually deployed behind HTTPS.

  Verified against a real `next build` + `next start` (not just dev mode,
  since dev and prod CSPs differ): fetched the response headers directly,
  confirmed every value present and `'unsafe-eval'` correctly absent from
  the production CSP, and exercised the dropdown menu, sidebar collapse, and
  theme toggle live with the policy active — no CSP violations, static
  generation (`x-nextjs-prerender`) still intact.

- **Error boundaries trusted `error.message` unconditionally.**
  `app/(dashboard)/error.tsx` and `app/global-error.tsx` rendered the raw
  error message to the end user. Next.js already redacts a Server
  Component render error's message in production (replacing it with a
  generic one plus a `digest` for log correlation) — but that's framework
  behavior for one specific error path, not a guarantee for every way an
  error can reach these boundaries (a Server Action or Route Handler this
  template's users add later could throw something with sensitive detail in
  its `message` — a connection string, an internal path). Both boundaries
  now show the real message only when `NODE_ENV === "development"`; the
  generic fallback otherwise. `global-error.tsx` also gained the same
  `console.error` logging `error.tsx` already had — it previously logged
  nothing, despite being the boundary for the most severe failure (the root
  layout itself throwing).

### Audited, confirmed clean — no changes needed

- **XSS**: no `dangerouslySetInnerHTML`, `eval`, `new Function`, or
  `document.write` anywhere in the codebase. React's default escaping is
  the only rendering path in use.
- **Secrets handling**: no hardcoded API keys, tokens, or credentials found
  (the `defaultValue="1234"` on the demo `Field`/`FieldError` password input
  in the dashboard showcase is static UI demo content, not a real
  credential). `.env.example` documents the convention; `.gitignore`
  correctly excludes real `.env*` files.
- **Environment variables**: zero `process.env` reads anywhere in the app —
  nothing to leak.
- **Dependency vulnerabilities**: `pnpm audit` reports no known
  vulnerabilities (re-checked after this phase's changes; no new
  dependencies were added).
- **Authentication / authorization**: this template has neither — by
  design (see `README.md`'s "before you ship" list). `DashboardLayout`'s
  optional `user` prop only toggles whether the account menu renders; there
  is no session, no protected route, nothing to bypass. The account menu's
  "Sign out" item has no handler wired, which is intentional (not a
  regression to fix) until real auth exists to sign out of.

### Recommendations for later (not applied — need real infrastructure, not a "safe fix")

- Once auth exists: protect routes server-side (middleware or per-layout
  checks), not just by hiding UI for a signed-out `user`.
- Once Server Actions or Route Handlers exist: validate and sanitize all
  input server-side regardless of client-side validation; never trust
  `FieldError`'s client-shown message as the source of truth.
- Consider a nonce-based CSP (dropping `'unsafe-inline'`) if/when the app
  needs server-rendering anyway (e.g., once it fetches real per-request
  data) — the dynamic-rendering cost this phase avoided stops being a
  tradeoff at that point.
