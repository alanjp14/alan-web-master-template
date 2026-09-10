/** Application identity. Update these when you fork the template. */
export interface AppConfig {
  /** Product name — sidebar brand, header, and the metadata title template. */
  name: string;
  /** One-line description — the default `<meta name="description">`. */
  description: string;
  /** Semantic version. Keep in sync with `package.json`. */
  version: string;
}

// `satisfies` checks the shape without widening the literal types, so
// `APP_CONFIG.name` stays a string literal for anything that wants it.
export const APP_CONFIG = {
  name: "Alan Web Master Template",
  description: "Enterprise Web Application Template",
  version: "0.1.0",
} as const satisfies AppConfig;
