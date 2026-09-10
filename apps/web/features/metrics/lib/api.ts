import type { Activity, Stat } from "@app/shared";

import { apiFetch } from "@/lib/api-client";

/** Fetchers for the dashboard metrics, one per `@app/api` endpoint. */

export function fetchStats(): Promise<Stat[]> {
  return apiFetch<Stat[]>("stats");
}

export function fetchActivity(): Promise<Activity> {
  return apiFetch<Activity>("activity");
}
