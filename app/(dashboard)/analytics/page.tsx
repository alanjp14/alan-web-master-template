import type { Metadata } from "next";
import {
  DollarSignIcon,
  Globe2Icon,
  MousePointerClickIcon,
  TimerIcon,
  UsersIcon,
} from "lucide-react";

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

export const metadata: Metadata = {
  title: "Analytics",
  description: "Traffic, engagement and conversion — design system showcase.",
};

const visitors = [1180, 1240, 1210, 1360, 1290, 1440, 1510, 1470, 1620, 1780];
const revenue = [8.2, 8.0, 8.6, 9.1, 8.8, 9.4, 9.9, 10.2, 10.0, 10.7];
const bounce = [46, 44, 45, 43, 44, 41, 40, 41, 39, 37];

const topPages = [
  { label: "/dashboard", value: 8240, href: "/dashboard" },
  { label: "/pricing", value: 5110 },
  { label: "/blog/launch-week", value: 3870 },
  { label: "/docs/getting-started", value: 2960 },
  { label: "/changelog", value: 1780 },
];

const sources = [
  { label: "Organic search", value: 42 },
  { label: "Direct", value: 27 },
  { label: "Referral", value: 18 },
  { label: "Social", value: 9 },
  { label: "Email", value: 4 },
];

export default function AnalyticsPage() {
  return (
    <PageContainer
      title="Analytics"
      description="Traffic, engagement and conversion for the current period."
      breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Analytics" }]}
      size="lg"
    >
      <div className="@container space-y-10">
        <section className="space-y-4">
          <SectionHeader
            title="Trends"
            description="Ten-week movement for the headline metrics."
          />
          <StaggerContainer className="grid grid-cols-1 gap-4 @lg:grid-cols-2 @[68rem]:grid-cols-4">
            <SlideIn>
              <StatCard
                label="Visitors"
                value="1,780"
                icon={UsersIcon}
                trend={{ value: 9.9, label: "vs last week" }}
                chart={<Sparkline data={visitors} label="Visitors trending up over ten weeks" />}
              />
            </SlideIn>
            <SlideIn>
              <StatCard
                label="Revenue"
                value="$10.7K"
                icon={DollarSignIcon}
                trend={{ value: 7.0, label: "vs last week" }}
                chart={<Sparkline data={revenue} color={1} label="Revenue trending up over ten weeks" />}
              />
            </SlideIn>
            <SlideIn>
              <StatCard
                label="Bounce rate"
                value="37%"
                icon={MousePointerClickIcon}
                trend={{ value: -5.1, label: "vs last week" }}
                description="Lower is better"
                chart={<Sparkline data={bounce} label="Bounce rate trending down over ten weeks" />}
              />
            </SlideIn>
            <SlideIn>
              <StatCard
                label="Avg. session"
                value="4m 12s"
                icon={TimerIcon}
                trend={{ value: 2.4, label: "vs last week" }}
              />
            </SlideIn>
          </StaggerContainer>
        </section>

        <section className="grid grid-cols-1 gap-4 @3xl:grid-cols-2">
          <FadeIn>
            <DashboardCard
              title="Top pages"
              description="Page views this period"
              icon={Globe2Icon}
            >
              <BarList data={topPages} />
            </DashboardCard>
          </FadeIn>
          <FadeIn>
            <DashboardCard
              title="Traffic sources"
              description="Share of sessions by channel"
            >
              <BarList
                data={sources}
                formatValue={(value) => `${value}%`}
              />
            </DashboardCard>
          </FadeIn>
        </section>

        <section className="space-y-4">
          <SectionHeader
            title="Capacity"
            description="Consumption against plan limits."
          />
          <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FadeIn>
              <MetricCard
                label="Events ingested"
                value="612K"
                icon={MousePointerClickIcon}
                progress={{
                  value: 612000,
                  max: 1000000,
                  label: "612K of 1M this month",
                }}
              />
            </FadeIn>
            <FadeIn>
              <MetricCard
                label="Seats used"
                value="18 / 25"
                icon={UsersIcon}
                trend={{ value: 12.5, label: "vs last month" }}
                progress={{ value: 18, max: 25, label: "18 of 25 seats" }}
              />
            </FadeIn>
          </StaggerContainer>
        </section>
      </div>
    </PageContainer>
  );
}
