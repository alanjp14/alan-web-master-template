"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/dashboard";
import { PageContainer } from "@/components/layout";

/**
 * Route-group error boundary for `(dashboard)`.
 *
 * Catches exceptions thrown while rendering any page in this group. Scoped
 * beneath `app/(dashboard)/layout.tsx`, so the sidebar and header stay
 * mounted and interactive — only the content area is replaced, matching how
 * `DashboardCard`'s own `error` prop behaves for a single widget instead of
 * a whole page.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Next.js's error overlay already shows this in dev; logging here is
    // what ships to production, where a real app would forward it to its
    // error-reporting service instead.
    console.error(error);
  }, [error]);

  return (
    <PageContainer size="sm">
      <ErrorState
        description={
          error.message || "An unexpected error occurred. Please try again."
        }
        onRetry={reset}
      />
    </PageContainer>
  );
}
