# HOLANU — Panduan Deploy Lengkap

## Prasyarat
- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Wrangler CLI (`npm install -g wrangler`)
- Akun Cloudflare (gratis)
- Akun Vercel (gratis)

---

## STEP 1 — Deploy Cloudflare Workers + D1

```bash
# Masuk ke folder workers
cd workers

# Login ke Cloudflare
wrangler login

# Buat D1 database (jika belum ada)
wrangler d1 create holanu-db
# Salin database_id yang muncul ke wrangler.toml (sudah terisi)

# Jalankan migrasi schema database
wrangler d1 execute holanu-db --file=schema.sql --remote

# Set secret (private key — JANGAN masukkan ke wrangler.toml)
wrangler secret put IMAGEKIT_PRIVATE_KEY
# → masukkan: private_6HQhYxDQ8lEJ2vGLxTbDwwNOnR0=

wrangler secret put CLERK_SECRET_KEY
# → masukkan: sk_test_tTbxvkBaZq1CYZZNBLhg6Su1GBUJjpJfgwYz8FoUhM

# Deploy Workers
wrangler deploy
# Catat URL yang muncul: https://holanu-api.SUBDOMAIN.workers.dev
```

---

## STEP 2 — Update .env dengan Workers URL

Buka file `.env` di root project, pastikan:
```
NEXT_PUBLIC_API_URL=https://holanu-api.SUBDOMAIN.workers.dev
```
Ganti `SUBDOMAIN` dengan subdomain Cloudflare kamu.

---

## STEP 3 — Deploy Frontend ke Vercel

```bash
# Di root project (bukan folder workers)
cd ..

# Install dependencies
pnpm install

# Test build lokal dulu
pnpm build

# Deploy ke Vercel
npx vercel --prod
```

Saat Vercel meminta environment variables, masukkan semua isi dari file `.env`.

Atau lewat Vercel Dashboard:
1. Buka vercel.com → Import project dari GitHub
2. Di Settings → Environment Variables → tambahkan semua dari `.env`
3. Redeploy

---

## STEP 4 — Update CORS untuk domain production

Setelah dapat domain Vercel (misal `holanu.vercel.app`), update `wrangler.toml`:
```toml
[vars]
CORS_ORIGIN = "https://holanu.vercel.app"
```
Lalu redeploy Workers:
```bash
cd workers && wrangler deploy
```

---

## STEP 5 — Setup Clerk

1. Buka [dashboard.clerk.com](https://dashboard.clerk.com)
2. Di aplikasi kamu → **Configure** → **Paths**:
   - Sign-in URL: `/masuk`
   - Sign-up URL: `/daftar`
   - After sign-in: `/dashboard`
   - After sign-up: `/dashboard`
3. Di **JWT Templates** → buat template baru bernama `default`
4. Untuk set role admin: di **Users** → pilih user → **Metadata** (Public) → tambahkan `{"role": "admin"}`

---

## Troubleshooting

### API 401 Unauthorized
→ Pastikan Clerk publishable key sudah benar di `.env`
→ Pastikan user sudah login sebelum melakukan aksi write

### API 403 Forbidden (admin)
→ Pastikan metadata user di Clerk sudah diset: `{"role": "admin"}`

### Upload foto gagal
→ Pastikan `IMAGEKIT_PRIVATE_KEY` sudah di-set via `wrangler secret put`
→ Cek di Cloudflare Dashboard → Workers → holanu-api → Settings → Variables

### CORS error
→ Update `CORS_ORIGIN` di wrangler.toml dengan domain Vercel kamu
→ Redeploy Workers

### Build error TypeScript
→ Jalankan `pnpm tsc --noEmit` untuk melihat semua error
→ Semua type error harus diperbaiki (ignoreBuildErrors sudah dihapus)

---

## PENTING: File yang TIDAK boleh di-commit ke GitHub

File `.env` sudah ditambahkan ke `.gitignore`.
**Jangan pernah commit file `.env` ke repository!**

Untuk deploy di Vercel, masukkan environment variables via:
- Vercel Dashboard → Project → Settings → Environment Variables
- Atau via CLI: `vercel env add NAMA_VAR`

---

## Set Admin Role

Untuk membuat akun admin, login dulu ke akun tersebut, lalu:
1. Buka Clerk Dashboard → Users → pilih user
2. Klik tab "Metadata" → Public Metadata
3. Isi: `{"role": "admin"}`
4. Save → logout → login ulang

---

## Checklist Pre-Launch

- [ ] Workers deployed & health check OK: `curl https://holanu-api.xxx.workers.dev/health`
- [ ] D1 schema migrated: `wrangler d1 execute holanu-db --file=schema.sql --remote`
- [ ] Secrets set: `wrangler secret list`
- [ ] CORS_ORIGIN updated di wrangler.toml dengan domain Vercel/custom domain
- [ ] Vercel env vars semua terisi
- [ ] Test login/register via Clerk
- [ ] Test tambah listing end-to-end
- [ ] Test upload foto via ImageKit
- [ ] Test AI chatbot via Groq
