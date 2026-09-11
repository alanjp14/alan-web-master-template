# Arsitektur Monorepo — Frontend Next.js + Backend Bun

Dokumen ini menjelaskan perubahan struktur dari *satu app Next.js* menjadi
**monorepo pnpm** dengan frontend Next.js dan backend Bun terpisah.

---

## 1. Latar belakang

Sebelum perubahan ini, repo adalah **frontend-only**: satu aplikasi Next.js
16 (App Router) yang seluruh datanya *hard-coded* di dalam komponen. Tidak
ada API, tidak ada Server Actions, tidak ada layanan backend. Runtime &
tooling memakai Node + pnpm; tidak ada Bun sama sekali.

Kebutuhan: **frontend Next.js dikombinasikan dengan backend Bun.js.**

---

## 2. Struktur baru

```
alan-web-master-template/
├── package.json            # root workspace — skrip orkestrasi (dev/build/lint/…)
├── pnpm-workspace.yaml      # packages: apps/*, packages/*
├── tsconfig.base.json       # opsi compiler bersama
├── apps/
│   ├── web/                 # Frontend — Next.js 16, React 19 (semua kode lama pindah ke sini)
│   │   ├── package.json     # @app/web
│   │   ├── next.config.ts   # + transpilePackages: ["@app/shared"], connect-src API di CSP
│   │   ├── lib/api-client.ts        # klien fetch bertipe ke API
│   │   └── features/metrics/        # contoh: React Query → API Bun
│   └── api/                 # Backend — Hono di atas runtime Bun
│       ├── package.json     # @app/api
│       ├── src/index.ts     # entry Bun (`export default { port, fetch }`)
│       ├── src/app.ts       # Hono app: middleware (CORS, logger), route, error handler
│       ├── src/data.ts      # data contoh in-memory (ganti dengan query nyata)
│       └── src/app.test.ts  # `bun test` untuk tiap route
└── packages/
    └── shared/              # @app/shared — tipe + kontrak API, dipakai kedua app
        └── src/{index,api}.ts
```

### Kenapa monorepo (bukan dua repo / satu app)

- **Batas frontend/backend jelas** — sesuai permintaan: Next.js untuk
  frontend, Bun untuk backend, masing-masing app sendiri.
- **Tipe end-to-end** — `packages/shared` berisi bentuk request/response.
  API me-return tipe itu, web meng-consume tipe itu. Ubah satu bentuk →
  `pnpm -r typecheck` gagal di kedua sisi sekaligus.
- **Satu kali install, satu gerbang CI** — `pnpm install` di root menautkan
  semua workspace; CI menjalankan `pnpm -r lint/typecheck/test` + `pnpm build`.
- `pnpm-workspace.yaml` memang **sudah ada** sebelumnya — tinggal diaktifkan.

---

## 3. Backend: Bun + Hono

| Keputusan | Alasan |
| --------- | ------ |
| **Runtime Bun** | Permintaan eksplisit. Entry `src/index.ts` mengekspor `{ port, fetch }` — Bun menyajikannya tanpa boilerplate `Bun.serve`. |
| **Framework Hono** | Ringan, berbasis Web Standard API, porteable (Bun/Node/edge), TypeScript-first, ekosistem besar. `app.request()` memudahkan test tanpa membuka port. |
| **Tanpa database** | Konsisten dengan filosofi template. `src/data.ts` berisi data contoh; ganti fungsinya dengan Drizzle/Prisma/fetch upstream — route handler & web app tidak berubah karena tipe datang dari `@app/shared`. |
| **CORS ketat di produksi** | `API_ALLOWED_ORIGINS` di-enforce saat `NODE_ENV=production`; di dev semua origin direfleksikan. |
| **Body error seragam** | Semua respons non-2xx memakai bentuk `ApiError` (`{ error: { message, code } }`). |

### Endpoint (semua di bawah `/api/v1`)

| Method | Path        | Return (`@app/shared`) | Fungsi |
| ------ | ----------- | ---------------------- | ------ |
| GET    | `/health`   | `Health`               | Liveness, uptime, versi |
| GET    | `/stats`    | `Stat[]`               | Angka headline dashboard |
| GET    | `/activity` | `Activity`             | Deret sparkline + rincian sumber trafik |

---

