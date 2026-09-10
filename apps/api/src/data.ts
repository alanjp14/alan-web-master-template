import type { Activity, Stat } from "@app/shared";

/**
 * In-memory sample data. This template ships no database — swap these
 * functions for real queries (Drizzle, Prisma, a fetch to an upstream
 * service) and the route handlers and web app stay unchanged, because the
 * return types come from `@app/shared`.
 */

export function getStats(): Stat[] {
  return [
    { id: "revenue", label: "Revenue", value: "$48,290", delta: 12.4, trend: "up" },
    { id: "active-users", label: "Active users", value: "2,318", delta: -3.1, trend: "down" },
    { id: "conversion", label: "Conversion rate", value: "3.6%", delta: 0.4, trend: "up" },
    { id: "uptime", label: "Uptime", value: "99.98%", delta: 0, trend: "flat" },
  ];
}

export function getActivity(): Activity {
  return {
    sparkline: [31, 33, 32, 36, 38, 37, 41, 44, 43, 48],
    breakdown: [
      { label: "Organic search", value: 4820 },
      { label: "Direct", value: 3110 },
      { label: "Referral", value: 1980 },
      { label: "Social", value: 1240 },
      { label: "Email", value: 640 },
    ],
  };
}
