"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchActivity, fetchStats } from "@/features/metrics/lib/api";

/**
 * React Query hooks over the Bun API. `staleTime` keeps the dashboard from
 * refetching on every mount during a session; tune per real data volatility.
 */

export const metricsKeys = {
  all: ["metrics"] as const,
  stats: () => [...metricsKeys.all, "stats"] as const,
  activity: () => [...metricsKeys.all, "activity"] as const,
};

export function useStats() {
  return useQuery({
    queryKey: metricsKeys.stats(),
    queryFn: fetchStats,
    staleTime: 30_000,
  });
}

export function useActivity() {
  return useQuery({
    queryKey: metricsKeys.activity(),
    queryFn: fetchActivity,
    staleTime: 30_000,
  });
}
