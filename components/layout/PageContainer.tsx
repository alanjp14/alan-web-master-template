import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { cn } from "cn";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const sizeClasses = {
  sm: "max-w-3xl",
  default: "max-w-7xl",
  lg: "max-w-[96rem]",
  full: "max-w-none",
} as const;

export interface PageCrumb {
  label: string;
  /** Omit on the current page, or on any non-navigable ancestor. */
  href?: string;
}

export interface PageContainerProps {
  children: ReactNode;
  /** Rendered as the page's `h1`. Omit for pages that supply their own heading. */
  title?: string;
  /** Supporting copy beneath the title. */
  description?: string;
  /**
   * Trail rendered above the title. The last entry, and any entry without an
   * `href`, renders as static text rather than a link.
   */
  breadcrumbs?: PageCrumb[];
  /** Page-level controls, aligned opposite the title. */
  actions?: ReactNode;
  /** Content width. `full` opts out of the max-width for edge-to-edge pages. */
  size?: keyof typeof sizeClasses;
  className?: string;
}

/**
 * Content region for a page inside `DashboardLayout`.
 *
 * Owns the responsive gutters, the max content width and the optional page
 * heading (breadcrumbs, title, description, actions), so pages describe what
 * they contain rather than how it is measured.
 */
export function PageContainer({
  children,
  title,
  description,
  breadcrumbs,
  actions,
  size = "default",
  className,
}: PageContainerProps) {
  const hasCrumbs = Boolean(breadcrumbs && breadcrumbs.length > 0);
  const hasHeader = Boolean(title || description || actions || hasCrumbs);

  return (
    <div
      className={cn(
        "mx-auto w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8",
        sizeClasses[size],
        className
      )}
    >
      {hasHeader && (
        <div className="mb-6 flex flex-col gap-4 sm:mb-8">
          {hasCrumbs && (
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs!.map((crumb, index) => {
                  const isLast = index === breadcrumbs!.length - 1;
                  return (
                    <Fragment key={`${crumb.label}-${index}`}>
                      <BreadcrumbItem>
                        {crumb.href && !isLast ? (
                          <BreadcrumbLink render={<Link href={crumb.href} />}>
                            {crumb.label}
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator />}
                    </Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          )}

          {(title || description || actions) && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              {(title || description) && (
                <div className="min-w-0 space-y-1">
                  {title && (
                    <h1 className="truncate text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                      {title}
                    </h1>
                  )}
                  {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                  )}
                </div>
              )}
              {actions && (
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {actions}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {children}
    </div>
  );
}
