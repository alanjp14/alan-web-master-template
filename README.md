# Alan Web Master Template

An enterprise UI/UX template — a **pnpm monorepo** pairing a Next.js App
Router frontend (`apps/web`) with a Bun + Hono API (`apps/api`) backed by
Postgres, real authentication (Better Auth) already wired end to end, and
request/response types shared through `packages/shared`. The frontend ships
four switchable brand themes, four layout shells (sidebar dashboard, top-nav
workspace, marketing, auth), a coherent component library, and the
supporting animation, accessibility, state-handling and observability
patterns, ready to build real product pages on top of.

> **Dokumentasi bahasa Indonesia:** [analisis & rekomendasi](docs/analisis-dan-rekomendasi.md) ·
> [arsitektur monorepo (Next.js + Bun)](docs/arsitektur-monorepo.md) ·
> [deploy VPS + Vercel](docs/deploy-vps-vercel.md) ·
> [sistem multi-tema & densitas](docs/multi-tema.md) ·
> [varian layout](docs/varian-layout.md).

---

## Table of contents

- [Overview](#overview)
- [Using this template](#using-this-template)
- [Architecture](#architecture)
- [Setup](#setup)
- [Development](#development)
- [Deployment](#deployment)
- [Environment variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Further reading](#further-reading)

---

## Overview

This repository is a **starting point**, not a finished application. It
provides the parts every dashboard-style product needs and gets wrong the
first time — a persistent layout shell, a coherent set of data-widget
components, themed light/dark tokens, motion primitives that respect
`prefers-reduced-motion`, branded error/loading boundaries, and monitoring
hooks that stay dormant until configured.

It **does** include a real backend (`apps/api` — Hono on Bun) with real
**authentication** (Better Auth, email/password, Postgres via Drizzle) and
a real, protected `/dashboard` — sign up, sign in, and the session actually
gates the route server-side. What it deliberately does **not** include:
your product's **business logic and domain data** — the app-specific
tables, screens and rules only you know. Those are application concerns;
see [Before you ship](#before-you-ship).

The conventions the template already follows are documented as project
standards so code added on top stays consistent with it:
[folder](docs/standards/folder-standards.md),
[coding](docs/standards/coding-standards.md),
[component](docs/standards/component-standards.md), and
[naming](docs/standards/naming-standards.md) standards
([index](docs/standards/README.md)).

### Feature summary

| Area           | What you get                                                                                 |
| -------------- | -------------------------------------------------------------------------------------------- |
| Workspace      | pnpm monorepo: `apps/web` (Next.js), `apps/api` (Bun + Hono), `packages/shared` (types + API contract). Root scripts run all three |
| Backend        | `apps/api` — Hono on Bun. `GET /api/v1/health \| /stats \| /activity \| /me`, uniform `ApiError` body, CORS, request logging, `bun test` per route. `/stats` and `/activity` are in-memory sample data to swap for real queries |
| Auth & database | Real email/password auth (**Better Auth**) backed by **Postgres** (**Drizzle ORM**) in `apps/api`. Session cookie proxied through `apps/web` (first-party, safe cross-domain). `/dashboard` and `/workspace` are protected both at `proxy.ts` and server-component level. See [docs/arsitektur-monorepo.md §7](docs/arsitektur-monorepo.md#7-autentikasi--database-better-auth--drizzle--postgres) |
| Frontend ↔ API | `apps/web/lib/api-client.ts` (typed fetch, `NEXT_PUBLIC_API_URL`) + `features/metrics/` (React Query hooks); the `/dashboard` "Live data" panel is fetched from the API |
| Pages          | Landing (`/`) + `/pricing`, `/dashboard`, `/analytics`, `/settings`, `/workspace`, `/sign-in`, `/sign-up`, `/forgot-password`, and `/showcase` — a full component + theme gallery |
| Layouts        | Four shells: `DashboardLayout` (collapsible sidebar), `TopNavLayout` (horizontal nav), `MarketingLayout` (public header/footer), `AuthLayout` (centered card + split panel). `PageContainer` adds the heading and breadcrumb trail |
| Design system  | `StatCard`, `MetricCard`, `DashboardCard`, `SectionHeader`, `EmptyState`, `ErrorState`, `LoadingState`, plus shadcn / Base UI primitives in `components/ui/`; `Card` has `elevated` / `flat` / `outlined` variants |
| Data viz       | `Sparkline` and `BarList` — zero-dependency, server-renderable, wired to a per-theme categorical `--chart-*` palette |
| Animation      | `FadeIn`, `SlideIn`, `ScaleIn`, `StaggerContainer`, `PageTransition` — built on `motion`, gated by `MotionProvider` on reduced-motion |
| Theming        | Four brand themes (Emerald / Sapphire / Amber / Slate) — each with its own palette, radius and typeface — × light/dark × comfortable/compact density. Tokens in `app/globals.css` + `app/themes.css`; registry in `config/theme.ts`. See [docs/multi-tema.md](docs/multi-tema.md) |
| State handling | App Router `error.tsx` / `loading.tsx` / `not-found.tsx` / `global-error.tsx` wired to the design system's state components |
| Data layer     | TanStack Query provider mounted and ready (`providers/QueryProvider.tsx`); no queries defined yet |
| Client state   | Zustand UI store (`stores/ui-store.ts`) with per-field selectors and hydration guards        |
| Observability  | Sentry, Microsoft Clarity, Vercel Analytics — each a no-op until its env var is set          |
| Security       | CSP + a full set of hardening headers in `next.config.ts`; SHA-pinned Actions, CodeQL, dependency review, Dependabot; see [SECURITY.md](SECURITY.md) |
| CI             | `.github/workflows/` — lint + typecheck + test + build, `pnpm audit`, CodeQL and dependency review on every push/PR to `main` and `develop` |

---

## Using this template

This repository is meant to be copied, not cloned-and-committed-into.

On GitHub: **Use this template → Create a new repository**. From the CLI:

```bash
gh repo create my-app --template <owner>/alan-web-master-template --private
cd my-app
corepack enable
pnpm install
pnpm dev
```

Then:

1. Read the [project standards](docs/standards/README.md) — folder, coding,
   component, and naming conventions the template already follows.
2. Work through [Before you ship](#before-you-ship): replace the landing page
   and showcase routes with real screens, wire real data, add authentication.
3. Update `config/app.ts`, `package.json` (`name`, `version`), this README's
   title, and the `LICENSE` copyright line (the template ships MIT — keep,
   replace, or relicense as your project needs).
4. Keep `AGENTS.md`, `CONTRIBUTING.md`, `SECURITY.md`, and `docs/` — adapt
   their contents to your project rather than deleting them.

---

## Architecture

### Stack

| Layer            | Choice                                             |
| ---------------- | ------------------------------------------------- |
| Workspace        | pnpm monorepo — `apps/web`, `apps/api`, `packages/shared` |
| Frontend         | Next.js 16 (App Router, React 19) on Node          |
| Backend          | Hono 4 on the Bun runtime (`apps/api`)             |
| Auth             | Better Auth (email/password), session cookie proxied through `apps/web` |
| Database         | Postgres via Drizzle ORM (`apps/api`)              |
| Shared contract  | `@app/shared` — raw TypeScript, imported by both apps |
| Language         | TypeScript 5 (`strict`)                            |
| Styling          | Tailwind CSS v4 (`@tailwindcss/postcss`)           |
| UI primitives    | shadcn components on Base UI (`@base-ui/react`)    |
| Icons            | `lucide-react`                                     |
| Animation        | `motion`                                           |
| Server state     | `@tanstack/react-query` v5                         |
| Client state     | `zustand` v5                                       |
| Theming          | `next-themes`                                      |
| Toasts           | `sonner`                                           |
| Error tracking   | `@sentry/nextjs`                                   |
| Analytics        | `@vercel/analytics`, Microsoft Clarity (snippet)   |
| Package manager  | pnpm 11 (workspace); Bun ≥ 1.4 is the `apps/api` runtime |
| Test runner      | Vitest (`apps/web`), `bun test` (`apps/api`)       |

### Directory layout

```
package.json              Root workspace — dev / build / lint / typecheck / test across all packages
pnpm-workspace.yaml       packages: apps/*, packages/*
tsconfig.base.json        Compiler options shared by every package
docker-compose.yml        Local Postgres for apps/api auth — dev only, not a deployment artifact

packages/shared/          @app/shared — types + API contract (index.ts, api.ts). Raw .ts, no build step
apps/api/                 @app/api — Bun + Hono + Better Auth + Drizzle. See apps/api/README.md
  src/index.ts            Bun server entry (`export default { port, fetch }`)
  src/app.ts              Hono app: CORS, /api/auth mount, routes, uniform error handling
  src/auth.ts             Better Auth instance (Drizzle adapter, email/password)
  src/db/schema.ts        Better Auth's core tables (user, session, account, verification)
  src/middleware/auth.ts  `requireAuth` — protects a route, exposes c.get("user")
  src/data.ts             In-memory sample data (/stats, /activity) — replace with real queries
  src/app.test.ts, src/auth.test.ts   `bun test` coverage — auth tests need a migrated Postgres
apps/web/                 @app/web — the Next.js app (everything below is under apps/web/)
  proxy.ts                Optimistic auth gate (Next 16's renamed `middleware.ts`) — cookie presence only
```

```
app/
  layout.tsx              Root layout — fonts (Geist, Inter, Source Serif), <Script> appearance-init, <AppProviders>, <Analytics>
  globals.css             Emerald (default) tokens, light + dark, density axis, font indirection
  themes.css              Sapphire / Amber / Slate token overrides — [data-theme] blocks
  not-found.tsx           Branded 404 (global)
  global-error.tsx        Root-layout error boundary (most severe failure path)
  (marketing)/            MarketingLayout shell
    page.tsx              Landing page (server component, no motion)
    pricing/page.tsx      Pricing — a second page on the same shell
  (auth)/                 AuthLayout screens
    auth-forms.tsx        Client form components (pattern showcase, no submit handler)
    sign-in|sign-up|forgot-password/page.tsx
  (topnav)/               TopNavLayout shell
    workspace/page.tsx    Horizontal-nav demo — same components as /dashboard
  (dashboard)/            DashboardLayout shell (mounted once for the group)
    dashboard/page.tsx    Component showcase with static demo data
    analytics/page.tsx    Sparkline / BarList / chart-token showcase
    settings/page.tsx     Forms, tabs, theme + density controls (settings-panels.tsx)
    showcase/page.tsx     Full theme + component gallery (showcase-controls.tsx)
    error.tsx / loading.tsx  Route-group boundaries

components/
  layout/                 4 shells + AppSidebar, AppHeader, AppearanceMenu, AccountMenu, BrandMark, PageContainer, ThemeToggle
  dashboard/              StatCard, MetricCard, DashboardCard, SectionHeader, Sparkline, BarList, IconBadge, TrendIndicator, state components
  motion/                 FadeIn, SlideIn, ScaleIn, StaggerContainer, PageTransition
  ui/                     shadcn / Base UI primitives (button, dialog, select, field, table, ...)

features/metrics/         Example feature — fetchers, React Query hooks (useStats/useActivity), LiveMetrics component
config/                   app.ts, layout.ts (dimensions), navigation.ts (nav items), theme.ts (brand-theme registry)
hooks/                    use-hydrated, use-ui-store-hydration, use-appearance (brand theme + density)
lib/                      format.ts, navigation.ts, chart.ts, theme.ts, api-client.ts (typed client for @app/api), auth-client.ts (Better Auth, browser), auth-server.ts (session lookup, Server Components) — helpers have colocated *.test.ts
providers/                AppProviders → ThemeProvider → QueryProvider (+ lazy Toaster); MotionProvider
stores/                   ui-store.ts (Zustand)
types/                    layout.ts, navigation.ts

public/appearance-init.js Pre-paint brand-theme + density sync (loaded beforeInteractive)
instrumentation.ts        Server + edge Sentry init, onRequestError hook
instrumentation-client.ts Browser Sentry init + Microsoft Clarity snippet
next.config.ts            Security headers (CSP, HSTS, COOP/CORP, X-Frame-Options, ...) + poweredByHeader off
```

### Key decisions

- **Persistent shell.** `DashboardLayout` is mounted from
  `app/(dashboard)/layout.tsx`, not per-page, so the sidebar and header
  keep their state across client navigations.
- **Route-group isolation.** Each shell is a route group with its own
  `layout.tsx` — `(marketing)`, `(auth)`, `(topnav)`, `(dashboard)`. Group-only
  dependencies (`motion` lives only in `(dashboard)`) never reach another
  group's bundle.
- **Config-driven layout & theme.** Sidebar dimensions and the desktop
  breakpoint live in `config/layout.ts`; the brand-theme registry in
  `config/theme.ts`. Both are consumed as data / CSS custom properties, so a
  consuming app reskins without editing component internals.
- **Static-first where it can be.** Public pages (`/`, `/pricing`,
  `/sign-in`, `/sign-up`, `/forgot-password`) prerender at build time.
  `/dashboard`, `/analytics`, `/settings`, `/showcase` and `/workspace` are
  server-rendered per request (`ƒ` in `next build`'s output) because their
  layouts call `getServerSession()` — a protected page can't be prerendered
  once its content or its very access depends on the request's cookies. The
  CSP intentionally uses `'unsafe-inline'` rather than a per-request nonce
  to keep the *static* pages nonce-free — see [SECURITY.md](SECURITY.md) and
  [`apps/web/next.config.ts`](apps/web/next.config.ts) for the full
  reasoning.
- **Dormant observability.** Every monitoring integration is gated on an
  environment variable and safely no-ops when unset, so the app behaves
  identically configured or not. See [docs/MONITORING.md](docs/MONITORING.md).

---

## Setup

### Prerequisites

| Tool | Version                                  | Notes                                        |
| ---- | ---------------------------------------- | -------------------------------------------- |
| Node | `^22.12.0 \|\| ^24.0.0 \|\| >=26.0.0`    | Runtime for `apps/web`. Enforced by `engines`; CI runs Node 24 |
| pnpm | 11.x (`packageManager` pins `11.25.0`)   | Workspace package manager. `corepack enable` provisions it |
| Bun  | `>= 1.4`                                 | Runtime for `apps/api` (`bun dev` / `bun test` / `bun build`). [Install](https://bun.sh) |
| Docker | any recent version                     | Local Postgres for auth (`docker-compose.yml`) — skip if you point `DATABASE_URL` at your own Postgres instead |

### Install

```bash
git clone <repository-url>
cd alan-web-master-template
corepack enable        # optional — ensures the pinned pnpm version
pnpm install
```

### Environment

No environment variables are required to run either app in dev — both have
dev-safe defaults (`apps/api/src/env.ts`). Each app has its own
`.env.example` for when you need to override something:

```bash
cp apps/web/.env.example apps/web/.env.local   # NEXT_PUBLIC_API_URL, NEXT_PUBLIC_APP_URL + monitoring
cp apps/api/.env.example apps/api/.env          # API_PORT, CORS origins, DATABASE_URL, BETTER_AUTH_SECRET
```

See [Environment variables](#environment-variables) for the full list.
`.env*` files are git-ignored.

### Database

Auth (`/api/auth/*`, sign-up/sign-in, and therefore `/dashboard` +
`/workspace`) needs Postgres. Everything else (`/`, `/pricing`,
`/showcase`'s theme gallery, `/dashboard`'s non-auth widgets) works without
it.

```bash
docker compose up -d db              # local Postgres on :55432 — matches the dev defaults
pnpm --filter @app/api db:migrate    # create the auth tables
```

See [`apps/api/README.md`](apps/api/README.md#database) for the full
`db:*` script list, and
[docs/arsitektur-monorepo.md §7](docs/arsitektur-monorepo.md#7-autentikasi--database-better-auth--drizzle--postgres)
for how auth is wired.

### First run

```bash
pnpm dev
```

Starts `apps/web` on <http://localhost:3000> and `apps/api` on
<http://localhost:3001> together. Visit
[`/sign-up`](http://localhost:3000/sign-up) to create an account, then
[`/dashboard`](http://localhost:3000/dashboard) — its "Live data" panel is
served by the API; run `pnpm dev:web` alone and it shows an error state.

Open <http://localhost:3000> for the landing page.
[`/showcase`](http://localhost:3000/showcase) is the full theme + component
gallery; the dashboard demos live at
[`/dashboard`](http://localhost:3000/dashboard),
[`/analytics`](http://localhost:3000/analytics),
[`/settings`](http://localhost:3000/settings) and
[`/workspace`](http://localhost:3000/workspace) (top-nav shell).

---

## Development

### Scripts

Run from the repo root; each fans out across the workspace.

| Command             | What it does                                              |
| ------------------- | -------------------------------------------------------- |
| `pnpm dev`          | `apps/web` (:3000, HMR) + `apps/api` (:3001, watch) in parallel |
| `pnpm dev:web` / `pnpm dev:api` | Just one app                                 |
| `pnpm build`        | Build `@app/shared` → `@app/api` → `@app/web`, in order  |
| `pnpm start`        | Serve both production builds (run `pnpm build` first)    |
| `pnpm -r lint`      | ESLint in every package                                  |
| `pnpm -r typecheck` | `tsc --noEmit` in every package                          |
| `pnpm -r test`      | Vitest (`apps/web`) + `bun test` (`apps/api`)            |

Inside `apps/api`, `bun run <script>` works directly (`bun test`, `bun dev`).

### The CI gate

`.github/workflows/ci.yml` runs, in order, on every push and PR to `main`
and `develop`:

```bash
pnpm install --frozen-lockfile
pnpm -r lint
pnpm -r typecheck
pnpm -r test
pnpm build
```

CI also sets up Bun (for `apps/api`'s `test` / `build`). Run the same
commands locally before opening a PR. `develop` should never be left failing
any of them.

Alongside it, `.github/workflows/` also runs `pnpm audit` (fails on a
high/critical advisory), **CodeQL** static analysis, and — on PRs —
**dependency review** (flags a PR that adds a vulnerable dependency; advisory
until the repo's Dependency Graph feature is enabled). Actions are pinned to
commit SHAs and kept current by **Dependabot**. See
[SECURITY.md](SECURITY.md#security-posture).

### Conventions

Full detail in [docs/standards/](docs/standards/README.md). In short:

- **Folders**: each top-level directory has one job; colocate until there's
  a second consumer. [Folder standards](docs/standards/folder-standards.md).
- **Code**: TypeScript `strict`, server components by default, semantic
  design tokens only, per-field Zustand selectors, comment *why*.
  [Coding standards](docs/standards/coding-standards.md).
- **Components**: exported `<Name>Props` interface, `className?` last, JSDoc,
  `cva` for variants, explicit loading/empty/error states, AA a11y.
  [Component standards](docs/standards/component-standards.md).
- **Naming**: PascalCase component files, kebab-case everywhere else,
  `<Name>Props`, `is`/`has` booleans, Conventional Commits.
  [Naming standards](docs/standards/naming-standards.md).
- **Imports**: inside `apps/web`, `@/*` is aliased to `apps/web` itself
  (`tsconfig.json`, mirrored in Vitest). Cross-app code goes through
  `@app/shared`. `cn` from the `cn` package directly.
- **Workspace**: `apps/web` and `apps/api` never import each other's files —
  only `@app/shared`. See [docs/arsitektur-monorepo.md](docs/arsitektur-monorepo.md)
  and the repo-root [AGENTS.md](AGENTS.md).
- **Branching**: branch from `develop` as `feature/<name>`, PR back into
  `develop`. Full branch model in [CONTRIBUTING.md](CONTRIBUTING.md).

### Adding a shadcn component

```bash
pnpm dlx shadcn@latest add <component>
```

Config is in `components.json`; generated files land in `components/ui/`.

### Working with the Next.js docs

`apps/web` tracks a fast-moving Next.js release. Before writing framework
code, read the relevant guide under `apps/web/node_modules/next/dist/docs/` —
see [apps/web/AGENTS.md](apps/web/AGENTS.md).

### Before you ship

- Replace the landing page (`app/(marketing)/page.tsx`) and `/pricing` with
  real marketing content, and the demo app routes (`/dashboard`, `/analytics`,
  `/settings`, `/workspace`) with real screens — their data is static. Delete
  `/showcase` or keep it as an internal reference. Point
  [`config/navigation.ts`](config/navigation.ts) at your own routes.
- Pick a default theme in [`config/theme.ts`](config/theme.ts) (or reskin one
  theme's tokens with the client's brand); drop the themes you don't ship and
  hide `AppearanceMenu` if the client wants a single look. See
  [docs/multi-tema.md](docs/multi-tema.md).
- **Auth and its route protection are real, not a stub** — the `(auth)`
  forms call Better Auth, `DashboardLayout`'s `user` prop and "Sign out" are
  wired, and `/dashboard` + `/workspace` are protected server-side (see
  [docs/arsitektur-monorepo.md §7](docs/arsitektur-monorepo.md#7-autentikasi--database-better-auth--drizzle--postgres)).
  Still to configure per project: transactional email for password reset
  (`emailAndPassword.sendResetPassword` in `apps/api/src/auth.ts` is a
  no-op until you add one), and OAuth/SSO or role/permission plugins if you
  need them.
- Replace `apps/api/src/data.ts` (`/stats`, `/activity`) with real queries —
  add tables next to `apps/api/src/db/schema.ts` and query them with
  Drizzle. The route handlers and web hooks stay unchanged as long as the
  return types still come from `@app/shared`.
- Most `Sparkline` / `BarList` / `StatCard` instances still use hard-coded
  arrays; only the `/dashboard` "Live data" panel is wired to the API. Follow
  that pattern (`features/metrics/`) for the rest.
- Before a real production launch, also read [SECURITY.md](SECURITY.md) —
  auth existing doesn't mean every hardening item there is addressed (rate
  limiting, audit logging, etc. are project-specific).

---

## Deployment

The two apps deploy **separately**: `apps/web` as a Next.js app, `apps/api`
as a Bun process with a Postgres database. Deploy the API first (its domain
has to exist before the web app is built), then the web app.

**Step-by-step walkthrough for a VPS (API + Postgres) + Vercel (web) setup —
the most common pairing for this template — is
[docs/deploy-vps-vercel.md](docs/deploy-vps-vercel.md).** The rest of this
section is the reference version; that doc has the copy-pasteable commands.

### Prerequisites for any target

1. `pnpm build` passes.
2. Node matches the `engines` range on the web host; Bun ≥ 1.4 and a
   reachable Postgres on the API host.
3. `apps/api` migrations are applied (`pnpm --filter @app/api db:migrate`)
   against the production `DATABASE_URL` before first traffic.
4. Environment variables are set in each host's environment (not committed).
   `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL` and other `NEXT_PUBLIC_`-
   prefixed variables are read at **build time** and inlined — set them
   before `pnpm --filter @app/web build`, and rebuild to change them.
   `DATABASE_URL` and `BETTER_AUTH_SECRET` are **required** once
   `apps/api` runs with `NODE_ENV=production` — it refuses to start
   without them.

### apps/web — Vercel (zero-config)

Import the repo, set the **Root Directory** to `apps/web` (Vercel then runs
the workspace install and `next build`). Set `NEXT_PUBLIC_API_URL`,
`NEXT_PUBLIC_APP_URL` and any monitoring vars in **Project → Settings →
Environment Variables**. Turn on **Project → Analytics** to activate the
present `<Analytics />`.

### apps/api — any Bun host (VPS, container, Railway, Fly.io, ...)

```bash
pnpm install --frozen-lockfile
pnpm --filter @app/api db:migrate     # apply the auth schema to DATABASE_URL
pnpm --filter @app/api build          # → apps/api/dist/index.js
cd apps/api && bun run dist/index.js  # honors API_PORT, API_ALLOWED_ORIGINS, DATABASE_URL, BETTER_AUTH_SECRET, NODE_ENV
```

Needs a reachable Postgres (`DATABASE_URL`) — self-hosted on the same VPS,
or managed (Neon, Supabase, RDS, ...). Set `API_ALLOWED_ORIGINS` and
`API_PUBLIC_URL` to the deployed web/API origins, and generate a real
`BETTER_AUTH_SECRET` (`openssl rand -base64 32` — never the dev default).
The API's own origin also has to land in `apps/web`'s CSP `connect-src`,
which happens automatically from `NEXT_PUBLIC_API_URL` — see
[`apps/web/next.config.ts`](apps/web/next.config.ts). Full walkthrough
(systemd unit, Caddy reverse proxy, verification checklist):
[docs/deploy-vps-vercel.md](docs/deploy-vps-vercel.md).

### apps/web — Node server / container

```bash
pnpm install --frozen-lockfile
pnpm --filter @app/web... build
cd apps/web && pnpm start   # serves on $PORT (default 3000)
```

A minimal container: install dependencies, build, then run `pnpm start` from
`apps/web` as the entrypoint with `NODE_ENV=production`. Put a
TLS-terminating proxy in front — the `Strict-Transport-Security` header only
takes effect over HTTPS.

### Security headers after deployment

`apps/web/next.config.ts` sets the CSP and hardening headers on all routes.
Follow-ups once you deploy:

- Set `NEXT_PUBLIC_API_URL` before building so the API origin lands in
  `connect-src` automatically.
- If you set a real `NEXT_PUBLIC_SENTRY_DSN`, add your project's Sentry
  ingest host to `connect-src` in `next.config.ts` — the DSN host is
  project-specific and not pre-allowlisted.
- If a proxy or CDN also injects security headers, reconcile them so they
  don't conflict.

### CI/CD

CI validates every push but does **not** deploy. Wire deployment to your
platform's own Git integration or add a deploy job to the workflow that runs
after `validate` on `main`.

---

## Environment variables

Every variable is **optional** — both apps run with none set. Copy
[`apps/web/.env.example`](apps/web/.env.example) and
[`apps/api/.env.example`](apps/api/.env.example) for local use.

**`apps/web`** (`NEXT_PUBLIC_`-prefixed → read at build time, exposed to the browser):

| Variable                         | Purpose                                          | Where it's read                                              | Default when unset            |
| -------------------------------- | ----------------------------------------------- | ---------------------------------------------------------- | ----------------------------- |
| `NEXT_PUBLIC_API_URL`            | Origin of `apps/api`; feeds the `/api/auth` rewrite and CSP `connect-src` | `lib/api-client.ts`, `lib/auth-server.ts`, `next.config.ts` | `http://localhost:3001`   |
| `NEXT_PUBLIC_APP_URL`            | This app's own public origin — required by Better Auth's browser client | `lib/auth-client.ts`                       | `http://localhost:3000`       |
| `NEXT_PUBLIC_SENTRY_DSN`         | Sentry error tracking + performance tracing     | `instrumentation.ts`, `instrumentation-client.ts`, error boundaries | Sentry disabled (SDK no-ops)  |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Microsoft Clarity session replay + heatmaps     | `instrumentation-client.ts`                                 | Clarity snippet not injected  |
| _(none)_ Vercel Analytics        | Page views + custom events                      | `app/layout.tsx` (`<Analytics />`)                          | No-op off Vercel / until enabled in dashboard |

**`apps/api`** (server-side only):

| Variable               | Purpose                                            | Default when unset        |
| ---------------------- | ------------------------------------------------- | ------------------------- |
| `API_PORT`             | Port the Bun server binds to                       | `3001`                    |
| `API_ALLOWED_ORIGINS`  | Comma-separated CORS allowlist, also the Better Auth trusted-origins list (enforced in prod) | `http://localhost:3000` |
| `API_PUBLIC_URL`       | This API's own public origin — Better Auth uses it to build cookie/callback URLs | `http://localhost:3001` |
| `DATABASE_URL`         | Postgres connection string                         | Local dev default; **required** in production |
| `BETTER_AUTH_SECRET`   | Signs/encrypts session tokens — `openssl rand -base64 32` | Fixed dev value; **required** in production |
| `NODE_ENV`             | `production` tightens CORS, enforces the two required vars above, hides error detail, sets the session cookie `SameSite=None; Secure` | `development` |

Notes:

- A **Sentry DSN is not a secret** — it can only send events to your
  project. It is safe to expose to the browser.
- Trace sampling defaults to `0.1` (10%) in both instrumentation files —
  tune once you know real traffic volume.
- Full setup and verification steps for each integration:
  [docs/MONITORING.md](docs/MONITORING.md).
- Next.js only exposes `NEXT_PUBLIC_`-prefixed variables to the browser;
  anything you add without the prefix stays server-only.

---

## Troubleshooting

### `pnpm install` fails or installs the wrong pnpm

Run `corepack enable` so the pinned version in `packageManager`
(`pnpm@11.25.0`) is used. If Corepack isn't available, install pnpm 11
manually.

### Node version error on install or build

`engines` requires `^22.12.0 || ^24.0.0 || >=26.0.0`. Check with `node -v`
and switch (e.g. `nvm use 24`). CI runs Node 24.

### Dev server starts but the page is unstyled

Tailwind v4 processes CSS through `@tailwindcss/postcss`
(`postcss.config.mjs`). Stop the dev server, delete `.next/`, and restart.
Confirm `app/globals.css` is imported in `app/layout.tsx`.

### `AGENTS.md` keeps reappearing as an uncommitted change

`next dev` regenerates it. Commit it alongside your work to keep the tree
clean — see [AGENTS.md](AGENTS.md).

### Theme flashes on load / hydration warning

`next-themes` sets the theme before paint; `app/layout.tsx` has
`suppressHydrationWarning` on `<html>` for exactly this. If you see a real
mismatch elsewhere, check for a component reading `window`/`localStorage`
during render instead of via the `use-hydrated` hook.

### A toast never appears

The `Toaster` is lazy-loaded (`ssr: false`) in
`providers/AppProviders.tsx`. It mounts a moment after first paint. If a
`toast()` fired in that window, the toast is dropped — call it from a user
interaction, not during initial render.

### CSP violation in the console after adding a script or API call

`next.config.ts`'s CSP is `default-src 'self'` plus a narrow allowlist. Add
the new host to the appropriate directive (`script-src`, `connect-src`,
`img-src`, ...). For Sentry specifically, add your ingest host to
`connect-src`. Rebuild — the header is generated at build time.

### A sparkline or bar list looks flat or empty

`Sparkline` needs at least two data points (it draws a dashed baseline
otherwise); `BarList` renders nothing for an empty `data` array. Both clamp
negative and zero values rather than drawing a reversed bar — see
[`lib/chart.ts`](lib/chart.ts).

### Monitoring integration isn't recording anything

Each is gated on its env var and needs a **server restart** after you add
it. `NEXT_PUBLIC_` variables are build-time — for a production build you
must rebuild. Verification steps per integration:
[docs/MONITORING.md](docs/MONITORING.md#verifying-a-connection).

### Production build behaves differently from `pnpm dev`

The dev and production CSPs differ (`'unsafe-eval'` is dev-only), and pages
prerender in production. Reproduce production issues with
`pnpm build && pnpm start`, not `pnpm dev`.

---

## Further reading

| Document                                     | Contents                                                        |
| -------------------------------------------- | -------------------------------------------------------------- |
| [docs/multi-tema.md](docs/multi-tema.md) 🇮🇩  | Brand-theme / density / mode system — how it works, how to add a theme |
| [docs/varian-layout.md](docs/varian-layout.md) 🇮🇩 | The four layout shells and when to use each                    |
| [docs/analisis-dan-rekomendasi.md](docs/analisis-dan-rekomendasi.md) 🇮🇩 | UI/UX review, what shipped, and the deferred roadmap |
| [docs/standards/](docs/standards/README.md)  | Folder, coding, component and naming standards the template follows |
| [CONTRIBUTING.md](CONTRIBUTING.md)           | Branch model, PR / merge / release workflow, commit conventions |
| [SECURITY.md](SECURITY.md)                   | Security headers, error-boundary hardening, audit findings      |
| [docs/MONITORING.md](docs/MONITORING.md)     | Sentry, Clarity, Vercel Analytics — setup and verification      |
| [docs/AUDIT.md](docs/AUDIT.md)               | Repository, performance and build-configuration audit history   |
| [docs/PRODUCTION_READINESS.md](docs/PRODUCTION_READINESS.md) | Final production review — validation results, per-area findings, remaining risks |
| [AGENTS.md](AGENTS.md)                       | Working with this repo's Next.js version                        |

---

## License

[MIT](LICENSE) © Alan Jalu Prasetyo. Use it for anything, including
commercial and closed-source work; keep the copyright notice.
