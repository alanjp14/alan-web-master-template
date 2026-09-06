"use client";

import { Toaster } from "@/components/ui/sonner";

import { ThemeProvider } from "./ThemeProvider";
import { QueryProvider } from "./QueryProvider";
import { MotionProvider } from "./MotionProvider";

export function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <MotionProvider>
          {children}
          {/* Sonner's own portal — defined in components/ui/sonner.tsx but
              never mounted anywhere until now, so `toast()` had nowhere to
              render. `top-center` keeps it clear of the fixed mobile bottom
              navigation; Sonner's default `bottom-right` would sit on top of it. */}
          <Toaster position="top-center" />
        </MotionProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}