## 4. Frontend: yang berubah di `apps/web`

- **`lib/api-client.ts`** — satu titik yang tahu origin API
  (`NEXT_PUBLIC_API_URL`, default `http://localhost:3001`) dan cara API
  melaporkan error (`ApiRequestError`).
- **`features/metrics/`** — modul fitur contoh: fetcher → hook React Query
  (`useStats`, `useActivity`) → komponen klien `LiveMetrics`.
- **`app/(dashboard)/dashboard/page.tsx`** — dapат satu section **"Live
  data"** yang benar-benar mengambil data dari API Bun via React Query.
  Widget lain di halaman itu tetap memakai data statis — section ini adalah
  pola yang disalin saat menyambungkan layar nyata.
- **`next.config.ts`**:
  - `transpilePackages: ["@app/shared"]` — paket shared dikirim sebagai
    TypeScript mentah (tanpa build step), jadi Next harus meng-compile-nya.
  - `connect-src` di CSP kini menyertakan origin API (diturunkan dari
    `NEXT_PUBLIC_API_URL`) — tanpa ini CSP memblokir setiap fetch ke API.

---

## 5. Skrip

Dijalankan dari **root**:

| Perintah          | Efek |
| ----------------- | ---- |
| `pnpm dev`        | Jalankan `@app/web` (:3000) dan `@app/api` (:3001) paralel |
| `pnpm dev:web` / `pnpm dev:api` | Salah satu saja |
| `pnpm build`      | Build shared → api → web, berurutan |
| `pnpm -r lint`    | ESLint di tiap workspace |
| `pnpm -r typecheck` | `tsc --noEmit` di tiap workspace |
| `pnpm -r test`    | Vitest (web) + `bun test` (api) |

Prasyarat: **Node** `^22.12 || ^24 || >=26` dan **Bun** `>= 1.4`.
`pnpm` tetap package manager workspace; `bun` hanya runtime untuk `apps/api`.

---

## 6. Deployment

- **`apps/web`** — sama seperti sebelumnya (Vercel zero-config, atau
  `next start` di Node/kontainer). Set `NEXT_PUBLIC_API_URL`,
  `NEXT_PUBLIC_APP_URL` ke origin API/web produksi **sebelum** `pnpm build`
  (di-inline saat build).
- **`apps/api`** — host apa pun yang menjalankan Bun: `bun run build` →
  `dist/index.js`, atau `bun src/index.ts` langsung. Set `API_PORT`,
  `API_ALLOWED_ORIGINS`, `API_PUBLIC_URL`, `DATABASE_URL`,
  `BETTER_AUTH_SECRET`, `NODE_ENV=production`. Cocok untuk kontainer
  (`oven/bun` base image), Railway, Fly.io, atau VM.
- Tambahkan origin Sentry ke `connect-src` bila DSN diaktifkan (lihat
  `next.config.ts`).
- Panduan langkah-demi-langkah untuk **VPS (apps/api + Postgres) + Vercel
  (apps/web)**: [docs/deploy-vps-vercel.md](deploy-vps-vercel.md).

---

## 7. Autentikasi & database (Better Auth + Drizzle + Postgres)

Ditambahkan di sesi berikutnya — jawaban atas "apakah template ini siap
dipakai untuk project Go-Live?" (lihat adendum di
[docs/analisis-dan-rekomendasi.md](analisis-dan-rekomendasi.md)).

### Kenapa Better Auth

- TypeScript-first, tidak terikat vendor (self-hosted, jalan di Bun/Hono).
- Dukungan Drizzle bawaan (`better-auth/adapters/drizzle`) — schema Postgres
  dipetakan langsung dari `apps/api/src/db/schema.ts`.
- Klien React (`better-auth/react`) memberi `useSession`, `signIn`,
  `signUp`, `signOut` yang type-safe tanpa boilerplate context/provider.

### Arsitektur cookie: proxy, bukan cross-origin

`apps/web` dan `apps/api` adalah origin berbeda (beda port di dev, sering
beda domain di produksi — mis. Vercel + VPS). Alih-alih membuat sesi
cross-site (butuh `SameSite=None; Secure`, rawan diblokir kebijakan
third-party-cookie browser), template ini memakai **Next.js rewrite**:

