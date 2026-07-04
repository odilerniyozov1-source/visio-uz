# VISIO — 2D rejadan sotuvga tayyor 3D render, 24 soatda

**VISIO** — qurilish kompaniyalari uchun AI vizualizatsiya platformasi. 2D qavat rejasidan fotorealistik 3D render va marketing paketigacha — 24 soatda, frilanserdan 2× arzon.

Gibrid model: **AI generatsiya qiladi, professional dizayner sifatni kafolatlaydi.**

---

## Texnologiya stacki

| Qatlam | Texnologiya |
|---|---|
| Frontend | Next.js 16 (App Router) + React 19 + TypeScript strict |
| Styling | Tailwind CSS 4 + shadcn/ui (New York) + Framer Motion |
| Backend | Next.js Route Handlers (monolit) |
| DB | SQLite + Prisma ORM (spec PostgreSQL so'raydi, lekin muhit SQLite'ga moslashtirildi) |
| Auth | Custom HMAC-signed cookie session (telefon + SMS OTP) |
| Charts | Recharts |
| To'lov | Payme + Click + Uzum (MOCK webhook handlerlar, imzo tekshiruvi bilan) |
| Render | RunPod/ComfyUI (MOCK — 30 soniyada placeholder variantlar) |
| Xabarnoma | Telegram Bot API + SMS Eskiz.uz (MOCK) |

---

## O'rnatish

```bash
# 1. Bog'liqliklar (o'rnatilgan)
bun install

# 2. DB yaratish + seed
bun run db:push
bun run prisma/seed.ts

# 3. Dev server
bun run dev  # http://localhost:3000
```

---

## Demo login ma'lumotlari

Seed data 3 ta rol uchun tayyor hisoblar yaratadi. **OTP kodi: `123456`** (dev demo kodi) yoki MOCK rejimda kodi UI'da ko'rinadi.

| Rol | Telefon | Ism |
|---|---|---|
| **Admin** | +998901234567 | Sardor Karimov |
| **Dizayner** | +998902345678 | Dilnoza Yusupova |
| **Mijoz** | +998911112233 | Bekzod Tursunov (Toshkent Qurilish, PRO tarifi) |
| Mijoz 2 | +998922223344 | Madina Azizova (Samarqand Rieltor, START) |
| Mijoz 3 | +998933334455 | Otabek Yusupov (PAYG) |
| Dizayner 2 | +998903456789 | Akmal Rahimov |

**Tezkor kirish:** Auth sahifasida "Demo kirish" blokida 3 ta tugma — bir bosishda kirish.

---

## MOCK rejim

Barcha tashqi servislar env kalitlarsiz MOCK rejimda ishlaydi. Admin panelda "MOCK rejim" belgisi ko'rinadi.

| Servis | MOCK xatti-harakati | Realga o'tish |
|---|---|---|
| **SMS (Eskiz.uz)** | OTP kodi konsolga + UI toast'ga chiqadi | `ESKIZ_EMAIL` + `ESKIZ_PASSWORD` env |
| **Fayl saqlash (R2)** | Lokal `uploads/` papkasiga saqlanadi | `R2_ACCOUNT_ID` + `R2_ACCESS_KEY_ID` + `R2_SECRET_ACCESS_KEY` env |
| **Telegram bot** | Xabarnomalar konsolga log qilinadi | `TELEGRAM_BOT_TOKEN` + `TELEGRAM_ADMIN_CHAT_ID` env |
| **Payme/Click** | "Test to'landi" tugmasi bilan to'lov qayd qilinadi | `PAYME_MERCHANT_ID` + `PAYME_KEY` / `CLICK_MERCHANT_ID` + `CLICK_SERVICE_ID` + `CLICK_SECRET_KEY` env |
| **RunPod AI render** | Dispatch → 30 soniyada 4 placeholder AI variant | `RUNPOD_API_KEY` + `RUNPOD_ENDPOINT_ID` + `RENDER_WEBHOOK_SECRET` env |

**Qoida:** har qanday tashqi servis kaliti yo'q bo'lsa — ilova yiqilmasdan MOCK rejimda ishlaydi.

