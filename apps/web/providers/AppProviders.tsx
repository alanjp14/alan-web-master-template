"use client";

import dynamic from "next/dynamic";

import { ThemeProvider } from "./ThemeProvider";
import { QueryProvider } from "./QueryProvider";

// Code-split: the Toaster renders nothing until a toast actually fires, so
// it doesn't need to be in the bundle every route pays for on first load.
// `ssr: false` is safe here — it's a client-only portal with no content to
// server-render, and by the time any user action could trigger a toast,
// this chunk has long since loaded in the background.
const Toaster = dynamic(
  () => import("@/components/ui/sonner").then((mod) => mod.Toaster),
  { ssr: false }
);

export function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <QueryProvider>
        {children}
        {/* Sonner's own portal — defined in components/ui/sonner.tsx but
            never mounted anywhere until now, so `toast()` had nowhere to
            render. `top-center` keeps it clear of the fixed mobile bottom
            navigation; Sonner's default `bottom-right` would sit on top of it. */}
        <Toaster position="top-center" />
      </QueryProvider>
    </ThemeProvider>
  );
}
