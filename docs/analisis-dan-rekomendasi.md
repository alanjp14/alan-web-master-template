# Analisis & Rekomendasi — Master Template Frontend UI/UX

Ditinjau sebagai: Arsitektur Web & Mobile Apps · UI/UX Designer Engineer ·
Fullstack Development.

Pertanyaan inti: **apakah template ini menyediakan banyak opsi tampilan
(look & feel) frontend untuk kebutuhan klien yang berbeda-beda?**

---

## 1. Ringkasan temuan awal (sebelum sesi ini)

**Jawaban singkat: belum.** Sebelum pengerjaan ini, repo adalah *satu* shell
dashboard yang sangat rapi dengan **satu bahasa desain**: hijau/putih, font
Geist, satu skala radius, satu layout sidebar, mode terang/gelap. Kualitas
rekayasanya kelas produksi (TypeScript strict, Vitest, CSP + header
hardening, CodeQL, Dependabot, empat dokumen standar), tetapi:

- **Hanya satu tema / merek.** `globals.css` hanya punya `:root` (hijau) dan
  `.dark`. Tidak ada mekanisme untuk palet alternatif.
- **Hanya satu arketipe layout.** Tidak ada top-nav, tidak ada layout auth
  terpusat, tidak ada shell marketing yang bisa dipakai ulang (landing lama
  merakit header/footer-nya sendiri).
- **Hanya satu "kepribadian" komponen.** Ada `variant`/`size` untuk *fungsi*
  (tombol) tapi tidak untuk *estетika* (flat vs elevated, tajam vs pill).
- **Switch "Compact density" & "Interface animation" di Settings tidak
  berfungsi** — hanya demo visual.
- **Satu typeface**, tidak di-tokenkan untuk ditukar.
- **Radius satu skalar tunggal.**
- **Palet data-viz tipis** (5 warna kategorikal, tanpa skala sekuensial/
  divergen).
- **Tidak ada galeri komponen / living style guide.**
- **Tidak ada scaffolding i18n / RTL.**

Arsitekturnya sendiri *siap* untuk multi-tema (token semantik di mana-mana,
`cva`, dimensi layout sudah di config), hanya fiturnya yang belum ada.

---

## 2. Yang sudah diimplementasikan pada sesi ini

Lingkup yang disepakati: **"Core multi-look kit"** — lapisan tema, densitas,
showcase, dan sebagian varian layout. Semua lolos
`lint` + `typecheck` + `test` + `build`.

### 2.1 Lapisan tema (Tier 1) — selesai

- **Empat tema merek**, masing-masing dengan palet terang & gelap, radius,
  dan (sebagian) typeface sendiri:
  | Tema | Kepribadian | Radius | Font |
  | ---- | ----------- | ------ | ---- |
  | **Emerald** (default) | Enterprise ramah, hijau | 0.625rem | Geist |
  | **Sapphire** | Korporat/fintech, biru | 0.375rem | Inter |
  | **Amber** | Editorial/lifestyle, hangat | 0.875rem | Geist + judul serif (Source Serif 4) |
  | **Slate** | Developer tool, monokrom kontras-tinggi | 0.25rem | Geist |
- Model **dua sumbu**: `data-theme` (merek) × `.dark` (mode) di `<html>`,
  ditambah sumbu ketiga `data-density`.
- Registry deklaratif di `config/theme.ts`; guard teruji di `lib/theme.ts`
  (+ `lib/theme.test.ts`, 15 test baru).
- Hook runtime `hooks/use-appearance.ts` berbasis `useSyncExternalStore`
  (tanpa `setState`-in-`useEffect`, tanpa mismatch hydration).
- Sinkronisasi pra-paint `public/appearance-init.js` via
  `<Script strategy="beforeInteractive">` — sesuai CSP & aturan repo.
- Font di-tokenkan (`--app-font-sans` / `--app-font-heading`) supaya bisa
  ditukar per tema; `next/font` tetap self-host (CSP `font-src 'self'` aman).
- Penulisan lengkap: `docs/multi-tema.md`.

### 2.2 Densitas (Tier 3) — selesai

- `data-density="compact"` menurunkan `--spacing` global (~12%), merescale
  seluruh UI dalam satu baris CSS.
- Diikat ke switch **Compact density** di Settings (sekarang berfungsi) dan
  ke `AppearanceMenu` di header.

### 2.3 Showroom (Tier 4) — selesai

- Route baru **`/showcase`** (dalam grup `(dashboard)`, ada di sidebar
  bagian "Design system").
- Berisi: pemilih tema/densitas live, semua token warna + chart, skala
  tipografi & radius, semua varian & ukuran tombol, badge, primitive form &
  interaktif (Select, Switch, Tooltip, Dialog, toast), Alert, varian Card,
  komponen dashboard + state loading/error/empty, data-viz (Sparkline,
  BarList), demo motion dengan tombol replay, dan tautan ke tiap arketipe
  layout.
- Cocok dipakai sebagai halaman internal "pilih arah desain" untuk klien.

### 2.4 Varian layout (Tier 2 — sebagian) — selesai

- **`MarketingLayout`** — shell publik (header + footer). Landing lama
  dipindah ke `app/(marketing)/page.tsx` dan dibangun ulang di atasnya;
  ditambah **`/pricing`** sebagai halaman kedua (bukti reusable).
- **`AuthLayout`** + tiga layar: `/sign-in` (dengan panel split), `/sign-up`,
  `/forgot-password`. Form contoh-pola di `app/(auth)/auth-forms.tsx`.
- **`TopNavLayout`** — shell aplikasi navigasi-horizontal, alternatif
  `DashboardLayout`, demo di **`/workspace`**.
