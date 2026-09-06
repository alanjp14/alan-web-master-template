import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { CircleAlertIcon, RefreshCwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StateMessage } from "@/components/dashboard/StateMessage";

export interface ErrorStateProps {
  icon?: LucideIcon;
  title?: ReactNode;
  description?: ReactNode;
  /** Renders a "Try again" button that calls this. Omit if there's no retry. */
  onRetry?: () => void;
  retryLabel?: string;
  /** Extra action rendered alongside (or instead of) the retry button. */
  action?: ReactNode;
  className?: string;
}

/**
 * Placeholder for a widget or page that failed to load.
 *
 * `onRetry` only makes sense once something client-side owns the fetch (a
 * server-rendered page has no retry concept of its own) — pass it from a
 * Client Component the same way `DashboardCard`'s `actions` slot works.
 */
export function ErrorState({
  icon = CircleAlertIcon,
  title = "Something went wrong",
  description = "We couldn't load this data. Please try again.",
  onRetry,
  retryLabel = "Try again",
  action,
  className,
}: ErrorStateProps) {
  const hasAction = Boolean(onRetry || action);

  return (
    <StateMessage
      icon={icon}
      tone="destructive"
      title={title}
      description={description}
      className={className}
      action={
        hasAction ? (
          <>
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry}>
                <RefreshCwIcon aria-hidden="true" />
                {retryLabel}
              </Button>
            )}
            {action}
          </>
        ) : undefined
      }
    />
  );
}