```
Browser → POST /api/auth/sign-in/email → (origin: apps/web)
        ↳ next.config.ts rewrites() → apps/api (server-to-server)
        ↳ Set-Cookie kembali ke browser, tampak first-party ke apps/web
```

- `apps/web/next.config.ts` — `rewrites()` memetakan `/api/auth/:path*` ke
  origin `apps/api` (dari `NEXT_PUBLIC_API_URL`).
- `apps/web/lib/auth-client.ts` — klien browser, `baseURL` = URL publik
  **web app sendiri** (`NEXT_PUBLIC_APP_URL`), bukan API.
- `apps/web/lib/auth-server.ts` — untuk Server Component/layout: fetch
  langsung ke origin API (bukan lewat rewrite — rewrite hanya berlaku untuk
  request dari browser ke server Next), meneruskan header `Cookie` apa
  adanya.

### Dua lapis proteksi route

1. **`apps/web/proxy.ts`** (dulu `middleware.ts` — lihat catatan Next 16 di
   bawah) — cek *keberadaan* cookie sesi saja (`getSessionCookie`, tanpa
   query DB), redirect ke `/sign-in?redirect=...` bila tidak ada. Cepat,
   tapi **bukan** pemeriksaan keamanan sesungguhnya — cookie palsu lolos
   tahap ini.
2. **`app/(dashboard)/layout.tsx`, `app/(topnav)/layout.tsx`** — memanggil
   `getServerSession()` (hit ke `apps/api`, yang memvalidasi ke Postgres)
   dan `redirect("/sign-in")` bila sesi tidak valid. Ini lapis yang
   sesungguhnya melindungi data.

Pola yang sama di backend: `apps/api/src/middleware/auth.ts` menyediakan
`requireAuth` — tempel ke route Hono mana pun yang butuh caller
ter-otentikasi (`GET /api/v1/me` adalah contoh referensinya).

### Catatan Next.js 16: `middleware.ts` → `proxy.ts`

Next 16 mengganti nama konvensi file `middleware.ts` menjadi `proxy.ts`
(fungsi `middleware()` → `proxy()`) — lihat
`apps/web/node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`.
Proxy juga kini default ke runtime Node.js (dulu Edge), tapi pola
"cek cookie saja, validasi sesungguhnya di layout" tetap yang disarankan
Better Auth — query DB per-request di setiap route tetap mahal meski
runtime-nya sudah Node.

### Skema database

Empat tabel inti Better Auth di `apps/api/src/db/schema.ts`: `user`,
`session`, `account`, `verification` — ditulis tangan agar sama persis
dengan yang dihasilkan `@better-auth/cli generate`. Migrasi SQL di
`apps/api/drizzle/`, dikelola `drizzle-kit` (lihat `apps/api/README.md`
bagian Database). Tambahkan tabel domain Anda sendiri sebagai file baru di
`apps/api/src/db/`.

### Yang belum ada (sengaja)

- **Pengiriman email** untuk reset password / verifikasi email —
  `emailAndPassword.sendResetPassword` di `apps/api/src/auth.ts` belum
  dikonfigurasi, mengikuti pola "dorman sampai dikonfigurasi" yang sama
  dengan Sentry/Clarity (lihat `docs/MONITORING.md`).
- **OAuth / SSO** — tinggal tambah `socialProviders` di `auth.ts`; skema
  `account` sudah menampungnya.
- **Role/permission** — Better Auth punya plugin `admin`/`organization`
  untuk ini bila dibutuhkan.

---

## 8. Langkah lanjutan yang disarankan

1. ~~Ganti `apps/api/src/data.ts` dengan sumber data nyata~~ — `/stats` dan
   `/activity` masih data contoh; auth (§7) sudah memakai Postgres nyata.
   Ganti `data.ts` saat menambah fitur produk sungguhan.
2. ~~Tambah autentikasi~~ — selesai (§7). Lanjutkan dengan verifikasi email
   dan/atau OAuth sesuai kebutuhan client project.
3. Pertimbangkan **Hono RPC** (`hc<typeof app>`) untuk klien yang tipenya
   diturunkan langsung dari definisi route, menggantikan `lib/api-client.ts`
   manual.
4. Tambah `@app/api` ke pipeline deploy (CI saat ini hanya memvalidasi).
