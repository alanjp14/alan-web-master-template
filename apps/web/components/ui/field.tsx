"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Label } from "@/components/ui/label"

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "group/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3",
        className
      )}
      {...props}
    />
  )
}

const fieldVariants = cva(
  "group/field flex w-full gap-3 data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: "flex-col [&>*]:w-full",
        horizontal: "flex-row items-center",
        responsive: "flex-col @md/field-group:flex-row @md/field-group:items-center",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
)

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      data-slot="field"
      data-orientation={orientation}
      role="group"
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "group/field-label peer/field-label flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-sm text-muted-foreground last:mt-0 [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
}

export interface FieldErrorProps extends React.ComponentProps<"div"> {
  /**
   * Validation errors to render, e.g. from `react-hook-form`'s `formState`.
   * Ignored when `children` is passed instead. Falsy entries and messages
   * are skipped, so passing straight through a form library's error array
   * is fine even when some fields are unset.
   */
  errors?: Array<{ message?: string } | undefined>;
}

function FieldError({ className, children, errors, ...props }: FieldErrorProps) {
  const content = React.useMemo(() => {
    if (children) return children;
    if (!errors) return null;

    const messages = errors
      .map((error) => error?.message)
      .filter((message): message is string => Boolean(message));

    if (messages.length === 0) return null;
    if (messages.length === 1) return messages[0];

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    );
  }, [children, errors]);

  if (!content) return null;

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {content}
    </div>
  );
}

export { FieldGroup, Field, FieldLabel, FieldDescription, FieldError, fieldVariants }
