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
