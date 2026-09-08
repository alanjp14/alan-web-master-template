/**
 * Brand-theme registry — the "look and feel" axis, independent of light/dark
 * mode (which `next-themes` owns).
 *
 * Each entry corresponds to a `[data-theme="<id>"]` block in `app/themes.css`
 * that overrides the accent tokens, `--radius` and the font tokens. `emerald`
 * is the default and lives directly on `:root` / `.dark` in `app/globals.css`,
 * so it has no override block of its own.
 *
 * To add a theme: add an entry here, add the matching `[data-theme]` blocks
 * (light + dark) to `app/themes.css`, done — no component changes. Runtime
 * helpers (guards, id list) live in `lib/theme.ts`.
 */

/** The `data-theme` attribute value written to `<html>`. */
export type ThemeId = "emerald" | "sapphire" | "amber" | "slate";

export interface ThemeOption {
  id: ThemeId;
  /** Shown in the theme switcher. */
  label: string;
  /** One line on the personality this theme carries. */
  description: string;
  /**
   * Preview swatch, `[light, dark]`. Static hex purely for the switcher dots —
   * the live tokens are the source of truth, these just need to read close.
   */
  swatch: readonly [string, string];
}

export const THEMES = [
  {
    id: "emerald",
    label: "Emerald",
    description: "Balanced, friendly enterprise. The default green system.",
    swatch: ["#15803d", "#4ade80"],
  },
  {
    id: "sapphire",
    label: "Sapphire",
    description: "Classic corporate blue, tighter radii — fintech and B2B SaaS.",
    swatch: ["#1d4ed8", "#60a5fa"],
  },
  {
    id: "amber",
    label: "Amber",
    description: "Warm, editorial, serif headings — content and lifestyle brands.",
    swatch: ["#b45309", "#fbbf24"],
  },
  {
    id: "slate",
    label: "Slate",
    description: "High-contrast, near-monochrome, sharp corners — developer tools.",
    swatch: ["#334155", "#94a3b8"],
  },
] as const satisfies readonly ThemeOption[];

/** Written to `<html data-theme>` when no preference is stored. */
export const DEFAULT_THEME: ThemeId = "emerald";

/** Density (spacing) axis. `comfortable` is the default and needs no attribute. */
export type Density = "comfortable" | "compact";

export const DEFAULT_DENSITY: Density = "comfortable";

/** localStorage keys the pre-paint script (`public/appearance-init.js`) and the
 *  `AppearanceProvider` share. */
export const APPEARANCE_STORAGE_KEYS = {
  theme: "appearance:theme",
  density: "appearance:density",
} as const;
