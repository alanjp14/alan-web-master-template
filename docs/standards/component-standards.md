# Component standards

How components in this template are built. Applies to `components/layout/`,
`components/dashboard/`, `components/motion/`, and feature components.
`components/ui/` primitives follow shadcn/Base UI upstream conventions and
are exempt from the parts that conflict.

## Anatomy

A component file, top to bottom:

```tsx
import type { LucideIcon } from "lucide-react";   // 1. imports (see coding-standards)
import { cn } from "cn";

import { Card, CardContent } from "@/components/ui/card";

export interface StatCardProps {                  // 2. exported props interface
  label: string;
  value: string | number;
  icon?: LucideIcon;
  isLoading?: boolean;
  size?: "default" | "sm";
  className?: string;
}

/**                                               // 3. JSDoc: purpose + when to
 * Compact single-number KPI tile. For a metric      use a sibling instead
 * with a progress bar, use `MetricCard`.
 */
export function StatCard({                         // 4. named function, destructured props,
  label,                                              defaults inline
  value,
  isLoading = false,
  size = "default",
  className,
}: StatCardProps) {
  if (isLoading) {
    return (/* skeleton branch */);                // 5. early returns for distinct states
  }

  return (/* main render */);
}
```

One primary component per file. Small private helpers (`directionOf`,
`directionIcon`) may sit above the component in the same file; a helper
that's exported or reused belongs elsewhere.

## Props

- **Always define an exported `interface <Name>Props`.** Export it from the
  barrel too.
- **Always accept `className?: string`** as the last prop, and merge it last
  through `cn(...)` so callers can override.
- Destructure props in the signature with defaults inline
  (`isLoading = false`, `size = "default"`).
- Optional-by-default: only `children` and the genuinely-required data are
  non-optional.
- Keep the surface small. Prefer a `variant`/`size` union over many
  booleans. Never more than one boolean that could be a union.
- Composition over configuration: expose `ReactNode` slots
  (`headerActions`, `sidebarFooter`, `action`) instead of growing a config
  object.
- Icons are passed as components (`icon?: LucideIcon`), rendered by the
  component (`<Icon className="size-4" aria-hidden="true" />`), never as
  elements.
- `children: ReactNode` for content; `title?: ReactNode` (not `string`) when
  callers might pass markup.

## Variants

- Multi-variant styling uses `cva` with explicit `variants` and
  `defaultVariants`. Expose the variant prop as a union type, not `string`.
- Type the variant map against its keys:
  `satisfies Record<TrendDirection, string>`.
- Reuse existing design tokens for variant colors. `TrendIndicator`'s "up"
  reuses `text-primary` (the brand is green) rather than adding a `success`
  token. Add a token only for a genuinely new semantic role.
- Sizes are a small named set (`"sm" | "default" | "lg"`), consistent across
  the group — `IconBadge`, `StatCard`, `Card` all share the vocabulary.

## States

A data-display component handles these explicitly:

| State   | How                                                                       |
| ------- | ---------------------------------------------------------------------- |
| Loading | `isLoading?: boolean` prop → renders a `Skeleton` layout mirroring the real one's dimensions. Early-return branch. |
| Empty   | `EmptyState` in the content area (icon, title, description, optional action). |
| Error   | `ErrorState` (tone `destructive`, `role="alert"`).                        |
| Ready   | The normal render.                                                        |

- Loading skeletons must match the real layout's shape so nothing shifts on
  load.
- `EmptyState` / `ErrorState` build on the shared `StateMessage` and assume
  no container of their own — they drop into a card, a table body, or a page.
- Route-level loading/error use `app/(dashboard)/loading.tsx` /
  `error.tsx`, which render the same components.

## Accessibility

Non-negotiable — the template passes a WCAG AA audit and code added to it
must not regress that.

- Decorative icons: `aria-hidden="true"`. Meaningful icons need an
  accessible label.
- Interactive elements are real `<button>` / `<a>` (or Base UI primitives),
  keyboard-operable, with visible `focus-visible` rings (tokens already in
  the primitives).
- Touch targets ≥ 44px on mobile surfaces (drives the "≤ 4 items" rule in
  `config/navigation.ts`'s `mobileNavigation`).
- Error containers: `role="alert"`. Skip-links and focusable landmarks as in
  `DashboardLayout` (`#main-content`, `tabIndex={-1}`).
- Respect `prefers-reduced-motion` — animate through `components/motion/` or
  `motion.*`, never unguarded transform transitions.
- Contrast ≥ 4.5:1 for text. Verify with real tokens in both themes.
- Test keyboard-only and with a screen reader for anything interactive
  before handoff.

## Styling rules

- Tailwind utilities + `cn()`. Semantic tokens only (see
  [coding-standards](coding-standards.md#styling)).
- `className` merges last so it always wins.
- Layout dimensions come from `config/layout.ts` as CSS custom properties —
  don't hardcode sidebar/header sizes in a component.
- No fixed colors, no `style` attribute except for dynamic custom-property
  values.

## Data visualization

- No charting library. `Sparkline` and `BarList` are pure SVG/markup over
  geometry helpers in `lib/chart.ts` (unit-tested there, per the
  [folder standards](folder-standards.md#lib)). Add new chart types the same
  way — logic in `lib/`, a thin server-renderable component on top — before
  reaching for a dependency.
- Series colors come from the `--chart-1`…`--chart-5` tokens (a categorical
  palette, `chart-1` = brand green) or the semantic `primary` / `destructive`
  / `muted-foreground` tokens. Never a literal color.
- A chart that stands in for a number must be reachable without it: give it
  `role="img"` + a descriptive `aria-label`, or render the same values as
  text beside it (`BarList` does the latter). A purely decorative sparkline
  sitting next to its own figure is `aria-hidden`.
- Charts are composed in, not configured: `StatCard` takes a `chart`
  `ReactNode` slot rather than sprouting `sparklineData` props.

## Client/server boundary

- A component is a server component unless it needs client features.
- When only part of a subtree needs the client, split it: keep the parent a
  server component and mark the leaf `"use client"` (as `DashboardLayout`
  does with `AppHeader` / `AppSidebar`).
- Client-only-with-nothing-to-SSR (portals, toasters) can be
  `next/dynamic` with `ssr: false` — but only when no child needs its
  context synchronously on first render (the reason `Toaster` is lazy but
  `QueryProvider` is not).

## Barrels

- Each component group (except `components/ui/`) has an `index.ts`
  re-exporting every public component **and its props type**:

  ```ts
  export { StatCard, type StatCardProps } from "./StatCard";
  ```

- Shared-but-not-public helpers (`StateMessage`) are still exported from the
  barrel with a JSDoc note that callers should prefer the specific wrapper.
- Import across groups via the barrel (`@/components/dashboard`); import
  within a group by relative path.

## Checklist for a new component

- [ ] In the right group directory ([folder-standards](folder-standards.md))
- [ ] Named export, function declaration, file name == component name
- [ ] Exported `interface <Name>Props` with `className?: string` last
- [ ] JSDoc: purpose + when to use a sibling instead
- [ ] Server component unless it needs client features
- [ ] `variant`/`size` as unions via `cva` if multi-variant
- [ ] Loading / empty / error states handled where applicable
- [ ] Semantic tokens only; verified in light **and** dark
- [ ] Icons `aria-hidden` unless meaningful; focus states visible; AA contrast
- [ ] Added to the group's `index.ts` with its props type
- [ ] `pnpm lint && pnpm typecheck && pnpm build` pass
