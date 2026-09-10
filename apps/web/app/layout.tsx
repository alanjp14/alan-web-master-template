import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter, Source_Serif_4 } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

import { AppProviders } from "@/providers/AppProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Loaded for the brand themes that call for a different typeface — Inter for
// Sapphire's body, Source Serif for Amber's headings (see app/themes.css).
// `next/font` self-hosts both at build time, so `font-src 'self'` in the CSP
// stays correct. `display: "swap"` keeps text visible while the face loads.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // Pages set a bare `title` (e.g. "Analytics"); the template appends the app
  // name. `default` covers routes that set none.
  title: {
    default: "Alan Web Master Template",
    template: "%s · Alan Web Master Template",
  },
  description: "Enterprise Web Application Template",
};

// `viewportFit: "cover"` is what makes `env(safe-area-inset-*)` resolve to a
// real value instead of 0 — without it, the safe-area padding already in
// MobileNavigation/DashboardLayout is inert on notched devices.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${sourceSerif.variable}`}
    >
      <body className="antialiased min-h-screen">
        {/* Applies the persisted brand theme + density to <html> before paint,
            so there's no flash of the default Emerald theme. `beforeInteractive`
            hoists it into <head> in the server HTML, ahead of any app code.
            Static same-origin file (not inline) to stay within the CSP and the
            repo's no-dangerouslySetInnerHTML rule — see the file's header and
            docs/multi-tema.md. */}
        <Script src="/appearance-init.js" strategy="beforeInteractive" />
        <AppProviders>{children}</AppProviders>
        {/* No-ops off Vercel or with Analytics not enabled for the project —
            safe to ship unconditionally, unlike the env-var-gated
            integrations in instrumentation-client.ts. */}
        <Analytics />
      </body>
    </html>
  );
}
