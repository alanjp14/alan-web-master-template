# Monitoring & Observability

Three integrations are wired into this template, each gated on its own
environment variable (except Vercel Analytics, which needs none) and safe to
leave unconfigured — nothing is sent anywhere, and nothing errors, until you
connect a real project.

| Integration       | Purpose                          | Where it's wired                                             | Env var                          |
| ------------------ | --------------------------------- | -------------------------------------------------------------- | --------------------------------- |
| Sentry             | Error tracking + performance      | `instrumentation.ts`, `instrumentation-client.ts`, both error boundaries | `NEXT_PUBLIC_SENTRY_DSN`          |
| Microsoft Clarity  | Session replay, heatmaps          | `instrumentation-client.ts`                                     | `NEXT_PUBLIC_CLARITY_PROJECT_ID`  |
| Vercel Analytics   | Page views, custom events         | `app/layout.tsx` (`<Analytics />`)                              | none — auto-activates on Vercel   |

## Sentry

1. Create a project at [sentry.io](https://sentry.io) (or self-hosted) and
   copy its DSN.
2. Add it to `.env.local`:
   ```
   NEXT_PUBLIC_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
   ```
3. Restart the dev server. That's it — `instrumentation.ts` initializes
   Sentry for the server and edge runtimes and reports every server-side
   error (Server Components, Route Handlers, Server Actions) via Next's
   `onRequestError` hook; `instrumentation-client.ts` initializes it for the
   browser; both error boundaries (`app/(dashboard)/error.tsx`,
   `app/global-error.tsx`) explicitly forward client-side rendering errors
   with `Sentry.captureException`, since `onRequestError` only sees
   server-side ones.

**What this setup deliberately doesn't do**: it does not run
`@sentry/wizard` or wrap `next.config.ts` with `withSentryConfig`, so there's
no source-map upload and no `SENTRY_AUTH_TOKEN` to manage — sourcemap upload
needs a real Sentry org/project to authenticate against, which this template
doesn't have. Once you have one, run:

```bash
npx @sentry/wizard@latest -i nextjs
```

It will offer to wrap `next.config.ts` for you — safe to accept at that
point, since a real DSN and auth token will exist. Skip re-running the parts
that duplicate what's already here (`instrumentation.ts`,
`instrumentation-client.ts`, the error boundary calls).

**Trace sampling** defaults to `0.1` (10%) in both instrumentation files.
100% is the SDK's own default and gets expensive fast at any real traffic
volume — raise or lower it once you know your actual volume and quota.

## Microsoft Clarity

1. Create a project at [clarity.microsoft.com](https://clarity.microsoft.com)
   and copy its project ID (from the tracking code snippet, or the project
   settings page).
2. Add it to `.env.local`:
   ```
   NEXT_PUBLIC_CLARITY_PROJECT_ID=abcd1234ef
   ```
3. Restart the dev server. `instrumentation-client.ts` injects Clarity's
   tracking snippet once this is set — no separate package needed for
   passive session-replay/heatmap tracking.

If your product needs Clarity's programmatic API (custom tags,
consent-gating, `identify()` calls), install `@microsoft/clarity` and call
it from application code — the snippet here only covers automatic tracking.

## Vercel Analytics

No setup in this repo. `<Analytics />` (in `app/layout.tsx`) is already
present and does nothing until two things are both true: the app is
deployed on Vercel, and Web Analytics is turned on for that project in the
Vercel dashboard (Project → Analytics). Turn it on there; no code or env
var change needed here.

## Content Security Policy

`next.config.ts` sets a CSP (see `docs/AUDIT.md`'s Phase 17 section). It
already allows `va.vercel-scripts.com` and `www.clarity.ms` in both
`script-src` and `connect-src`, so Analytics and Clarity work without
further changes — this was actually caught and fixed by loading each
integration live and watching for a CSP violation in the console, not
assumed. **Sentry is the exception**: its ingest URL is specific to your
project (`https://oXXXXXX.ingest.us.sentry.io` or similar — the host part of
your DSN), so once you set a real `NEXT_PUBLIC_SENTRY_DSN`, add that host to
`connect-src` in `next.config.ts` yourself.

## Verifying a connection

- **Sentry**: trigger a real error (e.g. temporarily throw from a page) and
  check the project's Issues tab.
- **Clarity**: open the deployed app, then check the project's Recordings
  tab a few minutes later — Clarity batches uploads, so it isn't instant.
- **Vercel Analytics**: check the project's Analytics tab in the Vercel
  dashboard after some real traffic; local dev traffic isn't counted.
