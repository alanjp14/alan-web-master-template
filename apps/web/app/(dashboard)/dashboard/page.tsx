import type { Metadata } from "next";
import {
  ActivityIcon,
  ClipboardListIcon,
  DatabaseIcon,
  DollarSignIcon,
  PercentIcon,
  ServerIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";

import {
  BarList,
  DashboardCard,
  MetricCard,
  SectionHeader,
  Sparkline,
  StatCard,
  TiltCard3D,
  AnimatedCounter,
  LivePulseRadar,
} from "@/components/dashboard";
import { ServerRack3D } from "@/components/3d";
import { PageContainer } from "@/components/layout";
import { FadeIn, SlideIn, StaggerContainer } from "@/components/motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LiveMetrics } from "@/features/metrics";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Design system showcase for the dashboard components.",
};

const recentSignups = [
  { name: "Amara Osei", role: "Admin" },
  { name: "Diego Ramirez", role: "Member" },
  { name: "Priya Nair", role: "Member" },
];

const revenueTrend = [31, 33, 32, 36, 38, 37, 41, 44, 43, 48];
const usersTrend = [2510, 2480, 2440, 2460, 2410, 2390, 2360, 2340, 2330, 2318];

const trafficSources = [
  { label: "Organic search", value: 4820 },
  { label: "Direct", value: 3110 },
  { label: "Referral", value: 1980 },
  { label: "Social", value: 1240 },
  { label: "Email", value: 640 },
];

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

/**
 * Design-system showcase for the dashboard components in
 * `components/dashboard/`. Values below are static placeholders, not wired to
 * a data source — replace this page's content when building a real screen.
 */
