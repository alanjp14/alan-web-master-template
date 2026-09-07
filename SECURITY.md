# Security

## Reporting a vulnerability

Please **do not open a public issue** for a security problem.

Report it privately through GitHub's
[Report a vulnerability](https://github.com/alanjp14/alan-web-master-template/security/advisories/new)
form (Security tab → Advisories). Include what you found, where, and a
reproduction if you have one. You'll get an acknowledgement, and a fix and
disclosure timeline once it's triaged.

This repository is a template — it has no deployment or user data of its
own — so most real-world risk lives in what a consuming application adds on
top (auth, data, integrations). The **[security posture](#security-posture)**
section below is the checklist for that.

## Security posture

What the template does to stay safe to build on, and what it deliberately
leaves to the consuming app.

### In the template

| Area | Control |
| ---- | ------- |
| Response headers | CSP, HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`, `X-DNS-Prefetch-Control` — all in `next.config.ts`, applied to every route |
| Framework fingerprint | `poweredByHeader: false` |
| Rendering | React's default escaping only — no `dangerouslySetInnerHTML`, `eval`, `new Function`, `document.write` |
| Error output | Raw `error.message` shown only in development; generic message + logged `digest` in production |
| Secrets | None in the tree or git history; `.gitignore` excludes `.env*` except `.env.example` (placeholders only); no `process.env` reads in app code |
| CI supply chain | GitHub Actions pinned to full commit SHAs; workflow `permissions` set to least privilege; `persist-credentials: false` on checkout |
| Dependency scanning | `pnpm audit --audit-level high` fails CI on a high/critical advisory; `actions/dependency-review-action` reports vulnerable/badly-licensed deps on PRs (advisory — see note below); Dependabot (npm + actions) weekly |
| Static analysis | CodeQL (`security-and-quality`) on every push/PR and weekly |
| Review | `CODEOWNERS` on the whole repo, `.github/` and `next.config.ts` called out explicitly |

### Left to the consuming app (see [README's "Before you ship"](README.md#before-you-ship))

- **Authentication and server-side authorization.** The template has none.
  `DashboardLayout`'s `user` prop only toggles UI. Protect routes in
  middleware or a layout, never by hiding a menu.
- **Input validation.** Validate and sanitize every Server Action / Route
  Handler input server-side; never trust a client-shown `FieldError`.
- **The Sentry CSP host.** Setting a real `NEXT_PUBLIC_SENTRY_DSN` also means
  adding its ingest host to `connect-src` in `next.config.ts`.
- **Branch protection.** Turn on "require a pull request", "require review
  from Code Owners" and "require status checks (CI, CodeQL)" for `main` in
  the repo settings — the `CODEOWNERS` file only bites once this is on.
- **Secret scanning & push protection.** Enable both in the repo's
  Security settings (free for public repositories).
- **A nonce-based CSP**, if the app moves to per-request rendering anyway —
  it removes `'unsafe-inline'` for scripts, which the static-first template
  can't drop without forcing dynamic rendering on every page.

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
- **Secrets handling**: no hardcoded API keys, tokens, or credentials found.
  `.env.example` documents the convention; `.gitignore` correctly excludes
  real `.env*` files. (Phase 24 note: the dashboard showcase's demo password
  input, which previously carried a `defaultValue`, now renders empty with a
  placeholder — one less thing for a naive secret scanner to flag.)
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

## Public-repo hardening — Phase 24

Applied when the template was published for reuse across real, public,
go-live projects.

### CI / supply chain

- **All GitHub Actions pinned to a full commit SHA** (`actions/checkout`,
  `actions/setup-node`, `pnpm/action-setup`, `github/codeql-action`,
  `actions/dependency-review-action`), with the version in a trailing
  comment. A mutated or force-pushed tag can no longer change what runs.
- **Workflow `permissions` set explicitly to least privilege** — `contents:
  read` for CI, plus `security-events: write` only where CodeQL needs it.
  Previously unset, which inherits the repository default.
- **`persist-credentials: false`** on every checkout — the job never needs
  the token after clone.
- **`pnpm audit --audit-level high`** runs as its own CI job; a high or
  critical advisory in the dependency tree fails the build.
- **`actions/dependency-review-action`** on pull requests reports a
  dependency change that would introduce a vulnerable or disallowed-license
  package. It runs `warn-only` because the action needs the repo's
  **Dependency graph** feature enabled to work at all — turn that on
  (Settings → Advanced Security), then drop `warn-only` / `continue-on-error`
  in `.github/workflows/dependency-review.yml` to make it blocking.
- **Dependabot** (`.github/dependabot.yml`) — weekly `npm` and
  `github-actions` updates; minor/patch grouped into one PR.

### Application

- **`Cross-Origin-Opener-Policy: same-origin-allow-popups`** and
  **`Cross-Origin-Resource-Policy: same-origin`** added to `next.config.ts`
  — browsing-context isolation and defence against cross-origin response
  leaks. `allow-popups` keeps a future OAuth/payment popup working.
- **`X-DNS-Prefetch-Control: off`** — no DNS prefetching of un-clicked
  off-site links.
- **`poweredByHeader: false`** — the `X-Powered-By: Next.js` header is gone.

### Static analysis

- **CodeQL** (`.github/workflows/codeql.yml`) with the
  `security-and-quality` query suite, on every push and PR to `main` /
  `develop` and on a weekly schedule.

### Verified

`pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` all pass. Response
headers confirmed against a real `next build` + `next start`: every header
above present, `X-Powered-By` absent, production CSP unchanged (no
`'unsafe-eval'`), all routes still statically prerendered.
