"use client";

import { PaletteIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppearance } from "@/hooks/use-appearance";
import type { Density, ThemeId } from "@/config/theme";

const DENSITIES: { value: Density; label: string }[] = [
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
];

/**
 * Brand-theme and density switcher.
 *
 * The two "look and feel" axes that aren't light/dark mode — that stays in
 * `ThemeToggle`. State comes from `useAppearance`, which reads `<html>` through
 * `useSyncExternalStore`, so this is hydration-safe with no mounted guard.
 */
export function AppearanceMenu() {
  const { theme, setTheme, density, setDensity, themes } = useAppearance();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Change theme and density"
          />
        }
      >
        <PaletteIcon aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel>Brand theme</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value as ThemeId)}
        >
          {themes.map((option) => (
            <DropdownMenuRadioItem key={option.id} value={option.id}>
              <span
                aria-hidden="true"
                className="mr-1 inline-flex size-3.5 shrink-0 overflow-hidden rounded-full ring-1 ring-foreground/15"
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
              <span className="flex min-w-0 flex-col">
                <span className="font-medium">{option.label}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {option.description}
                </span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Density</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={density}
          onValueChange={(value) => setDensity(value as Density)}
        >
          {DENSITIES.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
