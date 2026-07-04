# VISIO — Production Deploy Guide

To'liq, bosqichma-bosqich deploy yo'riqnomasi. ~15 daqiqa.

---

## ⚠️ Muhim: SQLite → PostgreSQL

**Muammo:** Vercel serverless ephemeral filesystem — SQLite `file:./db` **ishlamaydi** (har so'rov yangi container, fayl yo'qoladi).

**Yechim:** PostgreSQL (Neon bepul). Loyiha Prisma sxemasi allaqachon SQLite'ga moslashtirilgan (enum→String, array→JSON) — **PostgreSQL'da ham xuddi shunday ishlaydi**, faqat `provider` almashtiramiz.

---

## BOSQICH 1 — Neon PostgreSQL (bepul, 2 daqiqa)

1. https://neon.tech ga kiring (GitHub bilan)
2. "New Project" → nomi: `visio` → region: `Frankfurt` (Vercel fra1 ga yaqin)
3. Project yaratilgach, dashboard'da "Connection string" ni nusxalang:
   ```
   postgresql://visio:xxxxxx@ep-xxx-pooler.eu-central-1.aws.neon.tech/visio?sslmode=require
   ```

---

## BOSQICH 2 — GitHub repo (1 daqiqa)

```bash
# Lokal kompyuteringizda (sandbox emas):
cd /path/to/visio-project
git init && git add -A && git commit -m "VISIO production"
git branch -M main
gh repo create visio-uz --public --source=. --push
# Yoki GitHub'da qo'lda yarating, keyin:
git remote add origin git@github.com:USERNAME/visio-uz.git
git push -u origin main
```

---

## BOSQICH 3 — Vercel deploy (5 daqiqa)

### 3.1. Vercel.com → "Add New Project" → GitHub repo'ni tanlang

### 3.2. Environment Variables (MAJBURIY):

Vercel dashboard → Settings → Environment Variables:

| Key | Value | Muhimlik |
|---|---|---|
| `DATABASE_URL` | `postgresql://...neon.tech/visio?sslmode=require` | **MAJBURIY** |
| `NEXT_PUBLIC_APP_URL` | `https://visio-uz.vercel.app` | MAJBURIY |
| `NEXTAUTH_SECRET` | `openssl rand -hex 32` (32-char random) | MAJBURIY |
| `MOCK_MODE` | `false` | MAJBURIY |

