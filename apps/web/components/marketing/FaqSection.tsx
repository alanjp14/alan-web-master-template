import { HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const faqs = [
  {
    q: "Apa saja model kerja sama yang ditawarkan untuk layanan IT?",
    a: "Kami menyediakan model Project-Based (lingkup dan timeline tetap dengan garansi milestone), Dedicated Engineering Team (tim spesialis penuh waktu yang menyatu dengan alur kerja internal Anda), serta IT Managed Services (perawatan, pemantauan 24/7, dan SLA infrastruktur).",
  },
  {
    q: "Mengapa memilih kombinasi teknologi Next.js 16 dan Bun.js?",
    a: "Next.js 16 App Router memberikan pengalaman UI/UX kelas dunia, SEO optimal, dan rendering cepat. Sementara Bun.js di backend memberikan kecepatan I/O tinggi, konsumsi RAM yang jauh lebih hemat dibanding Node.js konvensional, serta latensi API di bawah 15 milidetik.",
  },
  {
    q: "Bagaimana dengan kepemilikan kode sumber (Source Code IP)?",
    a: "100% hak kekayaan intelektual (IP) dan seluruh source code, database schema, dokumentasi arsitektur, dan konfigurasi cloud sepenuhnya menjadi milik klien Anda setelah proyek selesai diserahterimakan.",
  },
  {
    q: "Apakah ada jaminan SLA (Service Level Agreement) dan garansi pemeliharaan?",
    a: "Ya. Setiap proyek dilengkapi masa garansi perbaikan bug (bug-fix warranty) selama minimal 3-6 bulan setelah peluncuran, serta opsi perpanjangan maintenance SLA hingga 99.99% uptime dengan monitoring 24/7.",
  },
  {
    q: "Berapa lama estimasi waktu pengerjaan sebuah sistem IT?",
    a: "Tergantung kompleksitas sistem. Untuk MVP atau platform web tools biasanya memakan waktu 4–8 minggu. Untuk sistem enterprise skala besar atau migrasi cloud kompleks biasanya berlangsung dalam sprint terstruktur 3–6 bulan.",
  },
];

export function FaqSection() {
  return (
    <section className="border-b border-border bg-background py-20">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="outline" className="text-primary border-primary/30">
            FAQ
          </Badge>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="mt-3 text-muted-foreground text-pretty">
            Informasi penting seputar proses kerja, keamanan, SLA, dan teknologi yang kami gunakan.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="rounded-xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/40"
            >
              <h3 className="text-base font-semibold text-foreground flex items-start gap-3">
                <HelpCircle className="size-5 text-primary shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground pl-8">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
