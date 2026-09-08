# Sistem Multi-Tema & Densitas

Dokumen ini menjelaskan lapisan tampilan ("look and feel") template: empat
**tema merek**, dua **densitas** spasi, dan mode terang/gelap — beserta cara
menambah tema baru.

> Semua komentar di dalam kode tetap berbahasa Inggris mengikuti konvensi
> repo. Dokumen panduan seperti ini berbahasa Indonesia.

---

## Tiga sumbu yang independen

| Sumbu | Nilai | Disimpan di | Ditulis ke `<html>` | Pemilik |
| ----- | ----- | ----------- | ------------------- | ------- |
| **Mode** | `light` · `dark` · `system` | `localStorage["theme"]` | class `.dark` | `next-themes` (`providers/ThemeProvider.tsx`) |
| **Tema merek** | `emerald` · `sapphire` · `amber` · `slate` | `localStorage["appearance:theme"]` | `data-theme="..."` | `hooks/use-appearance.ts` |
| **Densitas** | `comfortable` · `compact` | `localStorage["appearance:density"]` | `data-density="compact"` (kalau compact) | `hooks/use-appearance.ts` |

Ketiganya bebas dikombinasikan: mis. `sapphire` + `dark` + `compact`. Tema
dan mode adalah dua sumbu terpisah — tiap tema punya palet terang **dan**
gelap sendiri.

---

## Cara kerjanya

### 1. Token, bukan warna mentah

Semua komponen memakai token semantik (`bg-primary`, `text-muted-foreground`,
`ring-ring`, `rounded-lg`, `font-heading`) — tidak pernah warna literal. Token
didefinisikan sebagai custom property CSS di:

- `app/globals.css` — palet **Emerald** (default) di `:root` dan `.dark`,
  plus sumbu densitas.
- `app/themes.css` — blok override untuk Sapphire, Amber, Slate.

Karena komponen hanya menyentuh token, mengganti tema = mengganti nilai
token; tidak ada komponen yang perlu diubah.

### 2. Selektor dan spesifisitas

`app/themes.css` di-`@import` dari `globals.css`. Aturan `@import` harus
berada di paling atas file, jadi urutan sumber tidak bisa diandalkan untuk
menentukan pemenang cascade. Karena itu tiap tema memakai selektor
ber-spesifisitas lebih tinggi:

```css
:root[data-theme="sapphire"]        { /* token mode terang  — (0,2,0) > :root  */ }
:root[data-theme="sapphire"].dark   { /* token mode gelap   — (0,3,0) > .dark   */ }
```

Konsekuensinya: **blok `.dark` sebuah tema wajib mendefinisikan ulang setiap
token yang diset blok terangnya** — disiplin yang sama seperti `.dark` untuk
Emerald. `--radius` dan token `--app-font-*` tidak berubah menurut mode, jadi
cukup ada di blok terang.

### 3. Font per tema

`app/layout.tsx` memuat empat family lewat `next/font` (Geist, Geist Mono,
Inter, Source Serif 4) dan mengekspos CSS var-nya di `<html>`.
`app/globals.css` mengarahkan `font-sans` / `font-heading` lewat lapisan
indireksi `--app-font-sans` / `--app-font-heading`, sehingga tiap
`[data-theme]` bisa menukar typeface:

- **Emerald / Slate** → Geist untuk teks & judul.
- **Sapphire** → Inter untuk teks & judul.
- **Amber** → Geist untuk teks, **Source Serif 4** untuk judul.

`next/font` melakukan self-host saat build, jadi `font-src 'self'` di CSP
tetap benar — tidak ada perubahan header.

### 4. Densitas = skala spasi global

`:root[data-density="compact"] { --spacing: 0.22rem; }` (default `0.25rem`).
Setiap utility padding/margin/gap/ukuran Tailwind v4 diturunkan dari
`--spacing`, jadi satu baris ini mengecilkan seluruh UI ~12% secara
proporsional tanpa kerja per-komponen. Dimensi layout di `config/layout.ts`
adalah nilai `rem` tetap dan sengaja tidak terpengaruh.

### 5. Tanpa kedip (no flash), tanpa mismatch hydration

- **Pra-paint:** `public/appearance-init.js` dimuat blocking di `<head>` via
  `next/script` strategi `beforeInteractive` (di `app/layout.tsx`). Script
  ini membaca dua key `localStorage` dan menaruh `data-theme` / `data-density`
  di `<html>` sebelum paint pertama. File statis same-origin (bukan inline)
  supaya tetap sesuai CSP dan aturan repo "tanpa `dangerouslySetInnerHTML`".
