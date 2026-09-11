import type { Metadata } from "next";
import {
  ConsultationForm,
  FaqSection,
  HeroSection,
  PortfolioSection,
  ServicesSection,
  StatsSection,
  ToolsTeaserSection,
  WorkflowSection,
} from "@/components/marketing";
import { APP_CONFIG } from "@/config/app";

export const metadata: Metadata = {
  title: "Jasa Layanan IT Enterprise & Solusi Software Berkinerja Tinggi",
  description:
    "Penyedia jasa rekayasa software, arsitektur cloud, keamanan siber, dan web tools IT berbasis Next.js 16 dan Bun.js dengan jaminan SLA 99.99%.",
};

/**
 * Enterprise IT Company Profile landing page.
 * Rendered inside `MarketingLayout`, incorporating lightweight 3D animations,
 * services breakdown, technical case studies, workflow methodology, and client consultation.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <WorkflowSection />
      <PortfolioSection />
      <ToolsTeaserSection />
      <FaqSection />
      <ConsultationForm />
    </>
  );
}
