/*
 * Pre-paint appearance sync. Loaded blocking in <head> via next/script
 * `beforeInteractive` (app/layout.tsx) so the brand theme and density are on
 * <html> before first paint — no flash of the default theme.
 *
 * Kept as a static same-origin file (not an inline script) to satisfy the
 * repo's no-`dangerouslySetInnerHTML` rule while staying within the CSP
 * (`script-src 'self'`). The theme id list mirrors `config/theme.ts` — keep
 * them in sync; it's four strings.
 */
(function () {
  try {
    var THEMES = ["emerald", "sapphire", "amber", "slate"];
    var root = document.documentElement;

    var theme = localStorage.getItem("appearance:theme");
    if (theme && THEMES.indexOf(theme) !== -1) {
      root.setAttribute("data-theme", theme);
    } else {
      root.setAttribute("data-theme", "emerald");
    }

    var density = localStorage.getItem("appearance:density");
    if (density === "compact") {
      root.setAttribute("data-density", "compact");
    } else {
      root.removeAttribute("data-density");
    }
  } catch {
    /* localStorage blocked (private mode, etc.) — fall through to defaults. */
  }
})();
