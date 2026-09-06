"use client";

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
        <MotionProvider>{children}</MotionProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}