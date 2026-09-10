/**
 * `metrics` — the dashboard's data-backed panel. Public surface only; import
 * from here, not from the files inside.
 */
export { LiveMetrics } from "./components/LiveMetrics";
export { useActivity, useStats, metricsKeys } from "./hooks/use-metrics";
export { fetchActivity, fetchStats } from "./lib/api";
