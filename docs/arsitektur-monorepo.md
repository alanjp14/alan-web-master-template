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
  `next start` di Node/kontainer). Set `NEXT_PUBLIC_API_URL` ke origin API
  produksi **sebelum** `pnpm build` (di-inline saat build).
- **`apps/api`** — host apa pun yang menjalankan Bun: `bun run build` →
  `dist/index.js`, atau `bun src/index.ts` langsung. Set `API_PORT`,
  `API_ALLOWED_ORIGINS`, `NODE_ENV=production`. Cocok untuk kontainer
  (`oven/bun` base image), Railway, Fly.io, atau VM.
- Tambahkan origin Sentry ke `connect-src` bila DSN diaktifkan (lihat
  `next.config.ts`).

---

## 7. Langkah lanjutan yang disarankan

1. Ganti `apps/api/src/data.ts` dengan sumber data nyata (DB / service).
2. Tambah autentikasi: middleware Hono untuk verifikasi token di `apps/api`,
   dan proteksi route sisi-server di `apps/web`.
3. Pertimbangkan **Hono RPC** (`hc<typeof app>`) untuk klien yang tipenya
   diturunkan langsung dari definisi route, menggantikan `lib/api-client.ts`
   manual.
4. Tambah `@app/api` ke pipeline deploy (CI saat ini hanya memvalidasi).
