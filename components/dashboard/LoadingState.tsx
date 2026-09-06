import { Loader2Icon } from "lucide-react";
import { cn } from "cn";

import { Skeleton } from "@/components/ui/skeleton";

export interface LoadingStateProps {
  label?: string;
  /** `spinner` for a brief wait, `skeleton` for content whose shape is known. */
  variant?: "spinner" | "skeleton";
  /** Number of skeleton bars. Ignored for the `spinner` variant. */
  rows?: number;
  className?: string;
}

/**
 * Generic loading placeholder for a widget or page whose content shape isn't
 * fixed enough to warrant a bespoke skeleton.
 *
 * `StatCard` and `MetricCard` render their own layout-matching skeletons
 * instead of this, so a known KPI tile never shifts size when it resolves.
 * Reach for this in `DashboardCard`'s content area, a table body, or a page.
 */
export function LoadingState({
  label = "Loading…",
  variant = "spinner",
  rows = 3,
  className,
}: LoadingStateProps) {
  if (variant === "skeleton") {
    return (
      <div role="status" className={cn("px-6 py-10", className)}>
        <div aria-hidden="true" className="mx-auto flex max-w-sm flex-col gap-2.5">
          {Array.from({ length: rows }).map((_, index) => (
            <Skeleton
              key={index}
              className={cn("h-4", index === rows - 1 && "w-2/3")}
            />
          ))}
        </div>
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center gap-2 px-6 py-10 text-sm text-muted-foreground",
        className
      )}
    >
      <Loader2Icon className="size-5 animate-spin text-primary" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
