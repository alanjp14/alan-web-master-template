import type { LucideIcon } from "lucide-react";

/**
 * A single navigation destination.
 *
 * `exact` opts an item out of prefix matching, which is required for index
 * routes such as `/` that would otherwise match every pathname.
 */
export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Short counter or status rendered beside the title. */
  badge?: string | number;
  disabled?: boolean;
  exact?: boolean;
}

/** A labelled group of navigation items. Omit `label` for an unlabelled group. */
export interface NavSection {
  label?: string;
  items: NavItem[];
}
