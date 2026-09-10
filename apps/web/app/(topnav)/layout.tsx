import type { ReactNode } from "react";

import { TopNavLayout } from "@/components/layout";

/**
 * Shell for the top-nav demo (`/workspace`). Shows `TopNavLayout` — the
 * horizontal-navigation alternative to `DashboardLayout` — driving the same
 * `config/navigation.ts` entries.
 *
 * The `user` here is a placeholder so the account menu renders in the demo;
 * a real app wires it from its session provider, exactly like `DashboardLayout`.
 */
export default function TopNavRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <TopNavLayout
      user={{ name: "Ada Lovelace", email: "ada@example.com" }}
    >
      {children}
    </TopNavLayout>
  );
}
