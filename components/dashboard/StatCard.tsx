import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "cn";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IconBadge } from "@/components/dashboard/IconBadge";
import { TrendIndicator, type Trend } from "@/components/dashboard/TrendIndicator";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: Trend;
  /** Footnote shown when there's no `trend`, or alongside one without its own `label`. */
  description?: string;
  /** Visual sitting below the value — typically a `<Sparkline />`. */
  chart?: ReactNode;
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
  chart,
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
          {chart && <Skeleton className="h-8 w-full" />}
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
          {Icon && <IconBadge icon={Icon} />}
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

        {chart && <div className="mt-3">{chart}</div>}
      </CardContent>
    </Card>
  );
}
