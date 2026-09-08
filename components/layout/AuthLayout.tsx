import type { ReactNode } from "react";
import { cn } from "cn";

import { AppearanceMenu } from "@/components/layout/AppearanceMenu";
import { BrandMark } from "@/components/layout/BrandMark";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export interface AuthLayoutProps {
  children: ReactNode;
  /** Heading above the form. */
  title: string;
  /** Sub-copy under the heading. */
  description?: string;
  /** Line under the form card, e.g. "Already have an account? Sign in". */
  footer?: ReactNode;
  /**
   * Optional panel shown beside the form on `lg+` — a testimonial, product
   * shot, or value prop. Omit for a plain centered card.
   */
  aside?: ReactNode;
  className?: string;
}

/**
 * Centered shell for authentication screens — sign in, sign up, password
 * reset. Brand mark, a titled form card, and an optional split-screen `aside`.
 *
 * The forms mounted inside are presentational in this template (no submit
 * handler); wire them to Server Actions in a real app.
 */
export function AuthLayout({
  children,
  title,
  description,
  footer,
  aside,
  className,
}: AuthLayoutProps) {
  return (
    <div
      className={cn(
        "grid min-h-svh bg-background text-foreground",
        aside && "lg:grid-cols-2",
        className
      )}
    >
      <div className="relative flex flex-col px-4 py-8 sm:px-6">
        <div className="absolute top-4 right-4 flex items-center gap-1">
          <AppearanceMenu />
          <ThemeToggle />
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-8 py-12">
          <BrandMark href="/" />

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-balance">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground text-pretty">
                {description}
              </p>
            )}
          </div>

          {children}

          {footer && (
            <p className="text-sm text-muted-foreground">{footer}</p>
          )}
        </div>
      </div>

      {aside && (
        <div className="relative hidden overflow-hidden border-l border-border bg-muted/40 lg:block">
          <div className="flex h-full flex-col justify-center px-12 py-16">
            {aside}
          </div>
        </div>
      )}
    </div>
  );
}
