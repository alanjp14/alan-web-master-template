import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { InboxIcon } from "lucide-react";

import { StateMessage } from "@/components/dashboard/StateMessage";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title?: ReactNode;
  description?: ReactNode;
  /** Typically a `Button`, e.g. "Create your first project". */
  action?: ReactNode;
  className?: string;
}

/**
 * Placeholder for a widget or page with nothing to show yet.
 *
 * Drop into `DashboardCard`'s content area, a table body, or any content
 * region — it doesn't assume a container of its own.
 */
export function EmptyState({
  icon = InboxIcon,
  title = "No data yet",
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <StateMessage
      icon={icon}
      tone="muted"
      title={title}
      description={description}
      action={action}
      className={className}
    />
  );
}
