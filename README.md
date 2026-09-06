# Alan Web Master Template

An enterprise dashboard template built on the Next.js App Router — a
responsive application shell, a green/white design system, and the
supporting animation, accessibility, state-handling and observability
patterns, ready to build real product pages on top of.

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

What it deliberately does **not** include: authentication, a database, real
API integration, or business logic. Those are application concerns; see
[Before you ship](#before-you-ship).

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
| Layout         | `DashboardLayout` shell — collapsible desktop sidebar, sticky header, mobile drawer + bottom nav, mounted once so it survives navigation |
| Design system  | `StatCard`, `MetricCard`, `DashboardCard`, `SectionHeader`, `EmptyState`, `ErrorState`, `LoadingState`, plus shadcn / Base UI primitives in `components/ui/` |
| Animation      | `FadeIn`, `SlideIn`, `ScaleIn`, `StaggerContainer`, `PageTransition` — built on `motion`, gated by `MotionProvider` on reduced-motion |
| Theming        | Green/white, WCAG AA-checked, light + dark via `next-themes`; tokens in `app/globals.css`     |
| State handling | App Router `error.tsx` / `loading.tsx` / `not-found.tsx` / `global-error.tsx` wired to the design system's state components |
| Data layer     | TanStack Query provider mounted and ready (`providers/QueryProvider.tsx`); no queries defined yet |
| Client state   | Zustand UI store (`stores/ui-store.ts`) with per-field selectors and hydration guards        |
| Observability  | Sentry, Microsoft Clarity, Vercel Analytics — each a no-op until its env var is set          |
| Security       | CSP + hardening headers in `next.config.ts`; see [SECURITY.md](SECURITY.md)                   |
| CI             | `.github/workflows/ci.yml` runs lint + typecheck + test + build on every push/PR to `main` and `develop` |

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
2. Work through [Before you ship](#before-you-ship): replace the placeholder
   routes and the starter page, wire real data, add authentication.
3. Update `config/app.ts`, `package.json` (`name`, `version`), this README's
   title, and `LICENSE` (none is included — add one for your project).
4. Keep `AGENTS.md`, `CONTRIBUTING.md`, `SECURITY.md`, and `docs/` — adapt
   their contents to your project rather than deleting them.

---

## Architecture

### Stack

| Layer            | Choice                                             |
| ---------------- | ------------------------------------------------- |
| Framework        | Next.js 16 (App Router, React 19)                  |
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
| Package manager  | pnpm 11                                            |
| Test runner      | Vitest                                             |

### Directory layout

```
app/
  layout.tsx              Root layout — fonts, metadata, viewport, <AppProviders>, <Analytics>
  page.tsx                Untouched Next.js starter page — replace or remove
  globals.css             Design tokens (green/white, light + dark) and Tailwind layer setup
  not-found.tsx           Branded 404 (global)
  global-error.tsx        Root-layout error boundary (most severe failure path)
  (dashboard)/
    layout.tsx            Mounts DashboardLayout once for every route in the group
    dashboard/page.tsx    Showcase page with static demo data — replace with a real source
    error.tsx             Route-group error boundary
    loading.tsx           Route-group loading boundary

components/
  layout/                 DashboardLayout, AppSidebar, AppHeader, MobileNavigation, PageContainer, ThemeToggle
  dashboard/              StatCard, MetricCard, DashboardCard, SectionHeader, IconBadge, TrendIndicator, state components
  motion/                 FadeIn, SlideIn, ScaleIn, StaggerContainer, PageTransition
  ui/                     shadcn / Base UI primitives (button, dialog, select, field, table, ...)

config/                   app.ts (name/version), layout.ts (dimensions, breakpoint), navigation.ts (sidebar items)
hooks/                    use-hydrated, use-ui-store-hydration
lib/                      format.ts, navigation.ts, utils.ts (+ *.test.ts)
providers/                AppProviders → ThemeProvider → QueryProvider (+ lazy Toaster); MotionProvider
stores/                   ui-store.ts (Zustand)
types/                    layout.ts, navigation.ts

instrumentation.ts        Server + edge Sentry init, onRequestError hook
instrumentation-client.ts Browser Sentry init + Microsoft Clarity snippet
next.config.ts            Security headers (CSP, HSTS, X-Frame-Options, ...)
```

### Key decisions

- **Persistent shell.** `DashboardLayout` is mounted from
  `app/(dashboard)/layout.tsx`, not per-page, so the sidebar and header
  keep their state across client navigations.
- **Route-group isolation.** Dashboard-only dependencies (`motion`, Base UI
  dialogs, etc.) are scoped to the `(dashboard)` group and never reach the
  root page's bundle.
- **Config-driven layout.** Sidebar dimensions and the desktop breakpoint
  live in `config/layout.ts` and are exposed as CSS custom properties, so a
  consuming app can retheme the shell without editing component internals.
- **Static-first.** Pages prerender at build time. The CSP intentionally
  uses `'unsafe-inline'` rather than a per-request nonce to preserve that —
  see [SECURITY.md](SECURITY.md) and [`next.config.ts`](next.config.ts) for
  the full reasoning.
- **Dormant observability.** Every monitoring integration is gated on an
  environment variable and safely no-ops when unset, so the app behaves
  identically configured or not. See [docs/MONITORING.md](docs/MONITORING.md).

---

## Setup

### Prerequisites

| Tool | Version                                  | Notes                                        |
| ---- | ---------------------------------------- | -------------------------------------------- |
| Node | `^22.12.0 \|\| ^24.0.0 \|\| >=26.0.0`    | Enforced by `engines` in `package.json`; CI runs Node 24 |
| pnpm | 11.x (`packageManager` pins `11.25.0`)   | `corepack enable` will provision the right version |

### Install

```bash
git clone <repository-url>
cd alan-web-master-template
corepack enable        # optional — ensures the pinned pnpm version
pnpm install
```

### Environment

No environment variables are required to run the app. To enable monitoring,
copy the example file and fill in what you need:

```bash
cp .env.example .env.local
```

See [Environment variables](#environment-variables) for the full list.
`.env.local` is git-ignored.

### First run

```bash
pnpm dev
```

Open <http://localhost:3000>. The showcase lives at
[`/dashboard`](http://localhost:3000/dashboard); `/` is the unmodified
Next.js starter page.

---

## Development

### Scripts

| Command          | What it does                                              |
| ---------------- | -------------------------------------------------------- |
| `pnpm dev`       | Start the dev server (HMR) on port 3000                  |
| `pnpm build`     | Production build into `.next/`                           |
| `pnpm start`     | Serve the production build (run `pnpm build` first)      |
| `pnpm lint`      | ESLint (`eslint-config-next`)                            |
| `pnpm typecheck` | `tsc --noEmit`                                           |
| `pnpm test`      | Run the Vitest suite once                                |

### The CI gate

`.github/workflows/ci.yml` runs, in order, on every push and PR to `main`
and `develop`:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Run the same four commands locally before opening a PR. `develop` should
never be left failing any of them.

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
- **Imports**: `@/*` is aliased to the repo root (`tsconfig.json`, mirrored
  in Vitest). `cn` from the `cn` package directly.
- **Branching**: branch from `develop` as `feature/<name>`, PR back into
  `develop`. Full branch model in [CONTRIBUTING.md](CONTRIBUTING.md).

### Adding a shadcn component

```bash
pnpm dlx shadcn@latest add <component>
```

Config is in `components.json`; generated files land in `components/ui/`.

### Working with the Next.js docs

This project tracks a fast-moving Next.js release. Before writing framework
code, read the relevant guide under `node_modules/next/dist/docs/` — see
[AGENTS.md](AGENTS.md).

### Before you ship

- Replace the placeholder nav destinations in
  [`config/navigation.ts`](config/navigation.ts) — `/users` and `/settings`
  have no pages and resolve to the branded 404.
- Replace `app/page.tsx` (`/`) — still the Next.js starter.
- Swap `app/(dashboard)/dashboard/page.tsx`'s static demo data for a real
  source.
- Wire `DashboardLayout`'s `user` prop once authentication exists, so the
  account menu renders. Its "Sign out" item has no handler yet — by design.
- Add authentication and server-side route protection. This template has
  none. See [SECURITY.md](SECURITY.md) for the specifics to address.

---

## Deployment

The build produces a standard Next.js server output in `.next/`. Pages are
prerendered where possible; `next start` serves them from a Node process.

### Prerequisites for any target

1. `pnpm build` passes.
2. Node matches the `engines` range on the host.
3. Any environment variables you rely on are set in the host's environment
   (not committed). `NEXT_PUBLIC_`-prefixed variables are read at **build
   time** and inlined — set them before `pnpm build`, and rebuild to change
   them.

### Vercel (zero-config)

Push the repo and import it. Vercel detects Next.js, runs `pnpm install` and
`pnpm build`, and serves the result. Set environment variables in
**Project → Settings → Environment Variables**. Turn on **Project →
Analytics** to activate the already-present `<Analytics />`.

### Node server / container

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm start            # serves on $PORT (default 3000)
```

A minimal container: install dependencies, build, then run `pnpm start` as
the entrypoint with `NODE_ENV=production`. Put a TLS-terminating proxy in
front — the `Strict-Transport-Security` header only takes effect over HTTPS.

### Security headers after deployment

`next.config.ts` sets the CSP and hardening headers on all routes. Two
follow-ups once you deploy:

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

Every variable is **optional** — the app runs with none set. All current
variables configure monitoring and are `NEXT_PUBLIC_`-prefixed (read at
build time, exposed to the browser). Copy [`.env.example`](.env.example) to
`.env.local` for local use.

| Variable                         | Purpose                                          | Where it's read                                              | Default when unset            |
| -------------------------------- | ----------------------------------------------- | ---------------------------------------------------------- | ----------------------------- |
| `NEXT_PUBLIC_SENTRY_DSN`         | Sentry error tracking + performance tracing     | `instrumentation.ts`, `instrumentation-client.ts`, error boundaries | Sentry disabled (SDK no-ops)  |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Microsoft Clarity session replay + heatmaps     | `instrumentation-client.ts`                                 | Clarity snippet not injected  |
| _(none)_ Vercel Analytics        | Page views + custom events                      | `app/layout.tsx` (`<Analytics />`)                          | No-op off Vercel / until enabled in dashboard |

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

### `/users` or `/settings` shows the 404 page

Expected. They're placeholder nav entries in `config/navigation.ts` with no
pages yet. See [Before you ship](#before-you-ship).

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
| [docs/standards/](docs/standards/README.md)  | Folder, coding, component and naming standards the template follows |
| [CONTRIBUTING.md](CONTRIBUTING.md)           | Branch model, PR / merge / release workflow, commit conventions |
| [SECURITY.md](SECURITY.md)                   | Security headers, error-boundary hardening, audit findings      |
| [docs/MONITORING.md](docs/MONITORING.md)     | Sentry, Clarity, Vercel Analytics — setup and verification      |
| [docs/AUDIT.md](docs/AUDIT.md)               | Repository, performance and build-configuration audit history   |
| [docs/PRODUCTION_READINESS.md](docs/PRODUCTION_READINESS.md) | Final production review — validation results, per-area findings, remaining risks |
| [AGENTS.md](AGENTS.md)                       | Working with this repo's Next.js version                        |
