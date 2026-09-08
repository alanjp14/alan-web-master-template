import type { Metadata } from "next";
import Link from "next/link";
import { CheckIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing — a second page on MarketingLayout.",
};

interface Plan {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

const plans: Plan[] = [
  {
    name: "Starter",
    price: "$0",
    cadence: "forever",
    description: "Everything you need to prototype and ship a first version.",
    features: [
      "Up to 3 team members",
      "Community support",
      "1 project",
      "Basic analytics",
    ],
    cta: "Get started",
  },
  {
    name: "Team",
    price: "$29",
    cadence: "per user / month",
    description: "For teams that need collaboration, roles and real support.",
    features: [
      "Unlimited team members",
      "Priority email support",
      "Unlimited projects",
      "Advanced analytics & export",
      "Audit log",
    ],
    cta: "Start free trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "annual",
    description: "Security review, SSO, and a dedicated point of contact.",
    features: [
      "Everything in Team",
      "SAML / SSO",
      "SLA & uptime guarantee",
      "Dedicated success manager",
      "Custom data residency",
    ],
    cta: "Contact sales",
  },
];

/** Second page on `MarketingLayout` — proof the shell is reusable, not a
 *  one-off around the landing page. Static content. */
export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Pricing that scales with your team
        </h1>
        <p className="mt-4 text-lg text-muted-foreground text-pretty">
          Start free. Upgrade when collaboration, support or compliance needs
          it. Every plan includes the full component library.
        </p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            variant={plan.featured ? "elevated" : "outlined"}
            className={
              plan.featured ? "ring-2 ring-primary/40" : undefined
            }
          >
            <CardHeader className="gap-2">
              <div className="flex items-center gap-2">
                <span className="font-heading text-lg font-medium">
                  {plan.name}
                </span>
                {plan.featured && <Badge>Most popular</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">
                {plan.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="flex items-baseline gap-1.5">
                <span className="text-3xl font-semibold tracking-tight">
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {plan.cadence}
                </span>
              </p>
              <ul className="space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <CheckIcon
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                nativeButton={false}
                render={<Link href="/sign-up" />}
                variant={plan.featured ? "default" : "outline"}
                className="w-full"
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
