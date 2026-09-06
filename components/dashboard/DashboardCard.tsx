import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState, type EmptyStateProps } from "@/components/dashboard/EmptyState";
import { ErrorState } from "@/components/dashboard/ErrorState";
import { LoadingState } from "@/components/dashboard/LoadingState";

function messageOf(error: unknown): string | undefined {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return undefined;
}

export interface DashboardCardProps {
  title?: ReactNode;
  description?: ReactNode;
  icon?: LucideIcon;
  /** Header-right slot — a button, dropdown menu, or badge. */
  actions?: ReactNode;
  footer?: ReactNode;
  /** Required unless `isLoading`, `error`, or `isEmpty` supplies the content instead. */
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  size?: "default" | "sm";
  /** Shows `LoadingState` in place of `children`. Checked before `error` and `isEmpty`. */
  isLoading?: boolean;
  /** Shows `ErrorState` in place of `children`. An `Error` supplies its own description. */
  error?: unknown;
  onRetry?: () => void;
  /** Shows `EmptyState` in place of `children` once loading and error are ruled out. */
  isEmpty?: boolean;
  emptyState?: Omit<EmptyStateProps, "className">;
}

/**
 * General-purpose widget shell: header (icon, title, description, actions),
 * a content region, and an optional footer — built entirely from shadcn's
 * `Card` parts.
 *
 * Handles the loading / error / empty / content branching a data widget
 * needs, in that precedence, so callers pass state instead of hand-rolling
 * the conditional each time.
 */
export function DashboardCard({
  title,
  description,
  icon: Icon,
  actions,
  footer,
  children,
  className,
  contentClassName,
  size = "default",
  isLoading = false,
  error,
  onRetry,
  isEmpty = false,
  emptyState,
}: DashboardCardProps) {
  const hasHeader = Boolean(title || description || actions || Icon);

  let body: ReactNode = children;
  if (isLoading) {
    body = <LoadingState />;
  } else if (error) {
    body = <ErrorState description={messageOf(error)} onRetry={onRetry} />;
  } else if (isEmpty) {
    body = <EmptyState {...emptyState} />;
  }

  return (
    <Card size={size} className={className}>
      {hasHeader && (
        <CardHeader>
          {title && (
            <CardTitle as="h3" className="flex items-center gap-2">
              {Icon && (
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
              )}
              <span className="min-w-0 truncate">{title}</span>
            </CardTitle>
          )}
          {description && <CardDescription>{description}</CardDescription>}
          {actions && <CardAction>{actions}</CardAction>}
        </CardHeader>
      )}

      <CardContent className={contentClassName}>{body}</CardContent>

      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
