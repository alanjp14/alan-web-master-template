import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "cn";

import { normalizeBars } from "@/lib/chart";

export interface BarListItem {
  /** Row label, shown over the bar. */
  label: string;
  /** Numeric value the bar length is scaled from. */
  value: number;
  /** Makes the row a link to this href. */
  href?: string;
  /** Replaces the formatted value on the right, e.g. a percentage. */
  valueLabel?: ReactNode;
}

export interface BarListProps {
  data: BarListItem[];
  /** Formats `value` for display when a row has no `valueLabel`. @default `toLocaleString()` */
  formatValue?: (value: number) => string;
  /** Sort rows descending by value before rendering. @default true */
  sort?: boolean;
  /** Render at most this many rows. */
  maxItems?: number;
  className?: string;
}

const defaultFormat = (value: number) => value.toLocaleString();

/**
 * Ranked horizontal bars with the label sitting on the bar — the "top pages",
 * "traffic by source", "sales by region" pattern. Zero dependencies, server
 * renderable.
 *
 * The bars are decorative; each row states its label and value in text, so the
 * list is fully legible to a screen reader and with images off. For a single
 * metric's history over time use `Sparkline`.
 */
export function BarList({
  data,
  formatValue = defaultFormat,
  sort = true,
  maxItems,
  className,
}: BarListProps) {
  const rows = normalizeBars(data, (item) => item.value, { sort, maxItems });

  return (
    <ol className={cn("flex flex-col gap-2", className)}>
      {rows.map(({ item, fraction }) => {
        const value = item.valueLabel ?? formatValue(item.value);
        const bar = (
          <>
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-y-0 left-0 rounded-md bg-primary/10 transition-[width]",
                item.href && "group-hover/bar:bg-primary/20"
              )}
              style={{ width: `${Math.max(fraction * 100, 1.5)}%` }}
            />
            <span className="relative z-10 min-w-0 truncate pr-3 font-medium text-foreground">
              {item.label}
            </span>
            <span className="relative z-10 shrink-0 tabular-nums text-muted-foreground">
              {value}
            </span>
          </>
        );

        return (
          <li key={item.label}>
            {item.href ? (
              <Link
                href={item.href}
                className="group/bar relative flex h-9 items-center justify-between overflow-hidden rounded-md px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {bar}
              </Link>
            ) : (
              <div className="relative flex h-9 items-center justify-between overflow-hidden rounded-md px-2.5 text-sm">
                {bar}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