- Komponen pendukung: `BrandMark`, `AccountMenu` (diekstrak dari `AppHeader`),
  `AppearanceMenu`.
- `Card` mendapat prop `variant`: `default` · `elevated` · `outlined` ·
  `flat`.
- Penulisan lengkap: `docs/varian-layout.md`.

### 2.5 Perapian kecil

- `config/app.ts` — sekarang bertipe (`AppConfig` + `satisfies`); versi
  diselaraskan ke `0.1.0` (sesuai `package.json`).
- Header `DashboardLayout` menampilkan `AppearanceMenu`.

---

## 3. Yang sengaja DITUNDA (peta jalan)

Diurut berdasarkan nilai/usaha. Estimasi hari = 1 developer fokus.

### Tier 5 — keluasan (± 4–6 hari)

1. **Perluas palet data-viz** (± 2 hari)
   - Tambah ramp **sekuensial** dan **divergen** per tema (sekarang hanya
     kategorikal `--chart-1..5`).
   - Tambah primitive chart tanpa-dependensi: `DonutChart`, `LineChart`
     (dengan sumbu), `AreaStack` — ikuti pola `lib/chart.ts` (logika di
     `lib/` + komponen SVG tipis, teruji).

2. **i18n + audit RTL** (± 2–3 hari)
   - Scaffolding `next-intl` (atau setara).
   - Audit properti fisik (`left`/`right`, `pl-`/`pr-`) → ganti ke properti
     logika (`ps-`/`pe-`, `start`/`end`). Beberapa sudah dipakai; perlu
     sapuan menyeluruh, terutama `AppSidebar` dan `AuthLayout`.
   - Uji `dir="rtl"`.

3. **`prefers-contrast` / `forced-colors`** (± 0.5 hari)
   - Tambah blok `@media (prefers-contrast: more)` dan dukungan mode
     kontras-paksa Windows, melengkapi tema Slate.

### Tier 2 sisa — arsitektur layout (± 3–4 hari)

4. **`DocsLayout`** — sidebar + daftar isi (TOC) + area prose, untuk
   dokumentasi/konten panjang.
5. **Sheet menu mobile untuk `MarketingLayout`** — sekarang link nav hanya
   `hidden md:flex`.
6. **Refactor primitive `AppShell` bersama** — ekstrak kerangka umum dari
   `DashboardLayout` dan `TopNavLayout` supaya tidak ada duplikasi
   skip-link / struktur `<main>`. Risiko sedang; dilakukan setelah kedua
   shell stabil.

### Tier 4 sisa — showroom (± 1–2 hari)

7. **Storybook** atau halaman "kitchen sink" per shell, plus uji regresi
   visual (mis. Playwright screenshot) supaya perubahan tema tidak
   diam-diam merusak tampilan.

### Kualitas berjalan

8. **Verifikasi kontras** keempat tema dengan pemeriksa otomatis terhadap
   konten nyata sebelum rilis proyek klien. Nilai OKLCH saat ini disetel
   manual untuk *±* AA — belum diukur presisi.
9. **Aktifkan menu akun `DashboardLayout`** begitu ada provider auth (prop
   `user`), dan sambungkan handler "Sign out".

---

## 4. Rekomendasi pemakaian

- **Simpan** shell dashboard, standar, CI, dan disiplin token apa adanya —
  itu bagian terkuat.
- Gunakan **`/showcase`** sebagai artefak yang ditunjukkan ke klien untuk
  memilih arah (tema + densitas + layout) di awal proyek.
- Saat fork untuk proyek klien:
  1. Pilih tema default di `config/theme.ts` (`DEFAULT_THEME`), atau ganti
     nilai token salah satu tema dengan warna merek klien.
  2. Kalau klien hanya butuh satu tampilan, hapus tema yang tak dipakai dari
     `config/theme.ts` + `app/themes.css` + `public/appearance-init.js`, dan
     sembunyikan `AppearanceMenu`.
  3. Ganti landing, pricing, dan route showcase dengan layar nyata; arahkan
     `config/navigation.ts` ke route Anda.
  4. Sambungkan auth + proteksi route sisi-server (template belum punya).

---

## 5. Berkas yang berubah / bertambah pada sesi ini

Baru:
```
config/theme.ts                         app/(marketing)/layout.tsx
lib/theme.ts  lib/theme.test.ts          app/(marketing)/page.tsx
hooks/use-appearance.ts                  app/(marketing)/pricing/page.tsx
app/themes.css                           app/(auth)/auth-forms.tsx
public/appearance-init.js                app/(auth)/sign-in|sign-up|forgot-password/page.tsx
components/layout/AppearanceMenu.tsx     app/(topnav)/layout.tsx
components/layout/AccountMenu.tsx        app/(topnav)/workspace/page.tsx
components/layout/BrandMark.tsx          app/(dashboard)/showcase/page.tsx
components/layout/MarketingLayout.tsx    app/(dashboard)/showcase/showcase-controls.tsx
components/layout/AuthLayout.tsx         docs/multi-tema.md
components/layout/TopNavLayout.tsx       docs/varian-layout.md
                                         docs/analisis-dan-rekomendasi.md
```

Diubah:
```
app/globals.css            app/layout.tsx            config/app.ts
config/navigation.ts       types/navigation.ts       providers/AppProviders.tsx (revert)
components/ui/card.tsx      components/layout/AppHeader.tsx
components/layout/index.ts  app/(dashboard)/settings/settings-panels.tsx
README.md
```

Dihapus: `app/page.tsx` (dipindah ke `app/(marketing)/page.tsx`).
