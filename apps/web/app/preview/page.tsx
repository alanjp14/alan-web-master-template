import type { Metadata } from "next";
import { PreviewClient } from "./preview-client";

export const metadata: Metadata = {
  title: "Client Showcase & Interactive 3D Playground | Master Template UI/UX",
  description:
    "Katalog dan playground interaktif komponen UI/UX modern dengan visual 3D, animasi halus, micro-interactions, dan multi-tema untuk presentasi langsung ke calon klien.",
};

/**
 * Public Client Showcase and Interactive Playground Page.
 * Unauthenticated and publicly accessible on Vercel for seamless client demonstrations.
 */
export default function PreviewPage() {
  return <PreviewClient />;
}
