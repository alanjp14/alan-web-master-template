import * as Sentry from "@sentry/nextjs";

// Runs after the HTML loads but before React hydrates — see
// https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client.
// Both integrations below are gated on an env var and are no-ops without
// one, so this file is safe to ship as-is with nothing configured. See
// docs/MONITORING.md for how to connect real projects.

const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: sentryDsn,
  enabled: Boolean(sentryDsn),
  tracesSampleRate: 0.1,
});

/**
 * Microsoft Clarity — session replay and heatmaps. This is the vendor's own
 * embed snippet (https://clarity.microsoft.com), adapted to only run once a
 * project ID is configured; no `@microsoft/clarity` package needed for
 * passive tracking, which is all a template can meaningfully wire up ahead
 * of time.
 */
const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

if (clarityProjectId && typeof window !== "undefined") {
  (function (
    win: Window & { clarity?: { (...args: unknown[]): void; q?: unknown[] } },
    doc: Document,
    tagName: string,
    projectId: string
  ) {
    win.clarity =
      win.clarity ||
      function (...args: unknown[]) {
        (win.clarity!.q = win.clarity!.q || []).push(args);
      };
    const tag = doc.createElement(tagName) as HTMLScriptElement;
    tag.async = true;
    tag.src = `https://www.clarity.ms/tag/${projectId}`;
    const firstScript = doc.getElementsByTagName(tagName)[0];
    firstScript.parentNode?.insertBefore(tag, firstScript);
  })(window, document, "script", clarityProjectId);
}
