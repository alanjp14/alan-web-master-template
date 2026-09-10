"use client";

import { useState } from "react";
import { toast } from "sonner";
import { BellRingIcon, CheckIcon } from "lucide-react";

import { FadeIn, ScaleIn, SlideIn, StaggerContainer } from "@/components/motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppearance } from "@/hooks/use-appearance";
import { cn } from "cn";

/**
 * Live brand-theme + density picker. Writes through `AppearanceProvider`, so
 * choosing here is identical to using the header's palette menu — and the
 * whole page (this one included) re-themes instantly.
 */
export function ThemePicker() {
  const { theme, setTheme, density, setDensity, themes } = useAppearance();

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {themes.map((option) => {
          const active = theme === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => setTheme(option.id)}
              className={cn(
                "flex flex-col gap-3 rounded-xl border p-4 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                active
                  ? "border-primary bg-accent/50"
                  : "border-border hover:bg-muted/50"
              )}
            >
              <span className="flex items-center justify-between">
                <span
                  aria-hidden="true"
                  className="flex size-6 overflow-hidden rounded-full ring-1 ring-foreground/15"
                >
                  <span
                    className="h-full w-1/2"
                    style={{ backgroundColor: option.swatch[0] }}
                  />
                  <span
                    className="h-full w-1/2"
                    style={{ backgroundColor: option.swatch[1] }}
                  />
                </span>
                {active && (
                  <CheckIcon
                    className="size-4 text-primary"
                    aria-hidden="true"
                  />
                )}
              </span>
              <span className="space-y-1">
                <span className="block text-sm font-medium">{option.label}</span>
                <span className="block text-xs text-muted-foreground">
                  {option.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="group"
        aria-label="Density"
        className="inline-flex rounded-lg border border-border p-0.5"
      >
        {(["comfortable", "compact"] as const).map((option) => {
          const active = density === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => setDensity(option)}
              className={cn(
                "rounded-md px-3 py-1 text-sm font-medium capitalize transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Interactive primitives that need client state — grouped so the page stays
 *  a server component. */
export function InteractivePrimitives() {
  return (
    <div className="flex flex-wrap items-end gap-6">
      <FieldGroup className="w-56 gap-2">
        <Field>
          <FieldLabel>Environment</FieldLabel>
          <Select defaultValue="production">
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="production">Production</SelectItem>
              <SelectItem value="staging">Staging</SelectItem>
              <SelectItem value="development">Development</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>

      <Field orientation="horizontal" className="w-fit items-center">
        <Switch id="showcase-switch" defaultChecked />
        <FieldLabel htmlFor="showcase-switch" className="font-normal">
          Enabled
        </FieldLabel>
      </Field>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
          <TooltipContent>A tooltip, themed with the rest.</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Button
        variant="secondary"
        onClick={() =>
          toast.success("Saved", {
            description: "Toast styling follows the active theme.",
          })
        }
      >
        <BellRingIcon aria-hidden="true" />
        Fire a toast
      </Button>

      <Dialog>
        <DialogTrigger render={<Button>Open dialog</Button>} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog</DialogTitle>
            <DialogDescription>
              Overlays, radii and rings all read from the active theme&apos;s
              tokens.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <DialogClose render={<Button />}>Confirm</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Motion primitives with a replay control — `key` bump remounts the group. */
export function MotionShowcase() {
  const [runId, setRunId] = useState(0);

  return (
    <div className="space-y-4">
      <Button variant="outline" size="sm" onClick={() => setRunId((id) => id + 1)}>
        Replay
      </Button>
      <StaggerContainer
        key={runId}
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        <FadeIn className="rounded-lg bg-muted p-4 text-center text-sm font-medium">
          FadeIn
        </FadeIn>
        <SlideIn className="rounded-lg bg-muted p-4 text-center text-sm font-medium">
          SlideIn
        </SlideIn>
        <ScaleIn className="rounded-lg bg-muted p-4 text-center text-sm font-medium">
          ScaleIn
        </ScaleIn>
        <FadeIn className="rounded-lg bg-muted p-4 text-center text-sm font-medium">
          Staggered
        </FadeIn>
      </StaggerContainer>
      <p className="text-xs text-muted-foreground">
        With OS &ldquo;reduce motion&rdquo; on, these resolve instantly — by
        design.
      </p>
    </div>
  );
}
