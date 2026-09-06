# Alan Web Master Template

An enterprise dashboard template built on Next.js App Router — a responsive
application shell, a green/white design system, and the supporting
animation, accessibility and state-handling patterns, ready to build real
pages on top of.

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The showcase page lives
at `/dashboard`; `/` is the untouched Next.js starter page and isn't part of
the template — replace it or remove it once the app has a real landing page.

Other scripts: `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test`.

## What's here

- **Layout** (`components/layout/`) — `DashboardLayout` is the shell: a
  collapsible desktop sidebar, sticky header, and mobile drawer + bottom
  navigation, mounted once from `app/(dashboard)/layout.tsx` so it persists
  across navigations. `PageContainer` handles a page's gutters, max-width and
  heading.
- **Design system** (`components/dashboard/`, `components/ui/`) —
  `StatCard`, `MetricCard`, `DashboardCard`, `SectionHeader`, `EmptyState`,
  `ErrorState` and `LoadingState` cover the common states of a data widget;
  `components/ui/` holds the shadcn (base-nova/Base UI) primitives they're
  built from, plus `Field`/`FieldError` for form validation.
- **Animation** (`components/motion/`) — `FadeIn`, `SlideIn`, `ScaleIn`,
  `StaggerContainer` and `PageTransition`, built on `motion`. Every one
  respects `prefers-reduced-motion` via `MotionProvider`.
- **State conventions** — `app/(dashboard)/error.tsx` and `loading.tsx`,
  `app/not-found.tsx` and `app/global-error.tsx` wire the design system's
  state components into Next's App Router error/loading boundaries, so an
  unhandled exception or a bad URL renders on-brand instead of falling back
  to Next's defaults.
- **Theming** — green/white, WCAG AA-checked, light and dark (`next-themes`,
  toggle in the header). Tokens live in `app/globals.css`.

## Before you ship

- Swap the placeholder nav destinations in `config/navigation.ts` for real
  routes — `/users` and `/settings` aren't implemented.
- Wire `DashboardLayout`'s `user` prop once auth exists, to show the account
  menu.
- Replace `app/(dashboard)/dashboard/page.tsx`'s static demo data with a real
  data source.

## Contributing

Branch model, PR/merge/release workflow and commit conventions are in
[CONTRIBUTING.md](CONTRIBUTING.md). Short version: branch from `develop` as
`feature/<name>`, open a PR back into `develop`, and let CI
(`.github/workflows/ci.yml`) validate it.
