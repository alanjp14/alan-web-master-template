import type { ThemeId } from "./theme";

export interface DraftPreset {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  recommendedTheme: ThemeId;
  targetAudience: string;
  keyFeatures: readonly string[];
  layoutType: "marketing" | "saas" | "agency" | "dashboard";
  previewUrl: string;
  tagline: string;
  colorHex: string;
}

export const DRAFT_PRESETS: readonly DraftPreset[] = [
  {
    id: "draft-enterprise",
    title: "Draft 1: Enterprise IT & Cloud Solutions",
    subtitle: "Solusi Formal, Andal & High-Performance Enterprise",
    badge: "Enterprise Ready",
    tagline: "Arsitektur cloud berstandar enterprise dengan jaminan SLA 99.99% & keamanan teruji.",
    description:
      "Tampilan profesional dan berwibawa dengan tema Sapphire (Blue Corporate). Menggabungkan elemen visual 3D Server Rack & Tech Globe, perincian modul layanan IT, sertifikasi keamanan, serta formulir konsultasi enterprise.",
    recommendedTheme: "sapphire",
    targetAudience: "Perusahaan IT, B2B Enterprise, Cloud Provider, & Consulting Firm",
    keyFeatures: [
      "Visualisasi 3D Tech Globe & Server Rack",
      "Perincian Layanan & SLA Guarantee",
      "Formulir Konsultasi & Audit Sistem",
      "Testimoni & Klien Enterprise",
    ],
    layoutType: "marketing",
    previewUrl: "/",
    colorHex: "#1d4ed8",
  },
  {
    id: "draft-saas",
    title: "Draft 2: Modern SaaS & Cloud Product",
    subtitle: "Desain Segar, Interaktif & Produk Digital Berbasis Subskripsi",
    badge: "Next-Gen SaaS",
    tagline: "Platform digital intuitif yang mempercepat pertumbuhan bisnis dan produktivitas tim.",
    description:
      "Tampilan modern dan bersih berbasis tema Emerald. Dilengkapi widget statistik interaktif, kalkulator harga subskripsi (Pricing Table), galeri fitur modul produk, serta alur registrasi instant (Sign Up).",
    recommendedTheme: "emerald",
    targetAudience: "Startups, Software House, SaaS Product, & Subscription Services",
    keyFeatures: [
      "Tabel Harga Subskripsi Interaktif (Bulanan/Tahunan)",
      "Live Analytics & Metric Preview Cards",
      "Alur Registrasi & Onboarding Cepat",
      "Teaser Modul & Integrasi API",
    ],
    layoutType: "saas",
    previewUrl: "/pricing",
    colorHex: "#15803d",
  },
  {
    id: "draft-creative",
    title: "Draft 3: Tech Agency & Creative Studio",
    subtitle: "Futuristik, Bold Typography & High-Impact Portfolio",
    badge: "Creative Tech",
    tagline: "Rekayasa perangkat lunak eksklusif dengan pengalaman visual memukau dan performa maksimal.",
    description:
      "Tampilan berani dengan sentuhan typography serif & tema Amber yang hangat. Menyoroti animasi 3D Particle Wave & Cyber Grid, galeri studi kasus/portfolio interaktif, dan statistik pencapaian agency.",
    recommendedTheme: "amber",
    targetAudience: "Software House, Design Studio, Digital Agency, & Innovators",
    keyFeatures: [
      "Typography Serif Heading & Warm Dark Feel",
      "Animasi Interaktif 3D Particle Wave",
      "Galeri Portfolio & Case Studies",
      "Statistik Pencapaian & Workflow Studio",
    ],
    layoutType: "agency",
    previewUrl: "/tools",
    colorHex: "#b45309",
  },
  {
    id: "draft-dashboard",
    title: "Draft 4: Modular Web App & Dashboard Console",
    subtitle: "Antarmuka Aplikasi Web, Admin Panel & Workspace",
    badge: "App Shell",
    tagline: "Pusat kendali data dan manajemen alur kerja yang dapat disesuaikan sesuai kebutuhan tim.",
    description:
      "Draft antarmuka aplikasi web internal / admin console dengan tema Slate high-contrast. Memiliki navigasi Sidebar Rail & Topnav Workspace, tabel data interaktif, sparkline visualization, serta pengatur preferensi tampilan.",
    recommendedTheme: "slate",
    targetAudience: "Sistem Management Internal, ERP/CRM, Admin Console, & SaaS App",
    keyFeatures: [
      "Dual Navigation Mode (Sidebar Rail & Topnav)",
      "Kartu Metrik & Visualisasi Data Sparkline",
      "Tabel Pengguna & Kontrol Akses",
      "Showcase Komponen UI Lengkap",
    ],
    layoutType: "dashboard",
    previewUrl: "/showcase",
    colorHex: "#334155",
  },
] as const;
