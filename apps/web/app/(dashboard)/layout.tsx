import type { ReactNode } from "react";

import { DashboardLayout } from "@/components/layout";
import { PageTransition } from "@/components/motion";
import { MotionProvider } from "@/providers/MotionProvider";

/**
 * Shell for every route in the `(dashboard)` group.
 *
 * The route group adds no URL segment, so pages keep their own paths while
 * sharing one persistent shell. Wire the signed-in user in here — the layout
 * takes an optional `user` prop and hides the account menu without one.
 *
 * `PageTransition` wraps just the per-route content, not the whole shell, so
 * the sidebar and header never remount or animate on navigation.
 *
 * `MotionProvider` lives here rather than in the root `AppProviders` — it's
 * the only route group using `motion`, so scoping it here keeps that
 * dependency out of routes (like the marketing/boilerplate `/` page) that
 * never render a single `motion.*` element.
 */
export default function DashboardRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <MotionProvider>
      <DashboardLayout>
        <PageTransition>{children}</PageTransition>
      </DashboardLayout>
    </MotionProvider>
  );
}
