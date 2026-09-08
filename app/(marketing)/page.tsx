import type { Metadata } from "next";
import Link from "next/link";
import {
  Accessibility,
  ArrowRight,
  Blocks,
  LayoutDashboard,
  LineChart,
  Palette,
  RadioTower,
  Sparkles,
  SunMoon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/config/app";

export const metadata: Metadata = {
  title: "Overview",
  description: APP_CONFIG.description,
};

const features = [
  {
    icon: Palette,
    title: "Four brand themes",
    body: "Emerald, Sapphire, Amber and Slate — each with its own palette, radius and typeface. Switch live from the header; add your own with one token block.",
  },
  {
    icon: LayoutDashboard,
    title: "Three layout shells",
    body: "Sidebar dashboard, horizontal top-nav workspace, and a full-bleed marketing shell — plus a centered auth layout. Pick per screen.",
  },
  {
    icon: Blocks,
    title: "Design system",
    body: "Stat, metric and widget cards with built-in loading, empty and error states, on shadcn / Base UI primitives. Card variants: elevated, flat, outlined.",
  },
  {
    icon: LineChart,
    title: "Data visualization",
    body: "Dependency-free Sparkline and BarList primitives wired to a categorical, per-theme chart palette.",
  },
  {
    icon: SunMoon,
    title: "Theming & density",
    body: "Light / dark / system mode on every theme, WCAG-AA tuned, plus a comfortable / compact density switch that rescales the whole spacing system.",
  },
  {
    icon: RadioTower,
    title: "Observability & CI",
    body: "Sentry, Microsoft Clarity and Vercel Analytics pre-wired and dormant until you set each key; lint + typecheck + test + build gate on every push.",
  },
] as const;

/**
 * Landing page for the template. Rendered inside `MarketingLayout` (the
 * `(marketing)` route group's shell), so it owns only its sections — the
 * header, nav and footer come from the layout.
 */
export default function Home() {
  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Next.js App Router · TypeScript · Tailwind v4
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            One foundation. Every look your clients ask for.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground text-pretty">
            A responsive application shell, a coherent component library, four
            switchable brand themes, three layout archetypes — themed light and
            dark, accessible by default, with monitoring and CI wired in.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              nativeButton={false}
              render={<Link href="/showcase" />}
              size="lg"
            >
              Open the showcase
              <ArrowRight aria-hidden="true" />
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/dashboard" />}
              variant="outline"
              size="lg"
            >
              Explore the dashboard
            </Button>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="border-t border-border bg-muted/30 scroll-mt-16"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            What&apos;s in the box
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Every piece is documented, tested against the light and dark themes,
            and safe to build on directly.
          </p>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <li
                key={feature.title}
                className="flex flex-col gap-3 rounded-xl bg-card p-5 text-card-foreground ring-1 ring-foreground/10"
              >
                <span
                  aria-hidden="true"
                  className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"
                >
                  <feature.icon className="size-5" />
                </span>
                <h3 className="font-medium">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-col gap-4 rounded-xl border border-dashed border-border p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Accessibility
              className="mt-0.5 size-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div className="space-y-1">
              <p className="text-sm font-medium">
                A starting point, not a finished product.
              </p>
              <p className="text-sm text-muted-foreground">
                Authentication, a database and real data are yours to add — the
                template is honest about where its edges are.
              </p>
            </div>
          </div>
          <Button
            nativeButton={false}
            render={<Link href="/pricing" />}
            variant="secondary"
            size="sm"
            className="shrink-0"
          >
            See pricing
          </Button>
        </div>
      </section>
    </>
  );
}