export default function DashboardPage() {
  return (
    <PageContainer
      title="Dashboard"
      description="Design system showcase — replace with real page content."
      size="lg"
    >
      {/* `@container` lets the grids below respond to the space actually left
          by the sidebar, not just the viewport — a fixed `lg:` breakpoint
          can't tell a collapsed sidebar from an expanded one. */}
      <div className="@container space-y-10">
        <section className="space-y-4">
          <SectionHeader
            title="Live data"
            description="Fetched from the Bun API (@app/api) via React Query — every other widget on this page uses static demo data."
            icon={ActivityIcon}
          />
          <LiveMetrics />
        </section>

        {/* 3D Infrastructure Status & Interactive KPI Section */}
        <section className="space-y-4">
          <SectionHeader
            title="3D Infrastructure & Animated KPI"
            description="Interactive 3D tilt cards, real-time animated counters, and 3D isometric cluster visualizer."
            icon={ServerIcon}
          />
          <div className="grid grid-cols-1 gap-4 @lg:grid-cols-2 @[68rem]:grid-cols-4">
            <TiltCard3D>
              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">
                    Cluster Throughput
                  </span>
                  <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <ActivityIcon className="size-4" />
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  <AnimatedCounter value={12450} suffix=" req/s" />
                </div>
                <p className="text-xs text-muted-foreground">Bun.js High-Concurrency Engine</p>
              </div>
            </TiltCard3D>

            <TiltCard3D>
              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">
                    Core API Latency
                  </span>
                  <span className="grid size-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500">
                    <ZapIcon className="size-4" />
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  <AnimatedCounter value={11.8} decimals={1} suffix=" ms" />
                </div>
                <p className="text-xs text-muted-foreground">p99 response time</p>
              </div>
            </TiltCard3D>

            <TiltCard3D>
              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">
                    Active Cloud Nodes
                  </span>
                  <span className="grid size-8 place-items-center rounded-lg bg-blue-500/10 text-blue-500">
                    <ServerIcon className="size-4" />
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  <AnimatedCounter value={24} suffix=" Nodes" />
                </div>
                <p className="text-xs text-muted-foreground">Kubernetes Cluster Online</p>
              </div>
            </TiltCard3D>

            <TiltCard3D>
              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">
                    System Health & Security
                  </span>
                  <span className="grid size-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500">
                    <DatabaseIcon className="size-4" />
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  <AnimatedCounter value={100} suffix="%" />
                </div>
                <p className="text-xs text-muted-foreground">Zero vulnerabilities detected</p>
              </div>
            </TiltCard3D>
          </div>

          <div className="grid grid-cols-1 gap-4 @lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-5 @lg:col-span-2 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <ServerIcon className="size-4 text-primary" />
                    3D Cluster Rack Visualizer
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Live isometric server status with real-time I/O activity LEDs & 3D mouse tilt.
                  </p>
                </div>
                <Badge variant="outline" className="text-xs text-emerald-500 border-emerald-500/30">
                  All Systems Operational
                </Badge>
              </div>
              <div className="h-56 w-full pt-2">
                <ServerRack3D serversCount={5} />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between">
              <div className="border-b border-border/60 pb-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <ActivityIcon className="size-4 text-emerald-500" />
                  Live Security & Packet Radar
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  360-degree real-time network anomaly scanner.
                </p>
              </div>
              <div className="h-44 w-full my-auto">
                <LivePulseRadar />
              </div>
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                <span>0 Anomalies Detected</span>
                <span className="font-mono text-emerald-500 font-medium">SCAN ACTIVE</span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader
            title="Overview"
            description="Key metrics for the current period."
            icon={ActivityIcon}
            actions={
              <Button variant="outline" size="sm">
                Export
              </Button>
            }
          />
          <StaggerContainer className="grid grid-cols-1 gap-4 @lg:grid-cols-2 @[68rem]:grid-cols-4">
            <SlideIn>
              <StatCard
                label="Revenue"
                value="$48,290"
                icon={DollarSignIcon}
                trend={{ value: 12.4, label: "vs last month" }}
                chart={
                  <Sparkline
                    data={revenueTrend}
                    label="Revenue trending up over ten months"
                  />
                }
              />
            </SlideIn>
            <SlideIn>
              <StatCard
                label="Active users"
                value="2,318"
                icon={UsersIcon}
                trend={{ value: -3.1, label: "vs last month" }}
                chart={
                  <Sparkline
                    data={usersTrend}
                    label="Active users trending down over ten months"
                  />
                }
              />
            </SlideIn>
            <SlideIn>
              <StatCard
                label="Conversion rate"
                value="4.6%"
                icon={PercentIcon}
                trend={{ value: 0 }}
                description="Stable this week"
              />
            </SlideIn>
            <SlideIn>
              <StatCard
                label="Avg. session"
                value="6m 42s"
                icon={ActivityIcon}
                isLoading
              />
            </SlideIn>
          </StaggerContainer>
        </section>

        <section className="space-y-4">
          <SectionHeader
            title="Resource usage"
            description="Consumption against plan limits."
            icon={ServerIcon}
          />
          <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FadeIn>
              <MetricCard
                label="Storage"
                value={72}
                unit="GB"
                icon={DatabaseIcon}
                trend={{ value: 8.2, label: "vs last week" }}
                progress={{ value: 72, max: 100, label: "72 of 100 GB used" }}
              />
            </FadeIn>
            <FadeIn>
              <MetricCard
                label="API requests"
                value="184K"
                icon={ServerIcon}
                progress={{
                  value: 184000,
                  max: 250000,
                  label: "184K of 250K this month",
                }}
              />
            </FadeIn>
          </StaggerContainer>
        </section>

        <section className="space-y-4">
          <SectionHeader
            title="Breakdowns"
            description="Sparkline and BarList — zero-dependency, server-rendered."
            icon={PercentIcon}
          />
          <div className="grid grid-cols-1 gap-4 @3xl:grid-cols-2">
            <FadeIn>
              <DashboardCard
                title="Traffic sources"
                description="Sessions this month"
              >
                <BarList data={trafficSources} maxItems={5} />
              </DashboardCard>
            </FadeIn>
            <FadeIn>
              <DashboardCard title="Revenue" description="Last ten months">
                <div className="flex h-full flex-col justify-between gap-4">
                  <p className="text-2xl font-semibold tracking-tight">
                    $48,290
                  </p>
                  <Sparkline
                    data={revenueTrend}
                    variant="area"
                    className="h-24"
                    label="Revenue trending up over ten months"
                  />
                </div>
              </DashboardCard>
            </FadeIn>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader
            title="Widget states"
            description="DashboardCard resolves loading, error and empty automatically."
          />
          <div className="grid grid-cols-1 gap-4 @lg:grid-cols-2 @[68rem]:grid-cols-4">
            <DashboardCard
              title="Team activity"
              description="Last 30 days"
              isLoading
            />

            <DashboardCard
              title="Revenue by region"
              description="Failed to load"
              error="The reporting service is unavailable."
            />

            <DashboardCard
              title="Integrations"
              isEmpty
              emptyState={{
                title: "No integrations connected",
                description:
                  "Connect a data source to start seeing metrics here.",
                action: (
                  <Button
                    size="sm"
                    nativeButton={false}
                    render={<Link href="/settings" />}
                  >
                    Go to settings
                  </Button>
                ),
              }}
            />

            <DashboardCard
              title="Recent signups"
              description="Newest members this week"
            >
              <ul className="space-y-3">
                {recentSignups.map((person) => (
                  <li key={person.name} className="flex items-center gap-3">
                    <Avatar size="sm">
                      <AvatarFallback>{initialsOf(person.name)}</AvatarFallback>
                    </Avatar>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                      {person.name}
                    </span>
                    <Badge variant="secondary">{person.role}</Badge>
                  </li>
                ))}
              </ul>
            </DashboardCard>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader
            title="Form states"
            description="Field pairs a label, description and validation message with any input."
            icon={ClipboardListIcon}
          />
          <DashboardCard size="sm" className="max-w-md">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="demo-email">Email</FieldLabel>
                <Input
                  id="demo-email"
                  type="email"
                  defaultValue="alan@example.com"
                />
                <FieldDescription>
                  We&apos;ll only use this to send account notifications.
                </FieldDescription>
              </Field>

              <Field data-invalid="true">
                <FieldLabel htmlFor="demo-password">Password</FieldLabel>
                <Input
                  id="demo-password"
                  type="password"
                  placeholder="••••••••"
                  aria-invalid
                />
                <FieldError>
                  Password must be at least 8 characters.
                </FieldError>
              </Field>
            </FieldGroup>
          </DashboardCard>
        </section>
      </div>
    </PageContainer>
  );
}
