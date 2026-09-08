import Link from "next/link";
import { cn } from "cn";

import { APP_CONFIG } from "@/config/app";

export interface BrandMarkProps {
  /** Wrap the mark in a link to this href. */
  href?: string;
  /** Visually hide the wordmark, keeping only the glyph (still in the a11y tree). */
  compact?: boolean;
  className?: string;
}

/**
 * The product glyph + wordmark, from `APP_CONFIG`. Used by the marketing, auth
 * and top-nav shells. The dashboard sidebar has its own collapse-aware variant
 * (`SidebarBrand` in `AppSidebar`).
 */
export function BrandMark({ href, compact = false, className }: BrandMarkProps) {
  const content = (
    <>
      <span
        aria-hidden="true"
        className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
      >
        {APP_CONFIG.name.charAt(0)}
      </span>
      <span
        className={cn(
          "text-sm font-semibold tracking-tight",
          compact && "sr-only"
        )}
      >
        {APP_CONFIG.name}
      </span>
    </>
  );

  const classes = cn(
    "flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <span className={cn("flex items-center gap-2.5", className)}>{content}</span>;
}
