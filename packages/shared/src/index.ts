/**
 * Types shared by the Next.js web app (`@app/web`) and the Bun API
 * (`@app/api`). Keeping the request/response shapes in one place is what
 * makes the boundary between the two apps typed end to end: the API returns
 * these, the web app's fetch helpers consume these, and a change to a shape
 * fails `typecheck` on both sides at once.
 */

export * from "./api";
export * from "./tools";

/** Direction of a metric's period-over-period change. */
export type Trend = "up" | "down" | "flat";

/** One headline number on the dashboard (`StatCard`). */
export interface Stat {
  id: string;
  label: string;
  /** Pre-formatted display value, e.g. `"$48,120"` or `"1,204"`. */
  value: string;
  /** Signed percentage change vs. the previous period, e.g. `+12.5`. */
  delta: number;
  trend: Trend;
}

/** A labelled slice for the `BarList` breakdown widget. */
export interface BreakdownItem {
  label: string;
  value: number;
}

/** Payload for the dashboard's activity panel (`Sparkline` + `BarList`). */
export interface Activity {
  /** Evenly-spaced samples, oldest first — feeds `Sparkline`. */
  sparkline: number[];
  /** Top sources for the period — feeds `BarList`. */
  breakdown: BreakdownItem[];
}

/** `GET /api/v1/me` response — the signed-in user, trimmed to what the UI needs. */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

/** `GET /api/v1/health` response. */
export interface Health {
  status: "ok";
  /** Seconds the API process has been running. */
  uptime: number;
  /** ISO-8601 timestamp the response was produced. */
  timestamp: string;
  version: string;
}

/** Uniform error body for every non-2xx API response. */
export interface ApiError {
  error: {
    message: string;
    /** Machine-readable code, e.g. `"not_found"`, `"internal"`. */
    code: string;
  };
}
