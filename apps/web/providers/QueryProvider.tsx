"use client";

import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

export function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Created per component instance, not at module scope: a module-level
  // singleton would be shared across every request this server process
  // handles, letting one user's cached query data leak into another's
  // server-rendered response. `useState`'s lazy initializer runs once per
  // mount, which is what we want on both the server (one client per request)
  // and the client (one client for the app's lifetime).
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}