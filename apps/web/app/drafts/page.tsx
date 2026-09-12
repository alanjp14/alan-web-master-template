import type { Metadata } from "next";
import { DraftsClientShowcase } from "./drafts-client";

export const metadata: Metadata = {
  title: "Client Draft Selection Showcase | Presentasi Template Web",
  description:
    "Katalog dan alat perbandingan interaktif preset draft web (Enterprise, SaaS, Agency, Dashboard) untuk dipresentasikan kepada client.",
};

/**
 * Client Draft Selection Showcase Page.
 * Renders an interactive switcher, responsive viewport toggles, live theme switching,
 * and preset summary generator for presenting design choices to clients.
 */
export default function DraftsPage() {
  return <DraftsClientShowcase />;
}
