import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased min-h-screen">
        <AppProviders>
          {children}
        </AppProviders>
        {/* No-ops off Vercel or with Analytics not enabled for the project —
            safe to ship unconditionally, unlike the env-var-gated
            integrations in instrumentation-client.ts. */}
        <Analytics />
      </body>
    </html>
  );
}