import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { DashboardLayout } from "@/components/layout";
import { PageTransition } from "@/components/motion";
import { getServerSession } from "@/lib/auth-server";
import { MotionProvider } from "@/providers/MotionProvider";

/**
 * Shell for every route in the `(dashboard)` group.
 *
 * The route group adds no URL segment, so pages keep their own paths while
 * sharing one persistent shell. `middleware.ts` already redirects a
 * signed-out visitor away from these paths on the cookie's mere presence;
 * this `redirect()` is the real check — it only runs once
 * `getServerSession()` has validated the session against the database — and
 * is what actually protects the route if middleware is ever bypassed or
 * misconfigured.
 *
 * `PageTransition` wraps just the per-route content, not the whole shell, so
 * the sidebar and header never remount or animate on navigation.
 *
 * `MotionProvider` lives here rather than in the root `AppProviders` — it's
 * the only route group using `motion`, so scoping it here keeps that
 * dependency out of routes (like the marketing/boilerplate `/` page) that
 * never render a single `motion.*` element.
 */
export default async function DashboardRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();
  if (!session) redirect("/sign-in");

  return (
    <MotionProvider>
      <DashboardLayout user={{ name: session.user.name, email: session.user.email }}>
        <PageTransition>{children}</PageTransition>
      </DashboardLayout>
    </MotionProvider>
  );
}
