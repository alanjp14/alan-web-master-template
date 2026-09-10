import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "cn";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AppearanceMenu } from "@/components/layout/AppearanceMenu";
import { BrandMark } from "@/components/layout/BrandMark";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { APP_CONFIG } from "@/config/app";
import { marketingNavigation } from "@/config/navigation";
import type { MarketingLink } from "@/types/navigation";

export type { MarketingLink };

export interface MarketingLayoutProps {
  children: ReactNode;
  /** Header nav links. Defaults to `marketingNavigation`. */
  nav?: MarketingLink[];
  /** Primary header call-to-action. Omit to hide it. */
  cta?: MarketingLink;
  /** Footer link groups. Omit for a minimal single-line footer. */
  footerGroups?: { title: string; links: MarketingLink[] }[];
  className?: string;
}

/**
 * Full-bleed shell for public pages — landing, pricing, changelog, docs index.
 *
 * A sticky translucent header (brand, nav, theme + appearance controls, one
 * CTA) over an unconstrained `<main>` — marketing sections own their own
 * width — and a footer. No sidebar, no `motion` dependency: this is the
 * counterpart to `DashboardLayout` for everything outside the app.
 */
export function MarketingLayout({
  children,
  nav = marketingNavigation,
  cta = { label: "Open dashboard", href: "/dashboard" },
  footerGroups,
  className,
}: MarketingLayoutProps) {
  return (
    <div
      className={cn(
        "flex min-h-svh flex-col bg-background text-foreground",
        className
      )}
    >
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <BrandMark href="/" />

          {nav.length > 0 && (
            <nav
              aria-label="Primary"
              className="ml-4 hidden items-center gap-1 md:flex"
            >
              {nav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="ml-auto flex items-center gap-1.5">
            <AppearanceMenu />
            <ThemeToggle />
            {cta && (
              <Button
                nativeButton={false}
                render={<Link href={cta.href} />}
                size="sm"
                className="hidden sm:inline-flex"
              >
                {cta.label}
                <ArrowRight aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          {footerGroups && footerGroups.length > 0 && (
            <div className="grid gap-8 pb-10 sm:grid-cols-2 lg:grid-cols-4">
              {footerGroups.map((group) => (
                <div key={group.title} className="space-y-3">
                  <p className="text-sm font-medium text-foreground">
                    {group.title}
                  </p>
                  <ul className="space-y-2">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          <div
            className={cn(
              "flex flex-col gap-1 text-sm text-muted-foreground",
              footerGroups && footerGroups.length > 0 && "border-t border-border pt-8"
            )}
          >
            <p className="font-medium text-foreground">{APP_CONFIG.name}</p>
            <p>{APP_CONFIG.description}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
