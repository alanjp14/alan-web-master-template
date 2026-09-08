import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  FolderKanbanIcon,
  GitPullRequestIcon,
  UsersIcon,
} from "lucide-react";

import {
  BarList,
  DashboardCard,
  SectionHeader,
  StatCard,
} from "@/components/dashboard";
import { PageContainer } from "@/components/layout";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Workspace",
  description: "Top-nav layout demo — the same components, a different shell.",
};

const openItems = [
  { label: "design-system", value: 12 },
  { label: "web-app", value: 8 },
  { label: "marketing-site", value: 5 },
  { label: "docs", value: 3 },
];

/**
 * Demo page for `TopNavLayout`. Deliberately built from the same
 * `components/dashboard` primitives as `/dashboard` to show the shell is the
 * only thing that changed. Static content.
 */
export default function WorkspacePage() {
  return (
    <PageContainer
      title="Workspace"
      description="A horizontal-nav shell over the same design system."
      actions={
        <Button
          nativeButton={false}
          render={<Link href="/dashboard" />}
          variant="outline"
          size="sm"
        >
          Sidebar version
          <ArrowRightIcon aria-hidden="true" />
        </Button>
      }
    >
      <div className="@container space-y-10">
        <section className="space-y-4">
          <SectionHeader
            title="This week"
            description="Activity across your projects."
          />
          <div className="grid grid-cols-1 gap-4 @lg:grid-cols-3">
            <StatCard
              label="Active projects"
              value="7"
              icon={FolderKanbanIcon}
              trend={{ value: 16.5, label: "vs last week" }}
            />
            <StatCard
              label="Open pull requests"
              value="28"
              icon={GitPullRequestIcon}
              trend={{ value: -4.2, label: "vs last week" }}
            />
            <StatCard
              label="Contributors"
              value="14"
              icon={UsersIcon}
              description="3 joined this month"
            />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 @3xl:grid-cols-2">
          <DashboardCard
            title="Open items by project"
            description="Issues and PRs awaiting review"
          >
            <BarList data={openItems} />
          </DashboardCard>
          <DashboardCard
            title="Get started"
            description="Wire this shell to your routes"
          >
            <p className="text-sm text-muted-foreground">
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                TopNavLayout
              </code>{" "}
              reads the same <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">config/navigation.ts</code>{" "}
              entries as the sidebar shell. Mount it from a route group&apos;s
              layout and compose <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">PageContainer</code>{" "}
              inside, exactly as here.
            </p>
          </DashboardCard>
        </section>
      </div>
    </PageContainer>
  );
}
