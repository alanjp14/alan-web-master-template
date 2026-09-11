# Deploy: `apps/api` di VPS, `apps/web` di Vercel

Panduan praktis menghubungkan kedua bagian template ini ke infrastruktur
yang sudah umum dipakai: backend (Bun + Postgres) di VPS milik sendiri,
frontend (Next.js) di Vercel. Latar belakang arsitektur ada di
[arsitektur-monorepo.md](arsitektur-monorepo.md).

Urutan **wajib**: deploy API dulu (butuh domain/IP tetap sebelum web
di-build), baru web.

---

## 1. VPS — `apps/api`

Prasyarat di VPS: Bun ≥ 1.4, Postgres (self-hosted atau managed —
Neon/Supabase/RDS semua cocok, tinggal ganti `DATABASE_URL`), reverse proxy
dengan TLS (Nginx/Caddy), dan akses git ke repo (atau `rsync`/CI deploy).

### 1.1 Ambil kode & install

```bash
git clone <repo-anda> app && cd app
curl -fsSL https://bun.sh/install | bash   # jika Bun belum ada
corepack enable                             # pnpm, untuk install workspace
pnpm install --frozen-lockfile
```

### 1.2 Postgres

Pakai Postgres yang sudah berjalan di VPS, atau jalankan yang baru:

```bash
docker compose up -d db   # lihat docker-compose.yml — port 55432 secara default
# atau gunakan instance Postgres VPS Anda sendiri dan lewati baris di atas
```

### 1.3 Environment (`apps/api/.env`)

```bash
API_PORT=3001
# Domain publik API ini — lewat reverse proxy, bukan localhost
API_PUBLIC_URL=https://api.domainanda.com
# Origin web yang boleh memanggil API ini
API_ALLOWED_ORIGINS=https://app.domainanda.com
DATABASE_URL=postgres://user:password@localhost:5432/dbname
# openssl rand -base64 32
BETTER_AUTH_SECRET=<nilai-acak-32-byte>
NODE_ENV=production
```

`NODE_ENV=production` mengaktifkan validasi: proses **menolak start** tanpa
`DATABASE_URL` dan `BETTER_AUTH_SECRET` — lihat `apps/api/src/env.ts`.

### 1.4 Migrasi & build

```bash
pnpm --filter @app/api db:migrate
pnpm --filter @app/api build     # → apps/api/dist/index.js
```

### 1.5 Jalankan sebagai service (systemd)

`/etc/systemd/system/app-api.service`:

```ini
[Unit]
Description=app API (Bun + Hono)
After=network.target postgresql.service

[Service]
Type=simple
WorkingDirectory=/path/to/app/apps/api
EnvironmentFile=/path/to/app/apps/api/.env
ExecStart=/home/deploy/.bun/bin/bun run dist/index.js
Restart=on-failure
User=deploy

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
systemctl enable --now app-api
systemctl status app-api
```

(PM2 juga cocok: `pm2 start dist/index.js --interpreter bun --name app-api`.)

### 1.6 Reverse proxy + TLS (Caddy — paling sedikit konfigurasi)

```
api.domainanda.com {
	reverse_proxy localhost:3001
}
```

Caddy mengurus sertifikat TLS otomatis. Untuk Nginx + certbot, proxy biasa
ke `127.0.0.1:3001` dengan header `Host`/`X-Forwarded-*` diteruskan.

### 1.7 Verifikasi

```bash
curl https://api.domainanda.com/api/v1/health
```

---

## 2. Vercel — `apps/web`

### 2.1 Import project

Di Vercel: **Add New → Project**, pilih repo ini. Karena ini monorepo:

- **Root Directory**: `apps/web`
- **Build Command**: biarkan default (`pnpm build`, atau `next build` jika
  Vercel tidak mendeteksi workspace secara otomatis)
- **Install Command**: biarkan default — Vercel menjalankan `pnpm install`
  dari root workspace secara otomatis saat Root Directory diset

### 2.2 Environment variables

**Project → Settings → Environment Variables**, untuk *Production*
(dan *Preview* bila perlu):

```
NEXT_PUBLIC_API_URL=https://api.domainanda.com
NEXT_PUBLIC_APP_URL=https://app.domainanda.com
```

Keduanya `NEXT_PUBLIC_` → dibaca saat **build**, ikut ter-inline ke bundle.
Set sebelum deploy pertama; ubah nilai → redeploy untuk berlaku.

Tambahkan juga `NEXT_PUBLIC_SENTRY_DSN` / `NEXT_PUBLIC_CLARITY_PROJECT_ID`
bila dipakai (lihat [MONITORING.md](MONITORING.md)).

### 2.3 Deploy

Push ke branch yang terhubung (biasanya `main`). Vercel build otomatis.

### 2.4 Selesaikan lingkaran CORS/CSP

Setelah domain web final diketahui, **update balik** `apps/api/.env`:

```bash
API_ALLOWED_ORIGINS=https://app.domainanda.com
```

lalu `systemctl restart app-api`. Tanpa ini, permintaan browser dari domain
Vercel ke API akan ditolak CORS (lihat `apps/api/src/app.ts`).

CSP di `apps/web/next.config.ts` (`connect-src`) sudah otomatis menyertakan
origin dari `NEXT_PUBLIC_API_URL` — tidak perlu ubah manual, cukup pastikan
env var di atas benar sebelum build.

---

## 3. Checklist verifikasi end-to-end

```
□ curl https://api.domainanda.com/api/v1/health              → 200
□ Buka https://app.domainanda.com/sign-up, buat akun           → redirect ke /dashboard
□ Panel "Live data" di /dashboard terisi (bukan skeleton kosong)
□ Sign out dari account menu                                   → redirect ke /sign-in
□ Akses langsung https://app.domainanda.com/dashboard (belum login)
                                                                 → redirect ke /sign-in
□ DevTools → Network: request ke /api/auth/* memakai origin app.domainanda.com
  (bukan langsung ke api.domainanda.com) — bukti proxy cookie bekerja
```

---

## 4. Project yang sudah Go-Live — cara mengadopsi tanpa downtime

Jika Anda punya aplikasi lama yang ingin dipindah ke template ini:

1. **Backend dulu, terpisah dari trafik produksi.** Deploy `apps/api` di
   domain/sub-domain baru (`api-v2.domainanda.com`), migrasikan data lama ke
   skema baru (tulis skrip migrasi terpisah — di luar cakupan template ini),
   verifikasi paralel dengan backend lama.
2. **Frontend di preview dulu.** Deploy `apps/web` ke Vercel preview
   (`NEXT_PUBLIC_API_URL` mengarah ke `api-v2`), uji penuh sebelum
   mengarahkan domain produksi.
3. **Cutover DNS/domain** setelah checklist §3 lolos di preview.
4. **Auth pengguna lama**: Better Auth tidak otomatis mengimpor hash
   password dari sistem lain — rencanakan salah satu dari: (a) minta semua
   pengguna reset password sekali (paling sederhana, tapi perlu email
   sender aktif — lihat §7 `arsitektur-monorepo.md`), atau (b) tulis
   adapter migrasi hash bila algoritma sumber kompatibel (di luar cakupan
   template).
