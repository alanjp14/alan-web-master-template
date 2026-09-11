import { LayoutDashboard, LineChart, Palette, Settings, Terminal } from "lucide-react";

import type { MarketingLink, NavItem, NavSection } from "@/types/navigation";

/**
 * Sidebar navigation. Every entry here resolves to a real page in this
 * template — swap them for the destinations of the consuming application; the
 * layout renders whatever it is given.
 */
export const mainNavigation: NavSection[] = [
  {
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Analytics",
        href: "/analytics",
        icon: LineChart,
      },
    ],
  },
  {
    label: "Utilitas IT",
    items: [
      {
        title: "Web Tools IT",
        href: "/tools",
        icon: Terminal,
      },
    ],
  },
  {
    label: "Design system",
    items: [
      {
        title: "Showcase",
        href: "/showcase",
        icon: Palette,
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

/**
 * Destinations promoted to the mobile bottom bar.
 *
 * Keep this to four or fewer: `MobileNavigation` appends a "More" control that
 * opens the full sidebar, and five targets is the practical limit before touch
 * targets drop below the 44px accessibility guideline on small handsets.
 */
export const mobileNavigation: NavItem[] = mainNavigation
  .flatMap((section) => section.items)
  .slice(0, 4);

/**
 * Header links for `MarketingLayout`. Point these at real marketing routes
 * when you replace the showcase pages.
 */
export const marketingNavigation: MarketingLink[] = [
  { label: "Layanan IT", href: "/#services" },
  { label: "Portofolio", href: "/#portfolio" },
  { label: "Web Tools IT", href: "/tools" },
  { label: "Harga", href: "/pricing" },
  { label: "Showcase", href: "/showcase" },
];

