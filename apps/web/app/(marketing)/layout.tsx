import type { ReactNode } from "react";

import { MarketingLayout } from "@/components/layout";

/**
 * Shell for public pages (`/`, `/pricing`). Mounts `MarketingLayout` once for
 * the whole group — the route group adds no URL segment, so `/` stays `/`.
 *
 * No `MotionProvider` here on purpose: marketing pages are static server
 * components and never render a `motion.*` element, keeping the `motion`
 * dependency scoped to `(dashboard)`.
 */
export default function MarketingRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <MarketingLayout
      footerGroups={[
        {
          title: "Product",
          links: [
            { label: "Dashboard", href: "/dashboard" },
            { label: "Analytics", href: "/analytics" },
            { label: "Pricing", href: "/pricing" },
          ],
        },
        {
          title: "Design system",
          links: [
            { label: "Component showcase", href: "/showcase" },
            { label: "Settings", href: "/settings" },
          ],
        },
        {
          title: "Account",
          links: [
            { label: "Sign in", href: "/sign-in" },
            { label: "Create account", href: "/sign-up" },
          ],
        },
        {
          title: "Layouts",
          links: [
            { label: "Top-nav workspace", href: "/workspace" },
          ],
        },
      ]}
    >
      {children}
    </MarketingLayout>
  );
}
