import type { Metadata } from "next";
import Link from "next/link";
import {
  ActivityIcon,
  ArrowRightIcon,
  DatabaseIcon,
  DollarSignIcon,
  LayoutTemplateIcon,
  UsersIcon,
} from "lucide-react";

import {
  BarList,
  DashboardCard,
  IconBadge,
  MetricCard,
  SectionHeader,
  Sparkline,
  StatCard,
  TrendIndicator,
} from "@/components/dashboard";
import { PageContainer } from "@/components/layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  InteractivePrimitives,
  MotionShowcase,
  ThemePicker,
} from "./showcase-controls";

export const metadata: Metadata = {
  title: "Showcase",
  description:
    "Every theme, token, primitive and pattern in the template, on one page.",
};

const colorTokens = [
  { name: "background", className: "bg-background" },
  { name: "foreground", className: "bg-foreground" },
  { name: "card", className: "bg-card" },
  { name: "primary", className: "bg-primary" },
  { name: "secondary", className: "bg-secondary" },
  { name: "muted", className: "bg-muted" },
  { name: "accent", className: "bg-accent" },
  { name: "destructive", className: "bg-destructive" },
  { name: "border", className: "bg-border" },
  { name: "ring", className: "bg-ring" },
] as const;

// Literal class strings so Tailwind's scanner picks them up.
const chartTokens = [
  { name: "chart-1", className: "bg-chart-1" },
  { name: "chart-2", className: "bg-chart-2" },
  { name: "chart-3", className: "bg-chart-3" },
  { name: "chart-4", className: "bg-chart-4" },
  { name: "chart-5", className: "bg-chart-5" },
] as const;

const radii = [
  { name: "sm", className: "rounded-sm" },
  { name: "md", className: "rounded-md" },
  { name: "lg", className: "rounded-lg" },
  { name: "xl", className: "rounded-xl" },
  { name: "2xl", className: "rounded-2xl" },
] as const;

const buttonVariants = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const;

const badgeVariants = [
  "default",
  "secondary",
  "outline",
  "destructive",
  "ghost",
] as const;

const cardVariantList = ["default", "elevated", "outlined", "flat"] as const;

const trend = [12, 14, 13, 17, 16, 19, 22, 21, 25, 28];

const layouts = [
  {
    title: "Marketing",
    description: "Full-bleed header + footer shell. Landing, pricing, changelog.",
    href: "/",
  },
  {
    title: "Pricing",
    description: "A second page on the same MarketingLayout — proof it's reusable.",
    href: "/pricing",
  },
  {
    title: "Auth",
    description: "Centered card with optional split panel. Sign in / up / reset.",
    href: "/sign-in",
  },
  {
    title: "Top-nav workspace",
    description: "Horizontal-nav app shell — the alternative to the sidebar.",
    href: "/workspace",
  },
  {
    title: "Sidebar dashboard",
    description: "The shell you're in now — collapsible rail, mobile drawer.",
    href: "/dashboard",
  },
] as const;

function Swatch({
  name,
  className,
}: {
  name: string;
  className: string;
}) {
  return (
    <div className="space-y-1.5">
      <div
        className={`h-14 w-full rounded-lg ring-1 ring-foreground/10 ${className}`}
      />
      <p className="font-mono text-xs text-muted-foreground">{name}</p>
    </div>
  );
}

/**
 * The design-system showroom — one page that renders every theme, token,
 * primitive and dashboard pattern. Switch themes from the picker at the top
 * (or the header palette menu) and everything below re-renders live.
 *
 * Static content; safe to delete once you've built real screens, or keep it
 * as an internal reference / client-facing "pick a direction" page.
 */
