# Coding standards

## Language & tooling

- **TypeScript, `strict` mode.** No implicit `any`. `pnpm typecheck` must
  pass with zero errors.
- **ESLint** via `eslint-config-next` (`eslint.config.mjs`). `pnpm lint`
  must pass clean — no disable comments without a one-line reason.
- **Formatting** follows the repo's existing style: 2-space indent, double
  quotes, semicolons, trailing commas in multiline literals. Match the file
  you're editing.
- **Node** `^22.12.0 || ^24.0.0 || >=26.0.0` (`engines`). **pnpm** only —
  the lockfile is `pnpm-lock.yaml`.

## TypeScript

- Prefer `interface` for object/props shapes, `type` for unions, mapped
  types, and function types. (`StatCardProps` is an `interface`; `Trend`
  direction is a `type` union.)
- Export the types a module's consumers need alongside the values — props
  interfaces are exported, not local.
- Derive, don't duplicate: `VariantProps<typeof buttonVariants>`,
  `satisfies Record<TrendDirection, string>`. Use `satisfies` to check a
  literal against a type without widening it.
- No enums — use string-literal unions (`"up" | "down" | "neutral"`).
- Type external boundaries explicitly; let inference handle locals.
- `import type { … }` for type-only imports.

## React

- **Server components by default.** Add `"use client"` only when the file
  needs state, effects, event handlers, browser APIs, or a client-only
  library. `DashboardLayout` is a server component; only the chrome parts
  that read pathname or the store opt into the client bundle.
- Function declarations for components (`export function StatCard(...)`),
  not `const StatCard = () => …`.
- One primary export per component file, named the same as the file.
- Hooks: `use-` prefix, `"use client"`, rules-of-hooks enforced by lint.
  Prefer `useSyncExternalStore` over `useState`+`useEffect` for
  external/hydration state (see `hooks/use-hydrated.ts`).
- No `dangerouslySetInnerHTML`, `eval`, or `new Function` — React's default
  escaping is the only rendering path (enforced by security review, see
  [SECURITY.md](../../SECURITY.md)).

## Imports

Order, with a blank line between groups:

1. External packages (`react`, `next/*`, `lucide-react`, `cn`, `motion`).
2. Internal `@/*` aliased imports.
3. Relative imports (`./`).

```ts
import type { LucideIcon } from "lucide-react";
import { cn } from "cn";

import { Card, CardContent } from "@/components/ui/card";
import { IconBadge } from "@/components/dashboard/IconBadge";
```

- `@/*` is the repo root (`tsconfig.json`, mirrored in `vitest.config.mts`).
  Use it for anything outside the current directory; use `./` within a
  directory or feature.
- `cn` comes from the `cn` package directly: `import { cn } from "cn"`.
- Import `components/ui/` primitives by path; import from other component
  groups via their barrel (`@/components/dashboard`).

## Styling

- **Tailwind CSS v4** utility classes. No CSS modules, no styled-components,
  no inline `style` except for dynamic values that can't be a class (CSS
  custom properties for layout dimensions, as in `DashboardLayout`).
- Compose conditional classes with `cn(...)`. Multi-variant components use
  `cva` (`class-variance-authority`) with `variants` + `defaultVariants` —
  see `components/ui/button.tsx`, `TrendIndicator`.
- **Semantic design tokens only.** Use `text-foreground`,
  `bg-primary`, `text-muted-foreground`, `border-border` — never raw colors
  (`text-green-700`, `#16a34a`). Tokens are defined in `app/globals.css` for
  both themes; a raw color breaks dark mode and theming.
- Every color must resolve in **both** light and dark. Don't add a one-off
  color; if a genuinely new semantic role is needed, add a token pair to
  `globals.css`.
- Respect `prefers-reduced-motion`: animate via `components/motion/` or
  `motion.*` elements, which `MotionProvider` gates automatically. Don't
  hand-roll transitions on transform/scale without a reduced-motion guard.
- Contrast: text pairs must meet WCAG AA (4.5:1). New token pairs get a
  contrast note in `globals.css` like the existing ones.

## State management

| Kind of state                      | Tool                                             |
| ---------------------------------- | ---------------------------------------------- |
| Local UI state                     | `useState` / `useReducer`                        |
| Shared client state (cross-tree)   | Zustand store in `stores/`                       |
| Server / remote data               | TanStack Query (`providers/QueryProvider.tsx`)   |
| Theme                              | `next-themes` (`ThemeProvider`)                  |
| URL-derived state                  | `usePathname` / `useSearchParams` — don't mirror it into a store |

- Zustand: select **per field**, never destructure the whole store —
  `useUIStore((s) => s.sidebarCollapsed)`, not `const { … } = useUIStore()`.
  Whole-store selection re-renders on every change.
- `persist` stores use `partialize` to persist only real preferences, and
  `skipHydration` + a hydration hook when the value affects SSR markup (see
  `stores/ui-store.ts` + `hooks/use-ui-store-hydration.ts`).
- `QueryClient` is created per-mount via `useState(() => new QueryClient())`,
  never at module scope — a module singleton leaks one request's data into
  another's SSR response.

## Environment variables

- Access only what's documented in `.env.example`. Every variable is
  optional; code must run with none set.
- Browser-exposed variables are `NEXT_PUBLIC_`-prefixed and read at build
  time. Everything else stays server-only.
- Monitoring integrations are gated on their env var and must no-op cleanly
  when it's absent (see `instrumentation*.ts`).
- Never put secrets or personal data in `NEXT_PUBLIC_` variables, URLs, or
  the repo. `.env.local` is git-ignored; `.env.example` carries placeholders
  only.

## Error handling

- User-facing errors render through `ErrorState` / the route `error.tsx`
  boundaries, not raw `throw` output.
- Raw `error.message` is shown only when `NODE_ENV === "development"`;
  production shows a generic message (a thrown value may carry a connection
  string or internal path). Both boundaries `console.error` the real error.
- `lib/` functions handle their own edge cases (divide-by-zero, empty input)
  and return a sensible value rather than throwing — see
  `formatProgressPercent`.

## Comments

- Comment **why**, not what. Every non-obvious decision in this codebase has
  a comment explaining the tradeoff (the CSP `'unsafe-inline'` choice, the
  per-mount `QueryClient`, `skipHydration`). Match that bar.
- JSDoc on every exported component, hook, and helper: one sentence on what
  it's for, and when to reach for a sibling instead ("For a metric with a
  progress bar, use `MetricCard`").
- No commented-out code. No `TODO`/`FIXME` left in `develop` — file an issue
  or a `spawn_task` chip instead.

## Testing

- Vitest, `pnpm test`. Test files are colocated: `lib/format.ts` →
  `lib/format.test.ts`.
- **Required**: every `lib/` pure function has unit tests covering the happy
  path and its documented edge cases.
- Components are currently verified by typecheck + build + live browser
  checks. If you add component tests, colocate them and keep them
  behavior-focused (rendered output, a11y roles), not snapshot dumps.
- CI runs `test` before `build`; a failing test blocks merge.

## The framework

This tracks a fast-moving Next.js release. Before writing framework-level
code (route config, caching, instrumentation, `next.config.ts`), read the
relevant guide under `node_modules/next/dist/docs/` — see
[AGENTS.md](../../AGENTS.md). Heed deprecation notices there over older
patterns from memory.
