import { LineChart, LayoutDashboard, Settings } from "lucide-react";

import type { NavItem, NavSection } from "@/types/navigation";

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
