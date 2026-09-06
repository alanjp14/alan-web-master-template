import type { ReactNode } from "react";

import { DashboardLayout } from "@/components/layout";

/**
 * Shell for every route in the `(dashboard)` group.
 *
 * The route group adds no URL segment, so pages keep their own paths while
 * sharing one persistent shell. Wire the signed-in user in here — the layout
 * takes an optional `user` prop and hides the account menu without one.
 */
export default function DashboardRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
