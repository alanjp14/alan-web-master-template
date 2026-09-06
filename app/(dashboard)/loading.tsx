import { LoadingState } from "@/components/dashboard";
import { PageContainer } from "@/components/layout";

/**
 * Route-group loading boundary for `(dashboard)`.
 *
 * Next.js renders this automatically — wrapping the segment below in a
 * Suspense boundary — while an async Server Component in this group is still
 * resolving. Nothing here is `async` yet, so it never actually triggers
 * today, but it's the correct place for it once a page starts fetching data
 * directly in a Server Component.
 */
export default function DashboardLoading() {
  return (
    <PageContainer>
      <LoadingState label="Loading…" />
    </PageContainer>
  );
}
