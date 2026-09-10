import { describe, expect, it } from "vitest";

import { DEFAULT_DENSITY, DEFAULT_THEME } from "@/config/theme";
import {
  THEME_IDS,
  isDensity,
  isThemeId,
  normalizeDensity,
  normalizeThemeId,
} from "@/lib/theme";

describe("isThemeId", () => {
  it("accepts a registered id", () => {
    expect(isThemeId("emerald")).toBe(true);
    expect(isThemeId("slate")).toBe(true);
  });

  it("rejects an unknown id, wrong type, or empty value", () => {
    expect(isThemeId("teal")).toBe(false);
    expect(isThemeId(null)).toBe(false);
    expect(isThemeId(1)).toBe(false);
    expect(isThemeId("")).toBe(false);
  });

  it("covers every entry in the registry", () => {
    for (const id of THEME_IDS) {
      expect(isThemeId(id)).toBe(true);
    }
  });
});

describe("isDensity", () => {
  it("accepts the two valid values", () => {
    expect(isDensity("comfortable")).toBe(true);
    expect(isDensity("compact")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isDensity("cozy")).toBe(false);
    expect(isDensity(undefined)).toBe(false);
  });
});

describe("normalizeThemeId", () => {
  it("passes a valid id through", () => {
    expect(normalizeThemeId("sapphire")).toBe("sapphire");
  });

  it("falls back to the default for junk", () => {
    expect(normalizeThemeId("nope")).toBe(DEFAULT_THEME);
    expect(normalizeThemeId(null)).toBe(DEFAULT_THEME);
  });
});

describe("normalizeDensity", () => {
  it("passes a valid value through", () => {
    expect(normalizeDensity("compact")).toBe("compact");
  });

  it("falls back to the default for junk", () => {
    expect(normalizeDensity("loose")).toBe(DEFAULT_DENSITY);
  });
});
