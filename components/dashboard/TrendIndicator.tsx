import type { LucideIcon } from "lucide-react";
import { MinusIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "cn";

import { formatSignedPercent } from "@/lib/format";

export interface Trend {
  /** Signed percent change, e.g. `12.4` or `-3.1`. `0` renders as neutral. */
  value: number;
  /** Comparison caption, e.g. "vs last month". */
  label?: string;
}

type TrendDirection = "up" | "down" | "neutral";

function directionOf(value: number): TrendDirection {
  if (value > 0) return "up";
  if (value < 0) return "down";
  return "neutral";
}

const directionIcon: Record<TrendDirection, LucideIcon> = {
  up: TrendingUpIcon,
  down: TrendingDownIcon,
  neutral: MinusIcon,
};

// The brand primary IS green, so "up" reuses it directly rather than adding a
// redundant success token — "down" falls back to the existing destructive
// token. Both are semantic colors already in the palette, just applied here.
const trendVariants = cva(
  "inline-flex items-center gap-1 text-sm font-medium tabular-nums",
  {
    variants: {
      direction: {
        up: "text-primary",
        down: "text-destructive",
        neutral: "text-muted-foreground",
      } satisfies Record<TrendDirection, string>,
    },
  }
);

export interface TrendIndicatorProps {
  trend: Trend;
  className?: string;
}

/** Signed percent change with a direction icon, e.g. "▲ 12.4% vs last month". */
export function TrendIndicator({ trend, className }: TrendIndicatorProps) {
  const direction = directionOf(trend.value);
  const Icon = directionIcon[direction];

  return (
    <span className={cn("inline-flex flex-wrap items-center gap-1.5", className)}>
      <span className={cn(trendVariants({ direction }))}>
        <Icon className="size-3.5" aria-hidden="true" />
        {formatSignedPercent(trend.value)}
      </span>
      {trend.label && (
        <span className="text-sm text-muted-foreground">{trend.label}</span>
      )}
    </span>
  );
}
