import {
  Cloud,
  Code2,
  Cpu,
  Database,
  Lock,
  Server,
  Smartphone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const itServices = [
  {
    icon: Cloud,
    title: "Cloud Architecture & DevOps",
    badge: "Cloud Ready",
    description:
      "Perancangan infrastruktur cloud elastis (AWS, GCP, Azure), orkestrasi kontainer Kubernetes, pipeline CI/CD otomatis, dan Infrastructure as Code (IaC Terraform).",
    tags: ["Kubernetes", "AWS / GCP", "Docker", "Terraform", "CI/CD"],
  },
  {
    icon: Code2,
    title: "Enterprise Software & Web Apps",
    badge: "Fullstack",
    description:
      "Pengembangan aplikasi web skala besar dengan Next.js 16, backend berkinerja tinggi Bun.js / Hono, arsitektur modular, dan database PostgreSQL/Drizzle yang aman dan teruji.",
    tags: ["Next.js 16", "Bun.js", "Hono", "TypeScript", "PostgreSQL"],
  },
  {
    icon: Lock,
    title: "Cyber Security & Hardening",
    badge: "Security",
    description:
      "Audit keamanan menyeluruh, penetration testing, kepatuhan OWASP, proteksi DDoS, hardening SSL/TLS & CSP, enkripsi data in-transit & at-rest, serta Zero-Trust IAM.",
    tags: ["Penetration Testing", "OWASP Top 10", "Zero-Trust", "SSL/TLS", "Compliance"],
  },
  {
    icon: Cpu,
    title: "AI Automation & Data Pipeline",
    badge: "Next-Gen AI",
    description:
      "Integrasi model AI dan LLM ke alur kerja bisnis, pemrosesan data real-time, otomatisasi agen IT, sistem analitik cerdas, dan vector database untuk semantic search.",
    tags: ["LLM Integration", "AI Agents", "ETL Pipelines", "Vector Search", "Python/Bun"],
  },
  {
    icon: Server,
    title: "IT Managed Services & 24/7 SLA",
    badge: "High SLA",
    description:
      "Monitoring performa server 24/7/365, backup otomatis multi-region, disaster recovery plan, patching berkala, dan penanganan insiden cepat dengan jaminan SLA 99.99%.",
    tags: ["24/7 Monitoring", "Incident Response", "Disaster Recovery", "SLA 99.99%"],
  },
  {
    icon: Smartphone,
    title: "Mobile & Cross-Platform Apps",
    badge: "Mobile",
    description:
      "Aplikasi mobile tangguh (iOS & Android) dengan arsitektur offline-first, sinkronisasi cloud real-time, performa native, dan integrasi hardware perangkat IoT.",
    tags: ["React Native", "Cross-Platform", "Offline-First", "Push Notifications"],
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="border-b border-border bg-muted/20 py-20 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Badge variant="outline" className="text-primary border-primary/30">
            Layanan IT Unggulan
          </Badge>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl text-balance">
            Kapabilitas Rekayasa Teknologi Terlengkap untuk Bisnis Anda
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            Dari arsitektur cloud mission-critical hingga aplikasi web modern berlatensi rendah,
            kami menghadirkan rekayasa IT berstandar internasional.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {itServices.map((service) => (
            <div
              key={service.title}
              className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <service.icon className="size-5" />
                  </span>
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                    {service.badge}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/50 flex flex-wrap gap-1.5">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
