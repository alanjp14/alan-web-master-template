import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "cn";

export interface SectionHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: LucideIcon;
  /** Buttons or other controls, right-aligned on wide screens. */
  actions?: ReactNode;
  /** Heading level. Default `h2` — use `h3` when nesting under another SectionHeader's h2. */
  as?: "h2" | "h3";
  className?: string;
}

/**
 * Heading for a section *within* a page — "Recent activity" above a table,
 * "Team members" above a list — repeatable multiple times per page.
 *
 * For the page's own title, use `PageContainer`'s `title` prop instead; that
 * renders the page's single `h1`, one size up from this.
 */
export function SectionHeader({
  title,
  description,
  icon: Icon,
  actions,
  as: Heading = "h2",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-4" aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0 space-y-0.5">
          <Heading className="truncate text-lg font-semibold tracking-tight text-foreground">
            {title}
          </Heading>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
