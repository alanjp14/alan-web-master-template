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
          title: "Layanan & Solusi",
          links: [
            { label: "Cloud & DevOps", href: "/#services" },
            { label: "Enterprise Software", href: "/#services" },
            { label: "Cyber Security", href: "/#services" },
            { label: "Web Tools IT", href: "/tools" },
          ],
        },
        {
          title: "Aplikasi & Platform",
          links: [
            { label: "Dashboard", href: "/dashboard" },
            { label: "Analytics", href: "/analytics" },
            { label: "Workspace Top-Nav", href: "/workspace" },
            { label: "Harga", href: "/pricing" },
          ],
        },
        {
          title: "Design System",
          links: [
            { label: "Component Showcase", href: "/showcase" },
            { label: "Settings", href: "/settings" },
          ],
        },
        {
          title: "Akun",
          links: [
            { label: "Sign in", href: "/sign-in" },
            { label: "Create account", href: "/sign-up" },
          ],
        },
      ]}
    >
      {children}
    </MarketingLayout>
  );
}
