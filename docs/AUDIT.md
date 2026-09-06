# Repository Audit — Phase 14

Date: 2026-09-06. Scope: repository structure, naming, environment management,
build configuration, dependency health, duplicate/dead code, technical debt.

## Findings & fixes applied

### Build configuration
- **`components.json` pointed at a deleted file.** The shadcn CLI config's
  `utils` alias is `@/lib/utils`, but that file was removed in an earlier
  cleanup pass after confirming no source file imported it — true at the
  time, but it missed that the CLI config still depends on the path
  existing. Any future `pnpm dlx shadcn add <component>` would have
  generated a component importing a path that doesn't exist. **Fixed**:
  restored `lib/utils.ts` as the one-line `cn` re-export the alias expects.
  The actual convention used everywhere else in the codebase (`import { cn }
  from "cn"`, the package directly) is unaffected.
- **No `engines` field.** Next.js itself requires `node >=20.9.0`
  (`node_modules/next/package.json`); the project never surfaced that.
  **Fixed**: added `"engines": { "node": ">=20.9.0" }` to `package.json`.
- **No CI pipeline.** Every phase of this project's history validated with
  `lint` + `typecheck` + `build` run by hand; nothing enforced that on a
  push or PR. **Fixed**: added `.github/workflows/ci.yml` running the same
  three gates on `pnpm install --frozen-lockfile`.
- **No environment-variable scaffolding, and the `.gitignore` would have
  swallowed it anyway.** Confirmed zero `process.env` reads anywhere in the
  app — genuinely nothing to configure today. Added a minimal `.env.example`
  documenting the `NEXT_PUBLIC_` convention, so the first real environment
  variable has an established place to go. While adding it, found that
  `.gitignore`'s blanket `.env*` rule (meant to keep real secrets out of the
  repo) also matched `.env.example` itself — the file would have silently
  never been committed. **Fixed**: added a `!.env.example` negation.

### Duplicate code
- The "icon in a rounded, tinted box" tile was copy-pasted verbatim across
  `StatCard`, `MetricCard`, and `DashboardCard`, plus a fourth near-identical
  copy (one size step up, with an alignment tweak) in `SectionHeader`.
  **Fixed**: extracted `components/dashboard/IconBadge.tsx` and pointed all
  four call sites at it. Verified pixel-identical output via a live
  screenshot comparison against pre-refactor renders — this was a pure
  extraction, no visual change.

### Repository/folder structure — no changes needed
`app/`, `components/{ui,layout,dashboard,motion}/`, `hooks/`, `lib/`,
`config/`, `types/`, `stores/`, `providers/` is a conventional, sensibly
layered structure for a Next.js App Router project. Nothing to reorganize.

### Naming consistency — no changes needed
Verified consistent across the tree: PascalCase for components
(`AppHeader.tsx`), kebab-case for shadcn UI primitives (`dropdown-menu.tsx`)
matching upstream convention, kebab-case for hooks/lib/config/types/stores
(`use-hydrated.ts`, `ui-store.ts`). No stragglers found.

### Dead code / unused assets — none remaining
Re-verified: no `console.log`/`debugger` statements, no `TODO`/`FIXME`
markers, no orphaned files beyond what earlier cleanup already removed. `pnpm
audit` reports no known vulnerabilities.

## Recommendations not applied (need a dedicated pass, not a "safe fix")

- **Major dev-dependency upgrades available**: ESLint 9 → 10 (9.x is past
  its support window per eslint.org), TypeScript 5 → 7, `@types/node` 20 →
  26. All three are major version bumps that can change linting/type-checking
  behavior — each deserves its own branch, its own test of the full
  lint/typecheck/build gate, and a dedicated commit, not a bundled bump here.
- **No automated test suite.** Validation throughout this project's history
  has been lint + typecheck + build + manual/live browser verification.
  Introducing a test runner (component tests, at minimum a smoke test per
  route) is worth a dedicated phase.
- **Known placeholder routes**: `/users` and `/settings` in
  `config/navigation.ts` have no corresponding pages (they resolve to the
  branded 404). `app/page.tsx` (`/`) is still the unmodified Next.js starter.
  Both are already called out in `README.md`'s "before you ship" section —
  intentional for a template, not something to fix here.

## Validation

`pnpm lint`, `pnpm typecheck`, `pnpm build` all pass after every change in
this phase.

## Performance audit — Phase 18

Scope: bundle size, rendering/re-renders, dynamic imports, lazy loading,
images, fonts.

### Fixed

- **`Toaster` (Sonner) was in every route's initial bundle, always, even
  though it renders nothing until a toast actually fires.** Mounted at the
  provider level, so both `/` and `/dashboard` paid for it upfront. Switched
  to `next/dynamic` with `ssr: false` in `providers/AppProviders.tsx` — safe
  here specifically because nothing calls a hook that needs the Toaster's
  context synchronously; it's an imperative `toast()` call that works fine
  whenever the chunk finishes loading, which in practice is almost
  immediately, in the background, never blocking first paint.

  Measured directly by diffing the actual shipped chunk sets before/after
  (same methodology as Phase 10 — not estimated):
  - `/`: 700,431 → 667,495 bytes (**-32,936 bytes**)
  - `/dashboard`: 1,048,362 → 1,015,916 bytes (**-32,446 bytes**)

  Verified functionally, not just by bundle size: confirmed the Toaster's
  accessible container still mounts correctly in the DOM after the change,
  and checked the console for errors — clean.

### Confirmed already optimal — no changes needed

- **Fonts**: Geist/Geist Mono via `next/font/google` are variable fonts
  (one file serves every weight — specifying `weight` would only matter for
  static, non-variable families), scoped to the `latin` subset only, using
  the library's default `swap` display strategy. Nothing to trim.
- **Images**: only `next/image` usage in the app (`next.svg`/`vercel.svg` on
  the untouched boilerplate root page) is already optimized; no other
  images exist to lazy-load.
- **Motion/Base UI scoping** (the Phase 10 fix): re-verified still isolated
  to the `(dashboard)` route only — its ~360KB of dashboard-unique chunks
  never reach the root page's bundle.
- **Re-renders**: Zustand selectors are still all scoped to individual
  fields (`useUIStore((s) => s.sidebarCollapsed)`), not whole-store
  destructuring. No memoization added — the component tree is small enough
  that it isn't justified, and adding it without a measured need would be
  the premature optimization this phase's brief warns against.
- **`QueryProvider` was considered for the same dynamic-import treatment as
  `Toaster` and deliberately rejected**: unlike an imperative `toast()`
  call, a component calling `useQuery()` expects `QueryClientProvider`'s
  context to exist synchronously on render. Deferring the provider risks a
  "no QueryClientProvider found" error for any child that renders before the
  dynamic chunk resolves — a real correctness risk for a small, uncertain
  gain, since nothing currently uses `useQuery` anyway.
