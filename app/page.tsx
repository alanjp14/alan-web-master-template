import type { Metadata } from "next";
import Link from "next/link";
import {
  Accessibility,
  ArrowRight,
  Blocks,
  LayoutDashboard,
  LineChart,
  RadioTower,
  Sparkles,
  SunMoon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { APP_CONFIG } from "@/config/app";

export const metadata: Metadata = {
  title: "Overview",
  description: APP_CONFIG.description,
};

const features = [
  {
    icon: LayoutDashboard,
    title: "Application shell",
    body: "Persistent collapsible sidebar, sticky header, mobile drawer and bottom navigation — mounted once, kept across route changes.",
  },
  {
    icon: Blocks,
    title: "Design system",
    body: "Stat, metric and widget cards with built-in loading, empty and error states, on shadcn / Base UI primitives.",
  },
  {
    icon: LineChart,
    title: "Data visualization",
    body: "Dependency-free Sparkline and BarList primitives wired to a categorical, brand-anchored chart palette.",
  },
  {
    icon: Sparkles,
    title: "Motion",
    body: "FadeIn, SlideIn, ScaleIn and staggered reveals on the motion library — every one honors reduced-motion.",
  },
  {
    icon: SunMoon,
    title: "Theming",
    body: "Green-and-white token system, WCAG-AA checked, light and dark, switchable from the header.",
  },
  {
    icon: RadioTower,
    title: "Observability",
    body: "Sentry, Microsoft Clarity and Vercel Analytics pre-wired and dormant until you set each key.",
  },
] as const;

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <span className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
            >
              {APP_CONFIG.name.charAt(0)}
            </span>
            <span className="text-sm font-semibold tracking-tight">
              {APP_CONFIG.name}
            </span>
          </span>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <Button
              nativeButton={false}
              render={<Link href="/dashboard" />}
              size="sm"
            >
              Open dashboard
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Next.js App Router · TypeScript · Tailwind v4
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              The enterprise dashboard foundation, already built.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground text-pretty">
              A responsive application shell, a coherent component library,
              themed light and dark, accessible by default, with monitoring and
              CI wired in. Start from real patterns instead of a blank page.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                nativeButton={false}
                render={<Link href="/dashboard" />}
                size="lg"
              >
                Explore the dashboard
                <ArrowRight aria-hidden="true" />
              </Button>
              <Button
                nativeButton={false}
                render={<Link href="#features" />}
                variant="outline"
                size="lg"
              >
                See what&apos;s inside
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
              Every piece is documented, tested against the light and dark
              themes, and safe to build on directly.
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
                  Authentication, a database and real data are yours to add —
                  the template is honest about where its edges are.
                </p>
              </div>
            </div>
            <Button
              nativeButton={false}
              render={<Link href="/dashboard" />}
              variant="secondary"
              size="sm"
              className="shrink-0"
            >
              Open the dashboard
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:px-8">
          <p className="font-medium text-foreground">{APP_CONFIG.name}</p>
          <p>{APP_CONFIG.description}</p>
        </div>
      </footer>
    </div>
  );
}
