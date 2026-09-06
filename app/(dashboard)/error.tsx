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

  // Next.js already redacts a Server Component render error's `message` in
  // production, replacing it with a generic one plus a `digest` for
  // correlating with server logs. This doesn't rely on that alone: an error
  // thrown from a Server Action or Route Handler in code built on this
  // template could still carry something sensitive in its `message` (a
  // connection string, an internal path). Showing the real message only in
  // development is the explicit, defense-in-depth version of the same rule.
  const description =
    process.env.NODE_ENV === "development" && error.message
      ? error.message
      : "An unexpected error occurred. Please try again.";

  return (
    <PageContainer size="sm">
      <ErrorState description={description} onRetry={reset} />
    </PageContainer>
  );
}
