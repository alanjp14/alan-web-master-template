import type { LucideIcon } from "lucide-react";
import { cn } from "cn";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendIndicator, type Trend } from "@/components/dashboard/TrendIndicator";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: Trend;
  /** Footnote shown when there's no `trend`, or alongside one without its own `label`. */
  description?: string;
  isLoading?: boolean;
  size?: "default" | "sm";
  className?: string;
}

/**
 * Compact single-number KPI tile — the classic "4 across the top of a
 * dashboard" card. For a metric with a progress bar or unit suffix, use
 * `MetricCard` instead.
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  description,
  isLoading = false,
  size = "default",
  className,
}: StatCardProps) {
  if (isLoading) {
    return (
      <Card size={size} className={className}>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-4 w-24" />
            {Icon && <Skeleton className="size-8 shrink-0 rounded-lg" />}
          </div>
          <div className="space-y-2">
            <Skeleton className={cn("h-7", size === "sm" ? "w-16" : "w-20")} />
            <Skeleton className="h-4 w-28" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card size={size} className={className}>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-muted-foreground">
            {label}
          </p>
          {Icon && (
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-4" aria-hidden="true" />
            </span>
          )}
        </div>

        <div className="space-y-1">
          <p
            className={cn(
              "font-semibold tracking-tight text-foreground",
              size === "sm" ? "text-xl" : "text-2xl"
            )}
          >
            {value}
          </p>
          {(trend || description) && (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {trend && <TrendIndicator trend={trend} />}
              {description && (
                <span className="text-sm text-muted-foreground">
                  {description}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
