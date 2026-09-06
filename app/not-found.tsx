import { CompassIcon } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/dashboard";
import { Button } from "@/components/ui/button";

/**
 * Root `not-found` boundary — Next.js renders this for any unmatched route
 * or explicit `notFound()` call that isn't caught by a more specific one.
 *
 * Rendered outside `(dashboard)`'s layout (a bad URL doesn't imply the
 * visitor is even in a valid app context), so it's a self-contained, centered
 * page rather than reusing `PageContainer`, which assumes the dashboard shell
 * around it.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <EmptyState
        icon={CompassIcon}
        title="Page not found"
        description="The page you're looking for doesn't exist or may have been moved."
        action={
          <Button nativeButton={false} render={<Link href="/dashboard" />}>
            Back to dashboard
          </Button>
        }
      />
    </div>
  );
}