export default function ShowcasePage() {
  return (
    <PageContainer
      title="Component showcase"
      description="Every theme, token and pattern in the template, on one page."
      size="lg"
    >
      <div className="space-y-14">
        <section className="space-y-4">
          <SectionHeader
            title="Brand theme & density"
            description="Four looks on one token system. Your choice persists and syncs across tabs."
          />
          <ThemePicker />
        </section>

        <section className="space-y-4">
          <SectionHeader title="Color tokens" as="h2" />
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-10">
            {colorTokens.map((token) => (
              <Swatch
                key={token.name}
                name={token.name}
                className={token.className}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
            {chartTokens.map((token) => (
              <Swatch
                key={token.name}
                name={token.name}
                className={token.className}
              />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader
            title="Typography & radius"
            description="Amber swaps in a serif for headings; Slate and Sapphire tighten the corner radius."
          />
          <Card>
            <CardContent className="space-y-3">
              <p className="font-heading text-3xl font-semibold tracking-tight">
                Heading, display size
              </p>
              <p className="font-heading text-xl font-medium">
                Heading, section size
              </p>
              <p className="text-base">
                Body copy — the quick brown fox jumps over the lazy dog.
              </p>
              <p className="text-sm text-muted-foreground">
                Muted small print, for captions and helper text.
              </p>
              <p className="font-mono text-sm">
                const monospace = &quot;for code&quot;;
              </p>
            </CardContent>
          </Card>
          <div className="flex flex-wrap gap-4">
            {radii.map((radius) => (
              <div key={radius.name} className="space-y-1.5">
                <div
                  className={`size-16 bg-primary/15 ring-1 ring-primary/30 ${radius.className}`}
                />
                <p className="font-mono text-xs text-muted-foreground">
                  {radius.name}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader title="Buttons" as="h2" />
          <div className="flex flex-wrap gap-3">
            {buttonVariants.map((variant) => (
              <Button key={variant} variant={variant}>
                {variant}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="xs">xs</Button>
            <Button size="sm">sm</Button>
            <Button size="default">default</Button>
            <Button size="lg">lg</Button>
            <Button disabled>disabled</Button>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader title="Badges" as="h2" />
          <div className="flex flex-wrap gap-3">
            {badgeVariants.map((variant) => (
              <Badge key={variant} variant={variant}>
                {variant}
              </Badge>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader
            title="Form & interactive primitives"
            description="Base UI under the hood — uncontrolled here, wire to Server Actions in an app."
          />
          <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
            <div className="max-w-sm space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="showcase-input">Email</Label>
                <Input
                  id="showcase-input"
                  type="email"
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="showcase-invalid">With error</Label>
                <Input id="showcase-invalid" aria-invalid defaultValue="nope" />
                <p className="text-sm font-medium text-destructive">
                  That doesn&apos;t look right.
                </p>
              </div>
            </div>
          </div>
          <InteractivePrimitives />
        </section>

        <section className="space-y-4">
          <SectionHeader title="Feedback" as="h2" />
          <div className="grid gap-4 md:grid-cols-2">
            <Alert>
              <ActivityIcon />
              <AlertTitle>Heads up</AlertTitle>
              <AlertDescription>
                A neutral alert for informational messages.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <ActivityIcon />
              <AlertTitle>Something failed</AlertTitle>
              <AlertDescription>
                A destructive alert for errors that need attention.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader title="Card variants" as="h2" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cardVariantList.map((variant) => (
              <Card key={variant} variant={variant}>
                <CardContent className="space-y-1">
                  <p className="font-medium capitalize">{variant}</p>
                  <p className="text-sm text-muted-foreground">
                    Surface treatment via the <code>variant</code> prop.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader
            title="Dashboard components"
            description="The data-display building blocks, with their loading / error / empty states."
          />
          <div className="grid gap-4 @lg:grid-cols-2 @[68rem]:grid-cols-4">
            <StatCard
              label="Revenue"
              value="$48,290"
              icon={DollarSignIcon}
              trend={{ value: 12.4, label: "vs last month" }}
              chart={<Sparkline data={trend} label="Revenue trending up" />}
            />
            <StatCard
              label="Active users"
              value="2,318"
              icon={UsersIcon}
              trend={{ value: -3.1 }}
            />
            <StatCard label="Loading" value="—" icon={ActivityIcon} isLoading />
            <MetricCard
              label="Storage"
              value={72}
              unit="GB"
              icon={DatabaseIcon}
              progress={{ value: 72, max: 100, label: "72 of 100 GB" }}
            />
          </div>
          <div className="grid gap-4 @lg:grid-cols-3">
            <DashboardCard title="Ready" description="Normal content state">
              <p className="text-sm text-muted-foreground">
                A widget with content.
              </p>
            </DashboardCard>
            <DashboardCard
              title="Error"
              error="The reporting service is unavailable."
            />
            <DashboardCard
              title="Empty"
              isEmpty
              emptyState={{ title: "Nothing here yet" }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <TrendIndicator trend={{ value: 8.1, label: "up" }} />
            <TrendIndicator trend={{ value: -2.4, label: "down" }} />
            <TrendIndicator trend={{ value: 0 }} />
            <IconBadge icon={ActivityIcon} />
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader title="Data visualization" as="h2" />
          <div className="grid gap-4 @2xl:grid-cols-2">
            <DashboardCard title="Sparkline" description="line / area, auto color">
              <div className="space-y-3">
                <Sparkline data={trend} variant="line" label="Line sparkline" />
                <Sparkline data={trend} variant="area" label="Area sparkline" />
                <Sparkline
                  data={[...trend].reverse()}
                  label="Falling sparkline"
                />
              </div>
            </DashboardCard>
            <DashboardCard title="BarList" description="ranked horizontal bars">
              <BarList
                data={[
                  { label: "Organic search", value: 4820 },
                  { label: "Direct", value: 3110 },
                  { label: "Referral", value: 1980 },
                  { label: "Social", value: 1240 },
                ]}
              />
            </DashboardCard>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader title="Table & avatar" as="h2" />
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Usage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: "Amara Osei", role: "Admin", usage: "82%" },
                    { name: "Diego Ramirez", role: "Member", usage: "44%" },
                    { name: "Priya Nair", role: "Member", usage: "13%" },
                  ].map((row) => (
                    <TableRow key={row.name}>
                      <TableCell className="flex items-center gap-2.5 font-medium">
                        <Avatar size="sm">
                          <AvatarFallback>
                            {row.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {row.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{row.role}</Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {row.usage}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <SectionHeader
            title="Motion"
            description="Reveal primitives on the motion library, reduced-motion aware."
          />
          <MotionShowcase />
        </section>

        <section className="space-y-4">
          <SectionHeader
            title="Layout archetypes"
            description="The shells this template ships. Each link opens the real thing."
            icon={LayoutTemplateIcon}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {layouts.map((layout) => (
              <Card key={layout.href} variant="outlined" interactive>
                <CardContent>
                  <Link
                    href={layout.href}
                    className="flex flex-col gap-1.5 outline-none"
                  >
                    <span className="flex items-center justify-between font-medium">
                      {layout.title}
                      <ArrowRightIcon
                        className="size-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {layout.description}
                    </span>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
