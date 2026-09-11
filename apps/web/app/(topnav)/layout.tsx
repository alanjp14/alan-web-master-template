import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { TopNavLayout } from "@/components/layout";
import { getServerSession } from "@/lib/auth-server";

/**
 * Shell for the top-nav demo (`/workspace`). Shows `TopNavLayout` — the
 * horizontal-navigation alternative to `DashboardLayout`, wired to the real
 * session the same way; see `app/(dashboard)/layout.tsx` for why both the
 * middleware cookie check and this `redirect()` exist.
 */
export default async function TopNavRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();
  if (!session) redirect("/sign-in");

  return (
    <TopNavLayout user={{ name: session.user.name, email: session.user.email }}>
      {children}
    </TopNavLayout>
  );
}
