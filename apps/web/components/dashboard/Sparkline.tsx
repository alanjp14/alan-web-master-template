import { cn } from "cn";

import { seriesDirection, sparklinePaths } from "@/lib/chart";

/** `1`–`5` map to `--chart-1`…`--chart-5`; any other string is used verbatim. */
type SparklineColor = "auto" | 1 | 2 | 3 | 4 | 5 | (string & {});

export interface SparklineProps {
  /** Values oldest-first. Fewer than two renders a flat baseline. */
  data: number[];
  /** Line only, or line plus a soft area wash beneath it. @default "area" */
  variant?: "line" | "area";
  /**
   * Stroke color. `auto` derives it from the trend — rising uses the brand
   * `primary`, falling uses `destructive`, flat uses `muted-foreground`.
   * @default "auto"
   */
  color?: SparklineColor;
  /** viewBox width in user units. The element itself scales to its container. @default 100 */
  width?: number;
  /** viewBox height in user units. @default 32 */
  height?: number;
  /**
   * Accessible description. When omitted the sparkline is `aria-hidden` — pass
   * one whenever it isn't sitting next to the same number in text.
   */
  label?: string;
  className?: string;
}

function resolveColor(color: SparklineColor, data: number[]): string {
  if (typeof color === "number") return `var(--chart-${color})`;
  if (color !== "auto") return color;

  const direction = seriesDirection(data);
  if (direction === "up") return "var(--primary)";
  if (direction === "down") return "var(--destructive)";
  return "var(--muted-foreground)";
}

/**
 * Compact inline trend line — the "little chart in the corner of a KPI tile"
 * treatment. Pure SVG with no charting dependency; safe to render on the
 * server.
 *
 * Pass it to `StatCard`'s `chart` slot, or drop it inline anywhere a number
 * has history worth glancing at. For labelled category comparisons use
 * `BarList` instead.
 */
export function Sparkline({
  data,
  variant = "area",
  color = "auto",
  width = 100,
  height = 32,
  label,
  className,
}: SparklineProps) {
  const { line, area } = sparklinePaths(data, width, height);
  const stroke = resolveColor(color, data);
  const hasLine = line.length > 0;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn("h-8 w-full overflow-visible", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {hasLine ? (
        <>
          {variant === "area" && (
            <path d={area} fill={stroke} fillOpacity={0.12} stroke="none" />
          )}
          <path
            d={line}
            fill="none"
            stroke={stroke}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </>
      ) : (
        <line
          x1={0}
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="var(--muted-foreground)"
          strokeWidth={1.5}
          strokeDasharray="2 3"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}