---

## Arxitektura qarorlari

### 1. Yagona sahifa (SPA) — `/`
Muhit cheklovi tufayli foydalanuvchi faqat `/` route'ni ko'radi. Butun SaaS Zustand store orqali view-routing bilan bitta sahifada: landing → auth → client cabinet / designer studio / admin panel.

### 2. SQLite moslashtirish
Spec PostgreSQL so'raydi, lekin muhit SQLite ishlatadi. Prisma sxema moslashtirildi:
- `enum` → `String` (app-level Zod validatsiya bilan)
- `String[]` → `String` (JSON-encoded array)
- `@default(autoincrement())` non-id maydon → kodda `max+1` bilan boshqariladi

### 3. Manual-first (eng muhim tamoyil)
Butun tizim AI'siz to'liq ishlaydi: mijoz buyurtma beradi → dizayner fayl yuklab yetkazadi → mijoz oladi. AI (RunPod) faqat MOCK interfeys — dispatch qilganda 30 soniyada 4 placeholder variant. Real kalit ulanganda kod o'zgarmasligi kerak.

### 4. Xavfsizlik
- **Zod** validatsiyasi har API input'da
- **RBAC** har API route'da (UI emas!) — `requireRole()` helper
- **IDOR himoyasi** — mijoz faqat o'z buyurtmasini ko'radi
- **Narx server tomonda** — frontend narxni yubormaydi, server `plan + type` bo'yicha hisoblaydi
- **Webhook imzo tekshiruvi** — Payme (Basic auth), Click (MD5 sign), RunPod (secret header)
- **Fayl yuklash** — magic-byte detection (MIME'ga ishonmaymiz, chunki kengaytma yolg'on gapiradi), 25MB limit
- **Signed URL** — private fayllar uchun 15 daqiqa amal qiluvchi HMAC-signed havola
- **Watermark** — to'lanmagan renderlarda diagonal "VISIO" (sharp bilan)

---

## API route'lari

| Endpoint | Metod | Vazifa |
|---|---|---|
| `/api/auth/otp/send` | POST | SMS OTP yuborish (MOCK) |
| `/api/auth/otp/verify` | POST | OTP tekshirish → session |
| `/api/auth/me` | GET/DELETE | Joriy foydalanuvchi / chiqish |
| `/api/leads` | POST | Demo so'rov |
| `/api/styles` | GET | Stil katalogi |
| `/api/upload` | POST | Fayl yuklash (magic-byte check) |
| `/api/orders` | GET/POST | Buyurtmalar ro'yxati / yaratish |
| `/api/orders/[id]` | GET/PATCH | Detal / status yangilash |
| `/api/orders/[id]/assets` | POST | Dizayner fayl yuklash |
| `/api/orders/[id]/deliver` | POST | Yetkazib berish |
| `/api/orders/[id]/assign` | POST | Dizaynerga biriktirish (admin) |
| `/api/orders/[id]/revision` | POST | Tahrir so'rash (mijoz) |
| `/api/payments/payme` | POST | Payme webhook (JSON-RPC, Basic auth) |
| `/api/payments/click` | POST | Click webhook (MD5 sign) |
| `/api/payments/test` | POST | MOCK "test to'landi" |
| `/api/files/[key]` | GET | Signed URL fayl yuklab olish |
| `/api/admin/kpi` | GET | KPI dashboard |
| `/api/admin/orders` | GET | Barcha buyurtmalar |
| `/api/admin/clients` | GET | Mijozlar CRM |
| `/api/admin/designers` | GET | Dizaynerlar yuklamasi |
| `/api/admin/leads` | GET | Leadlar |
| `/api/render/dispatch` | POST | AI render dispatch (MOCK) |
| `/api/render/webhook` | POST | RunPod natija webhook (MOCK) |

---

## Qat'iycha taqiqlar (spec §1 — bajarilgan)

