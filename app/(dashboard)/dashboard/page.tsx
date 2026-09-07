import type { Metadata } from "next";
import {
  ActivityIcon,
  ClipboardListIcon,
  DatabaseIcon,
  DollarSignIcon,
  PercentIcon,
  ServerIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";

import {
  BarList,
  DashboardCard,
  MetricCard,
  SectionHeader,
  Sparkline,
  StatCard,
} from "@/components/dashboard";
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
                  defaultValue="1234"
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
