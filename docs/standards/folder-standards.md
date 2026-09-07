# Folder standards

The repository is a layered Next.js App Router project. Each top-level
directory has one job. Put new code in the directory whose job it is; don't
create new top-level directories without a reason the existing ones can't
cover.

## Top-level directories

```
app/          Routing, layouts, pages, and route-level boundaries only
components/    Reusable presentational React components, grouped by domain
config/        Static configuration objects — no logic, no side effects
features/      Self-contained feature modules (UI + hooks + logic for one feature)
hooks/         Reusable React hooks not tied to a single component
lib/           Framework-agnostic pure functions and helpers
providers/     React context providers and their composition
stores/        Zustand stores (global client state)
types/         Shared TypeScript types used across more than one directory
public/        Static assets served as-is
docs/          Project documentation (this folder included)
```

### `app/`

Routing concerns only. A file here is one of: a `page.tsx`, a `layout.tsx`,
a route boundary (`loading.tsx`, `error.tsx`, `not-found.tsx`,
`global-error.tsx`), `globals.css`, or a route handler.

- Pages compose components; they do not define reusable ones. If markup in a
  page would be reused, it moves to `components/` or `features/`.
- Route groups (`(dashboard)`) scope a layout and its boundaries to a set of
  routes. The application shell is mounted from the group's `layout.tsx`,
  never from a page.
- Route boundaries render design-system state components
  (`ErrorState`, `LoadingState`), not bespoke markup.

### `components/`

Reusable components, grouped by domain. Current groups:

| Group                   | Contents                                                                 |
| ----------------------- | --------------------------------------------------------------------- |
| `components/ui/`         | Low-level primitives — shadcn components built on Base UI. Kebab-case files matching upstream. Generated/updated via the shadcn CLI. |
| `components/layout/`     | Application shell: `DashboardLayout`, sidebar, header, mobile nav, `PageContainer`, `ThemeToggle`. |
| `components/dashboard/`  | Data-display building blocks: `StatCard`, `MetricCard`, `DashboardCard`, `SectionHeader`, `Sparkline`, `BarList`, state components, `IconBadge`, `TrendIndicator`. |
| `components/motion/`     | Animation primitives (`FadeIn`, `SlideIn`, …) wrapping `motion`.       |

Add a new group directory when a cohesive set of 3+ components shares a
domain that none of the existing groups covers. A one-off component lives in
the closest existing group.

Each group directory has an `index.ts` barrel (see
[Component standards](component-standards.md#barrels)). `components/ui/` is
the exception — import primitives directly by path.

### `config/`

Plain exported objects and constants: app metadata (`app.ts`), layout
dimensions and breakpoints (`layout.ts`), navigation structure
(`navigation.ts`). No functions with logic, no imports from `app/` or
`components/`, no environment reads. Consuming apps retheme by editing these
files, so keep them declarative.

### `features/`

Home for feature modules — a directory per feature containing that feature's
components, hooks, and logic, depending on `components/`, `hooks/`, `lib/`
but not on other features. Empty in the template by design; it's where
product code lands rather than swelling `components/`.

```
features/
  billing/
    components/
    hooks/
    lib/
    index.ts        Public surface of the feature
```

Shared logic that two features need moves down to `lib/` / `hooks/` /
`components/`, not sideways between features.

### `hooks/`

Reusable hooks with no single owning component (`use-hydrated`,
`use-ui-store-hydration`). A hook used by exactly one component stays in that
component's file or directory. All files `"use client"`.

### `lib/`

Pure, framework-agnostic functions — formatting, matching, computation
(`format.ts`, `navigation.ts`). No React imports, no
`process.env`, no side effects. Every `lib/` module has a colocated
`*.test.ts`. `lib/utils.ts` is a one-line `cn` re-export kept only because
the shadcn CLI config points at it.

### `providers/`

One provider per file, plus `AppProviders.tsx` composing them in order.
Providers are thin: configuration and context wiring, no business logic.

### `stores/`

Global client state as Zustand stores, one concern per store
(`ui-store.ts`). State that belongs to one component subtree uses local
state or context instead. Server/remote state belongs in TanStack Query, not
here.

### `types/`

Types imported by more than one directory (`layout.ts`, `navigation.ts`). A
type used in a single file is declared in that file. A type used across one
feature lives in that feature, not here.

## Colocation rule

Default to colocation. Something moves to a shared directory (`components/`,
`hooks/`, `lib/`, `types/`) at the point it has a **second** consumer, not
in anticipation of one.

## File placement decision guide

| You're adding…                              | It goes in…                                       |
| ------------------------------------------- | ------------------------------------------------ |
| A new page or route                         | `app/…/page.tsx`                                  |
| A shell/navigation element                  | `components/layout/`                              |
| A reusable data-display component           | `components/dashboard/`                           |
| A shadcn primitive                          | `components/ui/` (via the CLI)                    |
| An animation wrapper                        | `components/motion/`                              |
| A whole product feature                     | `features/<feature>/`                             |
| A pure helper used in 2+ places             | `lib/` (with a test)                             |
| A hook used in 2+ places                    | `hooks/`                                          |
| Global client state                         | `stores/`                                         |
| A config constant / declarative object      | `config/`                                         |
| A cross-cutting type                        | `types/`                                          |
