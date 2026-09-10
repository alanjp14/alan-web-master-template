"use client";

import {
  DollarSignIcon,
  GaugeIcon,
  PercentIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";

import type { Stat } from "@app/shared";

import {
  BarList,
  DashboardCard,
  ErrorState,
  Sparkline,
  StatCard,
} from "@/components/dashboard";
import { useActivity, useStats } from "@/features/metrics/hooks/use-metrics";

const STAT_ICONS: Record<string, LucideIcon> = {
  revenue: DollarSignIcon,
  "active-users": UsersIcon,
  conversion: PercentIcon,
  uptime: GaugeIcon,
};

/**
 * The dashboard's one data-backed panel: headline stats and an activity
 * breakdown fetched from the Bun API (`@app/api`) through React Query. Every
 * other widget on `/dashboard` uses static demo data — this is the pattern to
 * copy when wiring a real screen.
 */
export function LiveMetrics() {
  const stats = useStats();
  const activity = useActivity();

  if (stats.isError) {
    return (
      <ErrorState
        title="Couldn't load metrics"
        description={stats.error.message}
        onRetry={() => void stats.refetch()}
      />
    );
  }

  const placeholders: Stat[] = ["revenue", "active-users", "conversion", "uptime"].map(
    (id) => ({ id, label: "", value: "", delta: 0, trend: "flat" }),
  );
  const cards: Stat[] = stats.data ?? placeholders;
  const showSkeleton = stats.isLoading;

  return (
    <div className="@container space-y-4">
      <div className="grid grid-cols-1 gap-4 @lg:grid-cols-2 @[68rem]:grid-cols-4">
        {cards.map((stat) => (
          <StatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            icon={STAT_ICONS[stat.id]}
            isLoading={showSkeleton}
            trend={
              stat.trend === "flat"
                ? undefined
                : { value: stat.delta, label: "vs last period" }
            }
            description={stat.trend === "flat" ? "no change" : undefined}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 @3xl:grid-cols-2">
        <DashboardCard
          title="Activity"
          description="Sessions over the last ten periods"
          isLoading={activity.isLoading}
          error={activity.error ?? undefined}
          onRetry={() => void activity.refetch()}
        >
          {activity.data ? (
            <Sparkline
              data={activity.data.sparkline}
              label="Sessions trending up over ten periods"
              className="h-24 w-full"
            />
          ) : null}
        </DashboardCard>

        <DashboardCard
          title="Top sources"
          description="Where this period's traffic came from"
          isLoading={activity.isLoading}
          error={activity.error ?? undefined}
          onRetry={() => void activity.refetch()}
        >
          {activity.data ? <BarList data={activity.data.breakdown} /> : null}
        </DashboardCard>
      </div>
    </div>
  );
}
