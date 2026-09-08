# Varian Layout

Template ini menyediakan **empat shell layout**. Semua memakai token dan
komponen yang sama — yang berbeda hanya kerangka navigasi & kontennya.

| Shell | Komponen | Route grup contoh | Untuk |
| ----- | -------- | ----------------- | ----- |
| **Sidebar dashboard** | `DashboardLayout` | `app/(dashboard)/` → `/dashboard`, `/analytics`, `/settings`, `/showcase` | Aplikasi dengan banyak section; sidebar rail yang bisa dilipat + drawer mobile + bottom nav |
| **Top-nav workspace** | `TopNavLayout` | `app/(topnav)/` → `/workspace` | Alternatif dashboard untuk section yang sedikit / nuansa lebih ringan; navigasi horizontal |
| **Marketing** | `MarketingLayout` | `app/(marketing)/` → `/`, `/pricing` | Halaman publik: landing, pricing, changelog, docs index |
| **Auth** | `AuthLayout` | `app/(auth)/` → `/sign-in`, `/sign-up`, `/forgot-password` | Layar autentikasi: kartu terpusat + panel split opsional |

Buka `/showcase` → bagian **Layout archetypes** untuk tautan langsung ke
masing-masing.

---

## `DashboardLayout` (sudah ada sebelumnya)

Tidak berubah. Sidebar persisten yang di-mount sekali dari
`app/(dashboard)/layout.tsx`. Lihat `README.md` dan `docs/standards/`.

Tambahan pada sesi ini: header-nya kini juga menampilkan `AppearanceMenu`
(tema + densitas) di samping `ThemeToggle`.

---

## `TopNavLayout`

```tsx
// app/(topnav)/layout.tsx
import { TopNavLayout } from "@/components/layout";

export default function Layout({ children }) {
  return (
    <TopNavLayout user={{ name: "Ada Lovelace", email: "ada@example.com" }}>
      {children}
    </TopNavLayout>
  );
}
```

- Membaca daftar item yang **sama** dari `config/navigation.ts`
  (`mainNavigation` di-`flatMap`).
- Navigasi horizontal di `md+`; di bawah itu tombol hamburger membuka panel
  menu (state lokal `useState`, ditutup saat item diklik — tidak ada
  `setState` di `useEffect`).
- Halaman tetap memakai `PageContainer` di dalamnya, persis seperti di
  `DashboardLayout`.
- Prop `user` opsional; tanpa itu menu akun disembunyikan — sama seperti
  `DashboardLayout`. Pada demo `/workspace` diisi user placeholder agar menu
  akun terlihat.

---

## `MarketingLayout`

```tsx
// app/(marketing)/layout.tsx
import { MarketingLayout } from "@/components/layout";

export default function Layout({ children }) {
  return (
    <MarketingLayout
      cta={{ label: "Open dashboard", href: "/dashboard" }}
      footerGroups={[ /* { title, links: [{ label, href }] } */ ]}
    >
      {children}
    </MarketingLayout>
  );
}
```

- Header sticky translusen: brand, nav (`marketingNavigation` di
  `config/navigation.ts`), `AppearanceMenu` + `ThemeToggle`, satu CTA.
- `<main>` tanpa batas lebar — tiap section halaman mengatur lebarnya
  sendiri (`max-w-6xl`, dst).
- Footer opsional dengan kolom tautan (`footerGroups`) atau baris tunggal.
- **Server component**, tanpa dependensi `motion` — sejalan dengan keputusan
  "static-first" template. `MotionProvider` tetap hanya di `(dashboard)`.
- Landing (`app/(marketing)/page.tsx`) dan Pricing
  (`app/(marketing)/pricing/page.tsx`) keduanya dibangun di atas shell ini —
  bukti shell-nya reusable, bukan sekadar bungkus satu halaman.

### Nav mobile

Saat ini link nav disembunyikan di bawah `md` (`hidden md:flex`). Menambah
sheet menu mobile adalah tindak lanjut yang direkomendasikan — lihat
`docs/analisis-dan-rekomendasi.md`.

---

## `AuthLayout`

```tsx
// app/(auth)/sign-in/page.tsx
import { AuthLayout } from "@/components/layout";
import { SignInForm } from "../auth-forms";

export default function Page() {
  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to pick up where you left off."
      footer={<>Don&apos;t have an account? <Link href="/sign-up">Create one</Link></>}
      aside={/* panel split opsional untuk lg+ */}
    >
      <SignInForm />
    </AuthLayout>
  );
}
```

- Kolom terpusat: brand mark → judul → deskripsi → form → footer.
- `aside` opsional → tata letak split-screen di `lg+` (form kiri, panel
  kanan).
- Kontrol tema di pojok kanan atas.
- **Form bersifat contoh pola saja**: input uncontrolled, tidak ada yang
  dipersistkan, `onSubmit` hanya memunculkan toast. Semua form ada di
  `app/(auth)/auth-forms.tsx` (`"use client"`), mengikuti preseden
  `settings-panels.tsx`. Sambungkan ke Server Action di aplikasi nyata.

---

## Komponen pendukung baru

| Komponen | Guna |
| -------- | ---- |
| `BrandMark` | Glyph + wordmark dari `APP_CONFIG`, dipakai marketing/auth/topnav. Sidebar punya varian sendiri yang sadar-collapse. |
| `AccountMenu` | Dropdown akun (nama, email, Profile/Settings, Sign out) — diekstrak dari `AppHeader` agar dipakai bersama `TopNavLayout`. |
| `AppearanceMenu` | Switcher tema merek + densitas untuk header semua shell. |

`Card` juga mendapat prop `variant`: `default` · `elevated` · `outlined` ·
`flat` (lihat `/showcase` → **Card variants**).

---

## Yang belum dikerjakan (tindak lanjut)

- `DocsLayout` (sidebar + daftar isi + prose).
- Sheet menu untuk nav mobile `MarketingLayout`.
- Refactor `DashboardLayout` menjadi primitive `AppShell` bersama.

Detail dan estimasi ada di `docs/analisis-dan-rekomendasi.md`.
