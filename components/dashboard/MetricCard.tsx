import type { LucideIcon } from "lucide-react";
import { cn } from "cn";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendIndicator, type Trend } from "@/components/dashboard/TrendIndicator";
import { formatProgressPercent } from "@/lib/format";

export interface MetricCardProgress {
  /** Raw current value, e.g. `72`. */
  value: number;
  /** Raw target value the bar is measured against. Default `100`. */
  max?: number;
  /** Caption above the bar, e.g. "72 of 100 GB used". */
  label?: string;
}

export interface MetricCardProps {
  label: string;
  value: string | number;
  /** Appended after `value`, e.g. "GB" or "sessions". */
  unit?: string;
  icon?: LucideIcon;
  trend?: Trend;
  /** Renders a goal/quota bar below the value using shadcn's `Progress`. */
  progress?: MetricCardProgress;
  isLoading?: boolean;
  size?: "default" | "sm";
  className?: string;
}

/**
 * Single-metric card with room for a unit suffix and a goal/quota progress
 * bar — storage used, quota consumed, completion rate. For a plain KPI number
 * with no bar, `StatCard` is the lighter-weight choice.
 */
export function MetricCard({
  label,
  value,
  unit,
  icon: Icon,
  trend,
  progress,
  isLoading = false,
  size = "default",
  className,
}: MetricCardProps) {
  if (isLoading) {
    return (
      <Card size={size} className={className}>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-4 w-28" />
            {Icon && <Skeleton className="size-8 shrink-0 rounded-lg" />}
          </div>
          <Skeleton className={cn("h-7", size === "sm" ? "w-20" : "w-24")} />
          {progress && (
            <div className="space-y-1.5 pt-1">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  const progressPercent = progress
    ? formatProgressPercent(progress.value, progress.max ?? 100)
    : null;

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

        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <p
            className={cn(
              "font-semibold tracking-tight text-foreground",
              size === "sm" ? "text-xl" : "text-2xl"
            )}
          >
            {value}
            {unit && (
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                {unit}
              </span>
            )}
          </p>
          {trend && <TrendIndicator trend={trend} />}
        </div>

        {progress && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <span className="truncate">{progress.label}</span>
              <span className="shrink-0 tabular-nums">{progressPercent}%</span>
            </div>
            <Progress
              value={progress.value}
              max={progress.max ?? 100}
              aria-label={progress.label ?? label}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
