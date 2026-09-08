"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  APPEARANCE_STORAGE_KEYS,
  DEFAULT_DENSITY,
  DEFAULT_THEME,
  THEMES,
  type Density,
  type ThemeId,
  type ThemeOption,
} from "@/config/theme";
import { normalizeThemeId } from "@/lib/theme";

/**
 * The brand-theme (`data-theme`) and density (`data-density`) axes — the "look
 * and feel" that isn't light/dark mode (that stays with `next-themes`).
 *
 * `<html>` is the source of truth: the pre-paint script
 * (`public/appearance-init.js`) sets both attributes before first paint, the
 * setters here update them, and this hook reads them back through
 * `useSyncExternalStore` — so there's no state to hydrate, no flash, and no
 * mismatch. Preferences persist to `localStorage` and sync across tabs via the
 * `storage` event.
 */

const CHANGE_EVENT = "appearance:change";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function getThemeSnapshot(): ThemeId {
  return normalizeThemeId(document.documentElement.getAttribute("data-theme"));
}

function getDensitySnapshot(): Density {
  return document.documentElement.getAttribute("data-density") === "compact"
    ? "compact"
    : "comfortable";
}

function persist(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage blocked (private mode) — the attribute change still applies */
  }
  // `storage` only fires in *other* tabs; notify this one explicitly.
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export interface UseAppearanceResult {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  density: Density;
  setDensity: (density: Density) => void;
  toggleDensity: () => void;
  /** The full theme registry, for building a switcher. */
  themes: readonly ThemeOption[];
}

export function useAppearance(): UseAppearanceResult {
  const theme = useSyncExternalStore(
    subscribe,
    getThemeSnapshot,
    () => DEFAULT_THEME
  );
  const density = useSyncExternalStore(
    subscribe,
    getDensitySnapshot,
    () => DEFAULT_DENSITY
  );

  const setTheme = useCallback((next: ThemeId) => {
    document.documentElement.setAttribute("data-theme", next);
    persist(APPEARANCE_STORAGE_KEYS.theme, next);
  }, []);

  const setDensity = useCallback((next: Density) => {
    const root = document.documentElement;
    if (next === "compact") {
      root.setAttribute("data-density", "compact");
    } else {
      root.removeAttribute("data-density");
    }
    persist(APPEARANCE_STORAGE_KEYS.density, next);
  }, []);

  const toggleDensity = useCallback(() => {
    setDensity(getDensitySnapshot() === "compact" ? "comfortable" : "compact");
  }, [setDensity]);

  return { theme, setTheme, density, setDensity, toggleDensity, themes: THEMES };
}