- ✅ Soxta testimonial / reyting yo'q — "Beta dasturi" bloki
- ✅ Dollar narxlar yo'q — faqat so'm (probel bilan: `1 900 000 so'm`)
- ✅ Stripe yo'q — faqat Payme, Click, Uzum
- ✅ "$1M ARR 18 oyda", "0 raqobatchi" da'volari yo'q
- ✅ "Production Ready" yolg'oni yo'q — "AI + professional dizayner" halol ko'rsatilgan
- ✅ Kritik ma'lumot uchun localStorage ishlatilmaydi — hammasi DB'da
- ✅ Sinxron render API yo'q — mock queue + webhook + status polling

---

## Test qilingan oqimlar (agent-browser bilan)

1. ✅ Landing sahifa to'liq renderlanadi (hero, muammo/yechim, qanday ishlaydi, oldin/keyin slayder, ROI kalkulyator, narxlar, beta bloki, FAQ, lead forma)
2. ✅ Mobil (375px) va desktop (1440px) responsive
3. ✅ Auth: telefon + OTP, demo quick-login 3 rol uchun
4. ✅ Mijoz: 4 qadamli buyurtma wizard (xizmat → fayl → stil → to'lov), kredit balansidan to'lash, buyurtma yaratiladi (#1006)
5. ✅ Mijoz: buyurtma detal (status timeline, yuklangan fayllar)
6. ✅ Dizayner: navbat (SLA rangli), workspace, render yuklash, yetkazib berish → DELIVERED
7. ✅ Admin: KPI dashboard (MRR 6.8M so'm, SLA 16.3 soat, grafiklar), buyurtmalar jadvali (biriktirish combobox)

---

## Fayl strukturasi

```
src/
  app/
    page.tsx                    # SPA entry — AppShell
    layout.tsx                  # Root layout
    globals.css                 # VISIO brend theme (slate + amber)
    api/                        # Route Handlers (see API table)
  components/
    visio/                      # AppShell, Header, Footer, shared
    landing/                    # Landing page sections
    auth/                       # Auth screen (phone+OTP, demo)
    client/                     # Client cabinet (orders, wizard, detail, payments, settings)
    designer/                   # Designer studio (queue, workspace, stats)
    admin/                      # Admin panel (kpi, orders, clients, designers, leads, payments)
    ui/                         # shadcn/ui components
  lib/
    constants.ts                # Rollar, statuslar, stillar, narxlar, SLA
    format.ts                   # UZS format, sana, SLA countdown
    validations.ts              # Zod sxemalar
    session.ts                  # HMAC-signed cookie session
    auth.ts                     # getCurrentUser, requireRole (RBAC)
    pricing.ts                  # Server-side narx hisoblash
    storage.ts                  # Local MOCK / R2 file storage + magic-byte
    watermark.ts                # sharp watermark
    sms.ts                      # MOCK SMS OTP
    telegram.ts                 # MOCK Telegram bot
    orders.ts                   # Order number, status transitions, audit
    api.ts                      # Frontend API client
    db.ts                       # Prisma client
  store/
    app.ts                      # Zustand: auth + view routing
prisma/
  schema.prisma                 # SQLite-adapted schema
  seed.ts                       # Demo data
public/images/                  # AI-generated landing images
scripts/gen-images.sh           # Image generation script
```

---

## QAROR: qoidalar

1. **PostgreSQL → SQLite:** Muhit cheklovi. Enum va array maydonlar moslashtirildi, funksional ekvivalent.
2. **NextAuth → custom session:** Telefon+OTP flow uchun NextAuth ortiqcha. HMAC-signed cookie sodda va ishonchli.
3. **Cloudflare R2 → local uploads:** Sandbox'da R2 kalitlari yo'q. `storage.ts` abstraksiya — R2 kalitlari ulansa, kod o'zgarmsiz.
4. **BullMQ/Redis → setTimeout mock:** Render queue BullMQ talab qiladi, lekin sandbox'da Redis yo'q. `setTimeout` MOCK bilan interfeys tayyor.
5. **next-intl → hard-coded uz:** SPA tuzilishi'da next-intl ortiqcha. Barcha matn uz'da, ru switcher UI'da bor (tarjima keyin qo'shiladi).

---

© 2026 VISIO · Toshkent, O'zbekiston
