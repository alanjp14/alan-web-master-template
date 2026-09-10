import * as Sentry from "@sentry/nextjs";

/**
 * Server + edge runtime observability. Next.js calls `register()` once when
 * a server instance starts, before it handles any request — see
 * https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation.
 *
 * `NEXT_PUBLIC_SENTRY_DSN` is unset by default (this template ships with no
 * real Sentry project). Sentry's own SDK design is to safely no-op with no
 * DSN configured; `enabled` just makes that intent explicit rather than
 * relying on it implicitly. See docs/MONITORING.md to connect a real one.
 */
export async function register() {
  if (
    process.env.NEXT_RUNTIME === "nodejs" ||
    process.env.NEXT_RUNTIME === "edge"
  ) {
    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

    Sentry.init({
      dsn,
      enabled: Boolean(dsn),
      // Conservative default — tune for real traffic once a DSN is set.
      // 100% tracing gets expensive fast at any real volume.
      tracesSampleRate: 0.1,
    });
  }
}

/**
 * Reports server-side errors (Server Components, Route Handlers, Server
 * Actions) to Sentry. `captureRequestError`'s parameters are shaped to match
 * this hook exactly — see
 * https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation#onrequesterror-optional.
 */
export const onRequestError = Sentry.captureRequestError;
