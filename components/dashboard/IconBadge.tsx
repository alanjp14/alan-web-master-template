import type { LucideIcon } from "lucide-react";
import { cn } from "cn";

export interface IconBadgeProps {
  icon: LucideIcon;
  /**
   * Box size. `sm` (32px) matches `StatCard`/`MetricCard`/`DashboardCard`'s
   * inline tiles; `default` (36px) is `SectionHeader`'s slightly larger one.
   */
  size?: "sm" | "default";
  className?: string;
}

/**
 * Small rounded icon tile in the brand tint — the "icon in a colored box"
 * treatment shared by `StatCard`, `MetricCard`, `DashboardCard` and
 * `SectionHeader`. Pulled out once the same markup showed up verbatim in all
 * four.
 */
export function IconBadge({ icon: Icon, size = "sm", className }: IconBadgeProps) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-lg bg-primary/10 text-primary",
        size === "default" ? "size-9" : "size-8",
        className
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
    </span>
  );
}
