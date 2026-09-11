import { CheckCircle2, GitBranch, Layers, Rocket, ShieldCheck } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Discovery & Architecture Blueprint",
    icon: Layers,
    desc: "Analisis mendalam kebutuhan sistem, pemodelan data, arsitektur cloud, dan pemilihan stack teknologi paling efisien.",
  },
  {
    step: "02",
    title: "Agile Development Sprint",
    icon: GitBranch,
    desc: "Pengembangan iteratif 2-mingguan dengan feedback loop konstan, clean code TypeScript, dan unit testing ketat.",
  },
  {
    step: "03",
    title: "Security & Penetration Audit",
    icon: ShieldCheck,
    desc: "Uji penetrasi, vulnerability scanning, validasi kepatuhan OWASP, dan stress testing beban puncak.",
  },
  {
    step: "04",
    title: "Automated Zero-Downtime Deploy",
    icon: Rocket,
    desc: "Peluncuran sistem dengan pipeline CI/CD modern, rollback instan jika diperlukan, dan CDN caching global.",
  },
  {
    step: "05",
    title: "24/7 SLA Monitoring & Support",
    icon: CheckCircle2,
    desc: "Pemantauan proaktif terhadap APM, health check berkala, dan tim teknis dedicated untuk pemeliharaan berkelanjutan.",
  },
];

export function WorkflowSection() {
  return (
    <section className="border-b border-border bg-muted/10 py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Engineering Methodology
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Alur Kerja Rekayasa IT yang Terstruktur & Transparan
          </h2>
          <p className="mt-3 text-muted-foreground text-pretty">
            Setiap proyek dikerjakan dengan standar rekayasa perangkat lunak tertinggi demi menjamin ketepatan waktu dan kualitas tanpa bug.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((item, idx) => (
            <div
              key={item.step}
              className="relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-primary/40">{item.step}</span>
                  <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="size-4" />
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/50 text-[11px] font-medium text-primary">
                Fase {idx + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
