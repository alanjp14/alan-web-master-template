import { describe, expect, it } from "vitest";

import { normalizeBars, seriesDirection, sparklinePaths } from "@/lib/chart";

describe("seriesDirection", () => {
  it("reports `up` when the series ends higher than it started", () => {
    expect(seriesDirection([1, 5, 3, 8])).toBe("up");
  });

  it("reports `down` when it ends lower", () => {
    expect(seriesDirection([8, 3, 5, 1])).toBe("down");
  });

  it("reports `flat` for equal endpoints or too few points", () => {
    expect(seriesDirection([4, 9, 4])).toBe("flat");
    expect(seriesDirection([7])).toBe("flat");
    expect(seriesDirection([])).toBe("flat");
  });
});

describe("sparklinePaths", () => {
  it("returns empty paths for fewer than two points", () => {
    expect(sparklinePaths([5])).toEqual({ line: "", area: "" });
  });

  it("starts at x=0 and ends at the full width", () => {
    const { line } = sparklinePaths([1, 2, 3], 100, 32);
    expect(line.startsWith("M0 ")).toBe(true);
    expect(line).toContain("L100 ");
  });

  it("keeps every y within the padded box", () => {
    const { line } = sparklinePaths([0, 100, 50, 75], 100, 32, 2);
    const ys = [...line.matchAll(/[ML][\d.]+ ([\d.]+)/g)].map((m) => Number(m[1]));
    for (const y of ys) {
      expect(y).toBeGreaterThanOrEqual(2);
      expect(y).toBeLessThanOrEqual(30);
    }
  });

  it("puts the maximum value at the top of the box and the minimum at the bottom", () => {
    const { line } = sparklinePaths([10, 20], 100, 32, 2);
    // First point is the min (y near the bottom, height - pad), second the max
    // (y near the top, pad).
    expect(line).toBe("M0 30 L100 2");
  });

  it("closes the area path back down to the baseline", () => {
    const { area } = sparklinePaths([1, 2], 100, 32);
    expect(area.endsWith("L100 32 L0 32 Z")).toBe(true);
  });

  it("centers a flat series instead of dividing by zero", () => {
    const { line } = sparklinePaths([5, 5, 5], 100, 32, 2);
    expect(line).not.toContain("NaN");
    expect(line).toBe("M0 16 L50 16 L100 16");
  });
});

describe("normalizeBars", () => {
  const rows = [
    { label: "a", value: 20 },
    { label: "b", value: 80 },
    { label: "c", value: 40 },
  ];

  it("sorts descending by value and scales against the largest", () => {
    const result = normalizeBars(rows, (r) => r.value);
    expect(result.map((r) => r.item.label)).toEqual(["b", "c", "a"]);
    expect(result[0].fraction).toBe(1);
    expect(result[1].fraction).toBe(0.5);
  });

  it("preserves input order when sorting is disabled", () => {
    const result = normalizeBars(rows, (r) => r.value, { sort: false });
    expect(result.map((r) => r.item.label)).toEqual(["a", "b", "c"]);
  });

  it("caps the row count with `maxItems`", () => {
    expect(normalizeBars(rows, (r) => r.value, { maxItems: 2 })).toHaveLength(2);
  });

  it("clamps negatives to a zero-width bar", () => {
    const result = normalizeBars(
      [{ label: "x", value: -10 }, { label: "y", value: 10 }],
      (r) => r.value
    );
    expect(result.find((r) => r.item.label === "x")?.fraction).toBe(0);
  });

  it("gives every row a zero fraction when the peak is not positive", () => {
    const result = normalizeBars(
      [{ label: "x", value: 0 }, { label: "y", value: 0 }],
      (r) => r.value
    );
    expect(result.every((r) => r.fraction === 0)).toBe(true);
  });
});