Ixtiyoriy (keyin qo'shasiz):
- `R2_*` (Cloudflare fayl saqlash — bo'lmasa local `/uploads` ishlaydi, lekin Vercel'da yo'q)
- `ESKIZ_*` (SMS — bo'lmasa MOCK OTP UI'da ko'rinadi)
- `TELEGRAM_*` (bot — bo'lmasa konsol log)
- `PAYME_*`, `CLICK_*` (to'lov — bo'lmasa "test to'landi" tugmasi)
- `RUNPOD_*` (AI render — bo'lmasa MOCK 30s variant)

### 3.3. Build sozlamalari (avtomatik `vercel.json`'dan):

- Framework: Next.js (auto-detected)
- Build Command: `bun run build`
- Install Command: `bun install`
- Output: `.next`

### 3.4. Deploy tugmasini bosing

Build ~2 daqiqa. Log'da:
```
✓ Compiled successfully
ƒ Proxy (Middleware)
```

---

## BOSQICH 4 — Database schema + seed (2 daqiqa)

Vercel deploy bo'lgach, **lokal kompyuteringizdan** (DATABASE_URL = Neon):

```bash
# PostgreSQL schema'ga o'tish
bun run db:switch-postgres

# Schema'ni Neon'ga push qilish
DATABASE_URL="postgresql://...neon.tech/visio?sslmode=require" bun run db:push

# Demo ma'lumotlarni yuklash
DATABASE_URL="postgresql://...neon.tech/visio?sslmode=require" bun run seed

# Lokal schema'ni tiklash (keyingi dev uchun)
bun run db:switch-sqlite
```

Neon dashboard → Tables — 6 user, 6 order, 6 style ko'rasiz.

---

## BOSQICH 5 — Fayl saqlash (Cloudflare R2, 3 daqiqa)

Vercel ephemeral — yuklangan fayllar yo'qoladi. R2 kerak.

1. https://dash.cloudflare.com → R2 → "Create bucket" → `visio-assets`
2. R2 → Manage API tokens → "Create API token" → permissions: Object Read & Write
3. Vercel env qo'shing:
   - `R2_ACCOUNT_ID` (Cloudflare account ID)
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`
   - `R2_BUCKET` = `visio-assets`
4. Redeploy

**Muhim:** `src/lib/storage.ts` avtomatik R2'ga o'tadi (env kalitlar bo'lsa). MOCK rejim emas.

---

## BOSQICH 6 — Real to'lov (Payme/Click)

### Payme Business:
1. https://payme.uz → Business → API
2. `PAYME_MERCHANT_ID` va `PAYME_KEY` oling
3. Vercel env qo'shing
4. Payme dashboard → Webhook URL: `https://visio-uz.vercel.app/api/payments/payme`

### Click:
1. https://click.uz → Business
2. `CLICK_MERCHANT_ID`, `CLICK_SERVICE_ID`, `CLICK_SECRET_KEY`
3. Vercel env qo'shing
4. Click dashboard → Service URL: `https://visio-uz.vercel.app/api/payments/click`

**Validatsiya:** `/api/payments/payme` noto'g'ri imzo bilan 403 qaytaradi (allaqachon kodlangan).

---

## BOSQICH 7 — Telegram bot (ixtiyoriy)

1. @BotFather → `/newbot` → token oling
2. Vercel env: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ADMIN_CHAT_ID` (o'zingizning Telegram ID)
3. Webhook o'rnating:
   ```
   https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://visio-uz.vercel.app/api/telegram/webhook
   ```

---

## Tekshiruv (deploy'dan keyin)

```bash
# 1. Sahifa ochiladi
curl -I https://visio-uz.vercel.app/
# HTTP/2 200

# 2. API ishlaydi
curl https://visio-uz.vercel.app/api/styles
# {"styles":[...]}

# 3. Security headerlar
curl -I https://visio-uz.vercel.app/ | grep -iE "x-frame|x-content|referrer"
# x-frame-options: DENY
# x-content-type-options: nosniff

# 4. Demo login (browser)
# https://visio-uz.vercel.app/#auth
# +998911112233, kod 123456 (agar MOCK_MODE=true) yoki real SMS (MOCK_MODE=false)
```

---

## Muqobil: Railway (Vercel o'rniga)

Agar Vercel istamasangiz — Railway PostgreSQL bilan birga:

```bash
railway login
railway init
railway add postgresql
railway up
```

`railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": { "builder": "NIXPACKS" },
  "deploy": {
    "startCommand": "bun .next/standalone/server.js",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

---

## Muqobil: O'z serveringiz (VPS + Caddy + PM2)

```bash
# Serverda:
git clone https://github.com/USERNAME/visio-uz.git
cd visio-uz && bun install
bun run db:switch-postgres && bun run db:push
bun run build
pm2 start "bun .next/standalone/server.js" --name visio

# Caddyfile
visio.uz {
  reverse_proxy localhost:3000
}
```

---

## Xatolik hal qilish

| Xato | Yechim |
|---|---|
| `PrismaClientInitializationError` | `DATABASE_URL` Neon'dan to'g'ri nusxalandimi? `?sslmode=require` bor? |
| `Cannot find module '.prisma/client'` | Vercel build log'da `postbuild: prisma generate` ishladi? |
| 405 / API xato | Vercel functions log'ini tekshiring (dashboard → Functions → Logs) |
| Fayl yuklash 500 | `R2_*` env to'g'ri? Bucket public yoki signed URL ishlatilmoqda? |
| "MOCK rejim" ko'rinmoqda | `MOCK_MODE=false` qo'ydingizmi? Vercel env Production ga tegishli? |

---

## Deploy checklist

- [ ] Neon DB yaratildi
- [ ] GitHub repo push qilindi
- [ ] Vercel project ulandi
- [ ] 4 majburiy env o'rnatildi
- [ ] Build muvaffaqiyatli
- [ ] `db:push` Neon'ga schema yukladi
- [ ] `seed` demo data yukladi
- [ ] Sahifa 200 qaytardi
- [ ] Demo login ishladi
- [ ] R2 ulandi (fayl yuklash uchun)
- [ ] Payme/Click webhook test qilindi
- [ ] Telegram bot xabarnoma yubordi

---

© 2026 VISIO
