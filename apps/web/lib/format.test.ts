import { describe, expect, it } from "vitest";

import {
  formatCompactNumber,
  formatProgressPercent,
  formatSignedPercent,
} from "@/lib/format";

describe("formatSignedPercent", () => {
  it("prefixes a positive value with a plus sign", () => {
    expect(formatSignedPercent(12.4)).toBe("+12.4%");
  });

  it("prefixes a negative value with a true minus sign, not a hyphen", () => {
    expect(formatSignedPercent(-3.1)).toBe("−3.1%");
  });

  it("renders zero with no sign", () => {
    expect(formatSignedPercent(0)).toBe("0%");
  });

  it("respects a custom fraction-digit count", () => {
    expect(formatSignedPercent(12.456, 2)).toBe("+12.46%");
  });
});

describe("formatCompactNumber", () => {
  // The function is deliberately locale-aware (it formats using the
  // runtime's own locale, not a hardcoded one — see its docstring), so these
  // derive the expectation the same way rather than assuming en-US output.
  const compact = (value: number) =>
    new Intl.NumberFormat(undefined, {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);

  it("compacts a large number", () => {
    expect(formatCompactNumber(12400)).toBe(compact(12400));
  });

  it("leaves a small number unabbreviated", () => {
    expect(formatCompactNumber(42)).toBe(compact(42));
  });
});

describe("formatProgressPercent", () => {
  it("computes a whole-number percent of the max", () => {
    expect(formatProgressPercent(72, 100)).toBe(72);
  });

  it("defaults max to 100", () => {
    expect(formatProgressPercent(72)).toBe(72);
  });

  it("clamps a value above the max to 100%", () => {
    expect(formatProgressPercent(150, 100)).toBe(100);
  });

  it("clamps a negative value to 0%", () => {
    expect(formatProgressPercent(-10, 100)).toBe(0);
  });

  it("returns 0 for a non-positive max rather than dividing by it", () => {
    expect(formatProgressPercent(50, 0)).toBe(0);
  });
});
