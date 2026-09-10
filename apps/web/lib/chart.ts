/**
 * Pure geometry helpers for the zero-dependency chart primitives in
 * `components/dashboard/` (`Sparkline`, `BarList`). Kept here, framework-free
 * and unit-tested, so the components stay thin SVG/markup wrappers.
 */

export type SeriesDirection = "up" | "down" | "flat";

/**
 * Compares the last value in a series to the first. Drives the `auto` color
 * mode of `Sparkline` — a rising trend reads as `primary` (the brand green),
 * a falling one as `destructive`.
 */
export function seriesDirection(data: readonly number[]): SeriesDirection {
  if (data.length < 2) return "flat";
  const delta = data[data.length - 1] - data[0];
  if (delta > 0) return "up";
  if (delta < 0) return "down";
  return "flat";
}

export interface SparklinePaths {
  /** `d` for the trend line itself. */
  line: string;
  /** `d` for the same line closed down to the baseline, for an area fill. */
  area: string;
}

const round = (n: number) => Math.round(n * 100) / 100;

/**
 * Builds the SVG path `d` strings for a sparkline drawn inside a
 * `width` x `height` viewBox. `pad` insets the curve vertically so a thick
 * stroke isn't clipped where the series hits its min or max.
 *
 * Returns empty strings for fewer than two points — there's no line to draw —
 * so callers can render a fallback.
 */
export function sparklinePaths(
  data: readonly number[],
  width = 100,
  height = 32,
  pad = 2
): SparklinePaths {
  if (data.length < 2) return { line: "", area: "" };

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min;
  const stepX = width / (data.length - 1);
  const usableHeight = height - pad * 2;

  const line = data
    .map((value, index) => {
      const x = round(index * stepX);
      // A flat series has no range to plot against — center it in the box
      // rather than pinning it to an arbitrary edge.
      const normalized = span === 0 ? 0.5 : (value - min) / span;
      const y = round(pad + usableHeight - normalized * usableHeight);
      return `${index === 0 ? "M" : "L"}${x} ${y}`;
    })
    .join(" ");

  const area = `${line} L${round(width)} ${height} L0 ${height} Z`;

  return { line, area };
}

export interface NormalizedBar<T> {
  item: T;
  /** Share of the row's value against the largest in the set, 0–1. */
  fraction: number;
}

/**
 * Sorts (optionally), caps, and scales a set of rows for `BarList`. The
 * largest value maps to `1`; everything else is a fraction of it. Negative and
 * zero values clamp to `0` width rather than producing a reversed bar.
 */
export function normalizeBars<T>(
  items: readonly T[],
  getValue: (item: T) => number,
  { sort = true, maxItems }: { sort?: boolean; maxItems?: number } = {}
): NormalizedBar<T>[] {
  const ordered = sort
    ? [...items].sort((a, b) => getValue(b) - getValue(a))
    : [...items];

  const capped =
    typeof maxItems === "number" ? ordered.slice(0, Math.max(0, maxItems)) : ordered;

  const peak = capped.reduce((max, item) => Math.max(max, getValue(item)), 0);

  return capped.map((item) => ({
    item,
    fraction: peak > 0 ? Math.max(0, getValue(item)) / peak : 0,
  }));
}
