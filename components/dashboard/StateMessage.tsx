import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "cn";

export interface StateMessageProps {
  icon?: LucideIcon;
  tone?: "muted" | "destructive";
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/**
 * Centered icon/title/description/action block.
 *
 * Shared layout behind `EmptyState` and `ErrorState` so both read as the same
 * visual language wherever they appear — inside a `DashboardCard`, a table
 * body, or a full page. Not one of the top-level design-system exports; use
 * `EmptyState` or `ErrorState` unless neither tone fits.
 */
export function StateMessage({
  icon: Icon,
  tone = "muted",
  title,
  description,
  action,
  className,
}: StateMessageProps) {
  return (
    <div
      role={tone === "destructive" ? "alert" : undefined}
      className={cn(
        "flex flex-col items-center gap-3 px-6 py-10 text-center",
        className
      )}
    >
      {Icon && (
        <span
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-full",
            tone === "destructive"
              ? "bg-destructive/10 text-destructive"
              : "bg-muted text-muted-foreground"
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
      )}
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          {action}
        </div>
      )}
    </div>
  );
}