- **Runtime:** `hooks/use-appearance.ts` membaca atribut `<html>` lewat
  `useSyncExternalStore` — jadi tidak ada state yang perlu di-hydrate, tidak
  ada `setState` di dalam `useEffect`, dan tidak ada peringatan mismatch.
  Sama polanya dengan `hooks/use-hydrated.ts`.
- **Antar-tab:** perubahan preferensi menulis ke `localStorage` dan
  memancarkan event; tab lain ikut menyesuaikan lewat event `storage`.

> **Catatan kejujuran:** karena `beforeInteractive` tidak memblokir paint
> secara mutlak, pada kunjungan pertama yang belum ter-cache masih mungkin
> ada satu frame dengan aksen tema default. Karena background/teks tidak
> berubah antar tema merek (hanya aksen + radius + font), efeknya jauh lebih
> halus daripada kedip terang/gelap. Kunjungan berikutnya: script sudah
> ter-cache dan jalan seketika.

---

## Di mana pengguna menggantinya

| Lokasi | Kontrol |
| ------ | ------- |
| Header setiap shell | Ikon 🎨 `AppearanceMenu` (tema + densitas) dan ikon matahari/bulan `ThemeToggle` (mode) |
| `/showcase` | Panel `ThemePicker` di paling atas — kartu tema + segmented control densitas |
| `/settings` → tab **Appearance** | Dropdown tema + switch "Compact density" |

Semua kontrol menulis lewat `useAppearance` / `next-themes` yang sama, jadi
efeknya identik dari mana pun diubah.

---

## Menambah tema baru

Contoh menambah tema `rose`:

1. **Registry** — `config/theme.ts`:
   ```ts
   export type ThemeId = "emerald" | "sapphire" | "amber" | "slate" | "rose";
   // tambahkan entri ke THEMES: { id: "rose", label: "Rose", description: "...", swatch: ["#be123c", "#fb7185"] }
   ```
2. **Token** — `app/themes.css`, tambahkan dua blok:
   ```css
   :root[data-theme="rose"]      { /* --primary, --accent, --ring, --chart-*, --radius, --app-font-* ... */ }
   :root[data-theme="rose"].dark { /* definisikan ULANG setiap token di atas untuk mode gelap */ }
   ```
3. **Script pra-paint** — `public/appearance-init.js`, tambahkan `"rose"` ke
   array `THEMES` (empat–lima string, sengaja diduplikasi supaya script tetap
   trivial).
4. Selesai. Tidak ada komponen yang perlu disentuh. Jalankan
   `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.

### Daftar token yang sebaiknya di-override tiap tema

Aksen (wajib, di blok terang & gelap): `--primary`, `--primary-foreground`,
`--accent`, `--accent-foreground`, `--ring`, `--chart-1..5`,
`--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-accent`,
`--sidebar-accent-foreground`, `--sidebar-ring`.

Bentuk/tipografi (blok terang saja): `--radius`, `--app-font-sans`,
`--app-font-heading`.

Opsional (kalau tema ingin netral yang hangat/dingin): `--background`,
`--foreground`, `--card`, `--muted`, `--muted-foreground`, `--border`,
`--input`, `--secondary*`, `--sidebar*`. Amber melakukan ini; Slate hanya
menguatkan `--border` dan `--muted-foreground`.

---

## Kontras & aksesibilitas

Nilai warna keempat tema disetel untuk melewati **WCAG AA** (±4.5:1 untuk
peran teks) dan **WCAG 1.4.11** (±3:1 untuk peran grafik terhadap kartu).
Nilai ini disetel manual — **verifikasi ulang dengan pemeriksa kontras
terhadap konten final** sebelum merilis proyek klien. Slate sengaja dibuat
kontras-tinggi (border lebih tegas, teks sekunder lebih gelap/terang) untuk
klien yang mengutamakan aksesibilitas.

---

## Berkas terkait

```
config/theme.ts             Registry tema + tipe + key localStorage (data murni)
lib/theme.ts                Guard & normalisasi (teruji: lib/theme.test.ts)
hooks/use-appearance.ts     Hook runtime (useSyncExternalStore)
app/globals.css             Token Emerald + sumbu densitas + indireksi font
app/themes.css              Blok override Sapphire / Amber / Slate
public/appearance-init.js   Sinkronisasi pra-paint
app/layout.tsx              Pemuatan font + <Script beforeInteractive>
components/layout/AppearanceMenu.tsx   Switcher tema + densitas di header
```
