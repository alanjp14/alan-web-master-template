# Naming standards

## Files & directories

| Kind                              | Convention           | Examples                                          |
| --------------------------------- | -------------------- | ------------------------------------------------ |
| React component file              | `PascalCase.tsx`     | `AppHeader.tsx`, `StatCard.tsx`, `DashboardLayout.tsx` |
| `components/ui/` primitive        | `kebab-case.tsx`     | `dropdown-menu.tsx`, `button.tsx` — matches shadcn upstream |
| Hook file                         | `kebab-case.ts`, `use-` prefix | `use-hydrated.ts`, `use-ui-store-hydration.ts` |
| `lib/` module                     | `kebab-case.ts`      | `format.ts`, `navigation.ts`                      |
| Test file                         | `<source>.test.ts`   | `format.test.ts` next to `format.ts`             |
| Store                             | `kebab-case.ts`, `-store` suffix | `ui-store.ts`                          |
| Config module                     | `kebab-case.ts`      | `app.ts`, `layout.ts`, `navigation.ts`           |
| Types module                      | `kebab-case.ts`      | `layout.ts`, `navigation.ts`                      |
| Provider file                     | `PascalCase.tsx`, `-Provider` suffix | `ThemeProvider.tsx`, `MotionProvider.tsx` |
| Barrel                            | `index.ts`           | `components/dashboard/index.ts`                   |
| App Router special file           | lowercase, framework-defined | `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx` |
| Route group directory             | `(kebab-case)`       | `app/(dashboard)/`                                |
| Route segment directory           | `kebab-case`         | `app/(dashboard)/dashboard/`                      |
| Component group directory         | `kebab-case` (lowercase, single word) | `components/layout/`, `components/motion/` |
| Feature directory                 | `kebab-case`         | `features/user-invites/`                          |
| Config / instrumentation at root  | as the framework expects | `next.config.ts`, `instrumentation.ts`, `instrumentation-client.ts` |

The file's primary export and the file name match: `StatCard.tsx` exports
`StatCard`; `use-hydrated.ts` exports `useHydrated`.

## Symbols in code

| Kind                          | Convention                | Examples                                       |
| ----------------------------- | ------------------------- | -------------------------------------------- |
| Component                     | `PascalCase`              | `StatCard`, `TrendIndicator`                  |
| Hook                          | `camelCase`, `use` prefix | `useHydrated`, `useUIStore`                   |
| Function / helper             | `camelCase`, verb-first   | `formatSignedPercent`, `isNavItemActive`, `directionOf` |
| Boolean variable / prop       | `is` / `has` / `should` prefix | `isLoading`, `hasHydrated`, `sidebarCollapsed` |
| Event-handler prop            | `on` prefix               | `onStoreChange`, `onFinishHydration`          |
| Event-handler impl / setter   | `handle` or `set` prefix  | `setSidebarCollapsed`, `toggleSidebar`        |
| Type / interface              | `PascalCase`, no `I` prefix | `NavItem`, `AppUser`, `StatCardProps`       |
| Props interface               | `<ComponentName>Props`    | `StatCardProps`, `DashboardLayoutProps`       |
| Union member (string literal) | `kebab-` or single lower word | `"icon-sm"`, `"up"`, `"muted"`, `"destructive"` |
| Module-level constant (config) | `SCREAMING_SNAKE_CASE`   | `APP_CONFIG`, `LAYOUT`, `DESKTOP_BREAKPOINT`  |
| Local const / in-module lookup | `camelCase`              | `cspHeader`, `directionIcon`, `trendVariants` |
| `cva` variant builder         | `camelCase`, `Variants` suffix | `buttonVariants`, `trendVariants`        |
| Generic type parameter        | `T`, `TKey`, descriptive when >1 | `T`                                    |

- No Hungarian notation, no `I`/`T` prefixes on interfaces/types (`TrendDirection`,
  not `TTrendDirection` or `ITrendDirection`).
- Acronyms keep their case as a unit in `PascalCase`: `UIStore`, `useUIStore`,
  `AppShellRoot`. Lowercased fully in kebab file names: `ui-store.ts`.
- Names say what a thing is for, not what it is: `sidebarFooter`, not
  `slot2`.

## Props naming

- Data in: the noun (`label`, `value`, `user`, `navigation`, `trend`).
- Slots: the location or role (`headerContent`, `headerActions`,
  `sidebarFooter`, `action`).
- Variants: `variant`, `size`, `tone` — reused with the same meaning across
  a group.
- State flags: `isLoading`, `disabled`, `exact`.
- Escape hatch: `className` (always last).

## CSS custom properties & design tokens

| Kind                      | Convention                    | Examples                                        |
| ------------------------- | ---------------------------- | --------------------------------------------- |
| Semantic color token      | `--<role>` / `--<role>-foreground` | `--primary`, `--muted-foreground`, `--card`, `--border` |
| Tailwind theme mapping    | `--color-<role>`             | `--color-primary` → `var(--primary)` in `@theme inline` |
| Radius scale              | `--radius`, `--radius-<size>` | `--radius-sm`, `--radius-md`, `--radius-lg`   |
| Layout dimension (runtime) | `--app-<thing>`             | `--app-header-height`, `--app-mobile-nav-height` |
| Font family               | `--font-<name>`              | `--font-geist-sans`, `--font-sans`, `--font-heading` |

- Always reference tokens by their semantic role, never a literal
  (`bg-primary`, not `bg-green-700`). New roles are added as a
  light/dark pair in `app/globals.css` with a contrast note.
- `config/layout.ts` keys are `camelCase` (`sidebarWidth`), exposed to CSS
  as `--app-…` custom properties by the layout components.

## Data attributes

Follow the shadcn/Base UI convention already in `components/ui/`:
`data-slot="button"`, `data-icon="inline-start"`. Kebab-case name and value.

## Git

| Kind          | Convention                                               | Example                                     |
| ------------- | ------------------------------------------------------- | ----------------------------------------- |
| Branch        | `feature/` · `hotfix/` · `release/` prefix, kebab description | `feature/user-invites`, `hotfix/sidebar-crash`, `release/1.2.0` |
| Ticketed branch | prefix + ticket + description                          | `feature/APP-123-user-invites`             |
| Commit        | [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): summary` | `feat(dashboard): add revenue trend card` |
| Commit types  | `feat` `fix` `chore` `docs` `refactor` `perf` `test` `ci` `security` `release` | —                            |
| Commit scope  | lowercase area, optional                                 | `dashboard`, `sidebar`, `obs`, `template`  |
| Version tag   | `vMAJOR.MINOR.PATCH`                                     | `v1.2.0`                                    |

Summary line: imperative mood, lowercase, no trailing period, ≤ ~72 chars.
Body explains **why**. Full workflow in
[CONTRIBUTING.md](../../CONTRIBUTING.md).

## Documentation files

`SCREAMING_SNAKE` or `Title` for root-level standalone docs by convention
(`README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `AGENTS.md`); `kebab-case.md`
for files inside `docs/` subfolders (`folder-standards.md`). Existing
`docs/AUDIT.md` and `docs/MONITORING.md` predate the subfolder convention
and are left as-is.
