/**
 * Runtime helpers for the brand-theme / density appearance axes. The data
 * itself is in `config/theme.ts`; this module is the framework-agnostic,
 * unit-tested logic layer on top (guards, id list, storage parsing) used by
 * `AppearanceProvider` and the pre-paint init script's TypeScript twin.
 */
import {
  DEFAULT_DENSITY,
  DEFAULT_THEME,
  THEMES,
  type Density,
  type ThemeId,
} from "@/config/theme";

/** All registered `data-theme` values, in registry order. */
export const THEME_IDS: readonly ThemeId[] = THEMES.map((theme) => theme.id);

export function isThemeId(value: unknown): value is ThemeId {
  return (
    typeof value === "string" && (THEME_IDS as readonly string[]).includes(value)
  );
}

export function isDensity(value: unknown): value is Density {
  return value === "comfortable" || value === "compact";
}

/** Coerce an unknown stored value to a valid theme id, falling back to default. */
export function normalizeThemeId(value: unknown): ThemeId {
  return isThemeId(value) ? value : DEFAULT_THEME;
}

/** Coerce an unknown stored value to a valid density, falling back to default. */
export function normalizeDensity(value: unknown): Density {
  return isDensity(value) ? value : DEFAULT_DENSITY;
}
