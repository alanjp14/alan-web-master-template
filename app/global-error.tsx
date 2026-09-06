"use client";

/**
 * Last-resort error boundary — only triggers when the root layout itself
 * throws (its own `<html>`/`<body>` are already gone by that point, so this
 * has to render its own). Because whatever broke could plausibly be
 * upstream of our design-system tokens or providers, this deliberately does
 * NOT use `ThemeProvider`, the `Button` component, or `bg-background`/
 * `text-foreground` — it's plain, hardcoded Tailwind colors so it renders
 * correctly even if the thing that failed is part of that chain.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-svh items-center justify-center bg-white px-4 antialiased">
        <div className="flex max-w-sm flex-col items-center gap-3 text-center">
          <h1 className="text-lg font-semibold text-zinc-900">
            Something went wrong
          </h1>
          <p className="text-sm text-zinc-500">
            {error.message ||
              "An unexpected error occurred. Please refresh the page."}
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-1 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
