/**
 * Formats a signed percentage for trend indicators, e.g. `12.4` -> "+12.4%",
 * `-3.1` -> "−3.1%" (a true minus sign, not a hyphen), `0` -> "0%".
 */
export function formatSignedPercent(value: number, fractionDigits = 1): string {
  if (value === 0) {
    return "0%";
  }

  const sign = value > 0 ? "+" : "−";
  return `${sign}${Math.abs(value).toFixed(fractionDigits)}%`;
}

/**
 * Formats a large number compactly for stat tiles, e.g. `12400` -> "12.4K".
 * Uses the runtime's locale so grouping matches the viewer's expectations.
 */
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** Clamps a raw value against a maximum and returns the whole-number percent. */
export function formatProgressPercent(value: number, max = 100): number {
  if (max <= 0) {
    return 0;
  }

  return Math.round(Math.min(Math.max(value, 0), max) * 100 / max);
}
