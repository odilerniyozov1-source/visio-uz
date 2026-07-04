# VISIO — TO'LIQ BUILD SPETSIFIKATSIYASI (z.ai uchun MASTER PROMPT)

**Versiya:** 3.0 (Master Hujjat v2.0 asosida jamlangan) · **Sana:** 2026-yil 3-iyul
**Maqsad:** Ushbu hujjatning O'ZI to'liq texnik topshiriq. Uni o'qib, VISIO platformasini boshidan oxirigacha qurish mumkin.

---

# 0. LOYIHA KIMLIGI (bir jumlada)

**VISIO** — qurilish kompaniyalari uchun sotuvni tezlashtiruvchi vizual konveyer: **2D rejadan sotuvga tayyor fotorealistik 3D render va marketing paketigacha — 24 soatda, frilanserdan 2× arzon.**

- **Bozor:** O'zbekiston (keyin Qozog'iston). Til: **uz (asosiy) + ru**. Valyuta: **UZS (so'm)**.
- **Ideal mijoz (ICP):** Toshkent va viloyatlardagi o'rta qurilish kompaniyalari (yiliga 1–5 bino). 2-bosqich: rieltorlar, dizaynerlar, uy egalari.
- **Yetkazib berish modeli:** Gibrid "AI + inson" — AI (ComfyUI + SDXL/Flux + ControlNet) generatsiya qiladi, professional dizayner QA qiladi. Platforma = buyurtma qabul qilish + navbat + QA + yetkazish tizimi.
- **Asosiy va'da (SLA):** 24 soat (Start), 12 soat (Pro), 6 soat (Enterprise).

## 0.1 Mahsulot ierarxiyasi (wedge strategiyasi)

1. **Wedge:** 2D reja → fotorealistik 3D render (24h).
2. **Kengaytirish:** Interyer variatsiya generatori — bitta rejadan 5–10 stil.
3. **Qo'shimcha daromad:** Virtual staging — bo'sh xona fotosi → mebel bilan to'ldirilgan foto (rieltorlar).
4. **Lock-in:** Marketing paket generatori — render → Instagram post / banner / brochure bir tugmada.
5. **Kelajak (12+ oy):** Interaktiv 3D tur (developer saytiga embed, B2B2C).

---

# 1. ⛔ QAT'IY TAQIQLAR — BULARNI HECH QACHON QILMA

Eski v1.0 rejadagi xatolar. Ushbu bandlar buzilsa, mahsulot investor oldida yaroqsiz bo'ladi:

1. ❌ **Soxta testimonial / reyting YO'Q.** Hech qanday "127 ta sharh, 4.9/5", to'qima mijoz fikrlari, JSON-LD AggregateRating bo'lmasin. O'rniga: **"Beta dasturi"** bloki (birinchi 10 beta mijoz — 3 oy bepul, evaziga case study).
2. ❌ **Dollar narxlar YO'Q.** Barcha narxlar **so'mda** ko'rsatiladi (400 000 so'm formatida, probel bilan).
3. ❌ **Stripe YO'Q.** Stripe O'zbekistonda ishlamaydi. Faqat: **Payme Business, Click, Uzum** + hisob-faktura (Enterprise).
4. ❌ **"$1M ARR 18 oyda", "0 raqobatchi", "$6.96B bozor" kabi da'volar YO'Q** — hech qaysi sahifada.
5. ❌ **"Production Ready" degan yolg'on YO'Q.** Render pipeline hozircha manual-first — bu halol ko'rsatiladi (mijozga: "AI + professional dizayner tayyorlaydi").
6. ❌ **localStorage/sessionStorage ishlatma** kritik ma'lumot uchun — hammasi DB da.
7. ❌ **Sinxron render API qurma** — render 2–20 daqiqa davom etadi, faqat navbat (queue) + webhook + status polling.

---

# 2. FOYDALANUVCHI ROLLARI VA FLOW'LAR

## 2.1 Rollar (RBAC)

| Rol | Kim | Nima qiladi |
|---|---|---|
| **CLIENT** | Qurilish kompaniyasi xodimi / rieltor / uy egasi | Buyurtma beradi, fayl yuklaydi, to'laydi, natijani ko'radi/yuklab oladi, revision so'raydi |
| **DESIGNER** | Ichki 3D/AI dizayner | Navbatdagi buyurtmalarni oladi, AI natijalarni QA qiladi, retouch yuklaydi, yetkazadi |
| **ADMIN** | Founder / operatsiya | Hamma buyurtma, mijozlar, to'lovlar, KPI dashboard, dizaynerga biriktirish, narx/plan boshqaruvi |

## 2.2 CLIENT flow (asosiy)

1. Landing → "Buyurtma berish" yoki "Bepul demo so'rash".
2. Ro'yxatdan o'tish: **telefon raqam + SMS kod** (asosiy) yoki **Telegram Login** (konversiya uchun muhim). Email — ixtiyoriy.
3. Buyurtma wizard (4 qadam):
   - **Qadam 1:** Xizmat turi — 3D Render / Variatsiya / Virtual Staging / Marketing Paket.
   - **Qadam 2:** Fayl yuklash (2D reja PDF/PNG/JPG yoki xona fotosi), xona turi, maydon (m²), izoh.
   - **Qadam 3:** Stil tanlash (vizual kartochkalar): `modern | scandi | eastern | loft | luxury | minimal`. Variatsiya buyurtmasida bir nechta tanlanadi.
   - **Qadam 4:** Narx ko'rsatiladi (plan/PAYG bo'yicha) → to'lov (Payme/Click/Uzum) yoki kredit balansidan yechish.
4. Buyurtma statusini kuzatish: `Qabul qilindi → Navbatda → Tayyorlanmoqda → Sifat nazorati → Tayyor`.
5. Tayyor bo'lganda: dashboard + **Telegram xabarnoma** (havola bilan). Yuqori sifatli fayllarni yuklab olish (watermarksiz — faqat to'langan bo'lsa).
6. Revision: planga qarab 1–3 bepul revision tugmasi (izoh yozadi) → status `REVISION` ga qaytadi. Limitdan keyin — pullik revision.

## 2.3 DESIGNER flow (QA paneli)

1. Kirish → "Navbat" ko'rinishi: unga biriktirilgan + biriktirilmagan buyurtmalar, SLA deadline bo'yicha saralangan, **deadline'gacha qolgan vaqt** rangli (yashil >12h, sariq 4–12h, qizil <4h).
2. Buyurtmani olish → status `PROCESSING`. Input fayllarni ko'radi/yuklab oladi.
3. AI variantlarni yuklaydi (Bosqich A da qo'lda, Bosqich B da tizim ichida 4 variant ko'rinadi) → eng yaxshisini tanlaydi → retouch qilingan yakuniy faylni yuklaydi.
4. "QA tasdiqlash" → status `DELIVERED` → mijozga avtomatik Telegram + dashboard xabarnoma.
5. Har jobda: sarflangan vaqt (minut) va GPU xarajati ($) yoziladi — unit-ekonomika uchun.

## 2.4 ADMIN flow

- Barcha buyurtmalar jadvali (filter: status, plan, dizayner, sana).
- Buyurtmani dizaynerga biriktirish (yoki avto-biriktirish: eng kam yuklangan dizayner).
- Mijozlar/kompaniyalar CRM ko'rinishi: plan, balans, MRR, oxirgi buyurtma, churn xavfi (30+ kun buyurtmasiz = ogohlantirish).
- To'lovlar jurnali (Payme/Click/Uzum/Invoice, status bilan).
- KPI dashboard (X qism, pastda).
- Sozlamalar: narxlar, SLA soatlari, revision limitlari, stil katalogi (CRUD).

---

# 3. TEXNIK ARXITEKTURA

## 3.1 Umumiy sxema

```
┌──────────────────────────────────────────────────────┐
│                    MIJOZ QATLAMI                      │
│   Web (Next.js PWA, uz/ru) · Telegram Bot            │
│   Keyinroq: React Native mobil ilova                 │
└───────────────────────┬──────────────────────────────┘
                        │ HTTPS / REST + Webhook
┌───────────────────────▼──────────────────────────────┐
│                 APPLICATION QATLAMI                   │
│   Next.js Route Handlers (monolit)                   │
│   NextAuth v5 (telefon+SMS, Telegram login)          │
│   RBAC (CLIENT/DESIGNER/ADMIN) · Zod · Rate limit    │
└─────────┬─────────────────────────┬──────────────────┘
          │                         │
┌─────────▼──────────┐   ┌──────────▼──────────────────┐
│   MA'LUMOTLAR       │   │     RENDER ORKESTRATOR      │
│  PostgreSQL 16      │   │  BullMQ + Redis (Upstash)   │
│  Prisma ORM         │   │  queued → processing →      │
│  Cloudflare R2      │   │  QA → delivered             │
│  (fayl/renderlar)   │   └──────────┬──────────────────┘
└─────────────────────┘              │
                     ┌───────────────▼──────────────────┐
                     │        AI RENDER QATLAMI          │
                     │  ComfyUI + SDXL/Flux (serverless  │
                     │  GPU: RunPod/Modal, on-demand)    │
                     │  ControlNet (MLSD/depth/canny)    │
                     │  + Dizayner QA paneli (human loop)│
                     └───────────────┬──────────────────┘
                     ┌───────────────▼──────────────────┐
                     │     YETKAZIB BERISH QATLAMI       │
                     │  Mijoz dashboard · Telegram bot   │
                     │  Marketing paket export           │
                     │  (PNG/PDF/IG formatlar)           │
                     └──────────────────────────────────┘
```

## 3.2 Texnologiya stacki

| Qatlam | Texnologiya | Nega |
|---|---|---|
| Frontend | Next.js 16 (App Router) + React 19 + TypeScript strict | Zamonaviy, SSR/SEO, PWA |
| Styling | Tailwind CSS 4 + Framer Motion 12 | Tez, animatsiya |
| 3D Viewer | @react-three/fiber + drei | Demo/preview uchun interaktiv 3D |
| Backend | Next.js Route Handlers (monolit) | Kichik jamoa — alohida backend ortiqcha |
| DB | PostgreSQL 16 + Prisma ORM (Neon yoki Supabase managed) | Ishonchli, tanish stack |
| Fayl saqlash | Cloudflare R2 (S3-compatible, private bucket + signed URL) | Egress bepul — renderlar katta fayl |
| Navbat | BullMQ + Redis (Upstash) | Render asinxron — sinxron API bo'lmaydi |
| AI render | ComfyUI + SDXL/Flux + ControlNet (tashqi servis) | Ochiq ekotizim, vendor lock-in yo'q |
| GPU | RunPod Serverless / Modal | On-demand, mijoz yo'g'ida $0 |
| Auth | NextAuth v5: telefon+SMS OTP (Eskiz.uz) + Telegram Login | UZ mijozi email o'qimaydi |
| To'lov | Payme Business API + Click API + Uzum | Stripe UZ da ishlamaydi |
| Xabarnoma | Telegram Bot API + SMS (Eskiz.uz) | Asosiy kanal — Telegram |
| Monitoring | Sentry + Umami/Plausible | Xato kuzatuv + privacy analitika |
| Deploy | Vercel (app) + RunPod (GPU) | Sodda, tez |

## 3.3 Render pipeline evolyutsiyasi (platforma buni qo'llab-quvvatlashi shart)

- **Bosqich A — Manual-first (0–2 oy):** Buyurtma platformadan keladi → ADMIN/DESIGNER buyurtmani "qo'lda bajarilmoqda" rejimida oladi → tayyor faylni panelga yuklaydi → tizim yetkazadi. **Platformadagi talab:** butun order lifecycle AI'siz ham to'liq ishlashi kerak (dizayner fayl yuklashi = "render tugadi").
- **Bosqich B — AI-assisted (2–5 oy):** `/api/render/dispatch` RunPod'ga ComfyUI workflow (workflowId bilan) yuboradi → RunPod tugagach `/api/render/webhook` ga natija keladi → 4 variant DESIGNER QA panelida ko'rinadi → tanlaydi/retouch → yetkazish. **Platformadagi talab:** RenderJob modeli, webhook endpoint, variant tanlash UI. (RunPod integratsiyasini hozircha MOCK/stub qilib qur — interfeys tayyor tursin, kalitlar env orqali ulanadi.)
- **Bosqich C — Self-serve staging (6–12 oy):** Virtual staging to'liq avtomatik. 2D→3D esa doim "AI + human QA" bo'lib qoladi.

---

# 4. MA'LUMOTLAR BAZASI — TO'LIQ PRISMA SXEMASI

```prisma
// ===== ENUMS =====
enum Role          { CLIENT DESIGNER ADMIN }
enum CompanyType   { DEVELOPER AGENCY DESIGNER_STUDIO OWNER }
enum Plan          { PAYG START PRO ENTERPRISE }
enum OrderType     { RENDER_3D STAGING VARIATION MARKETING }
enum OrderStatus   { NEW QUEUED PROCESSING QA REVISION DELIVERED CANCELLED }
enum AssetKind     { INPUT_PLAN INPUT_PHOTO AI_VARIANT RENDER STAGING MARKETING_PACK }
enum PayProvider   { PAYME CLICK UZUM INVOICE }
enum PayStatus     { PENDING PAID FAILED REFUNDED }
enum JobStatus     { QUEUED RUNNING SUCCEEDED FAILED }
enum NotifChannel  { TELEGRAM SMS INAPP }

// ===== MODELS =====
model User {
  id          String    @id @default(cuid())
  role        Role      @default(CLIENT)
  name        String
  phone       String    @unique          // +998XXXXXXXXX
  phoneVerified Boolean @default(false)
  telegramId  String?   @unique
  email       String?   @unique          // ixtiyoriy
  locale      String    @default("uz")   // uz | ru
  companyId   String?
  company     Company?  @relation(fields: [companyId], references: [id])
  orders      Order[]   @relation("ClientOrders")
  assigned    Order[]   @relation("DesignerOrders")
  createdAt   DateTime  @default(now())
}

model Company {
  id         String      @id @default(cuid())
  name       String
  type       CompanyType
  plan       Plan        @default(PAYG)
  balance    Int         @default(0)   // render kreditlari (dona)
  planUntil  DateTime?                  // obuna tugash sanasi
  innStir    String?                    // STIR (yuridik shaxs)
  users      User[]
  orders     Order[]
  payments   Payment[]
  createdAt  DateTime    @default(now())
}

model Order {
  id           String      @id @default(cuid())
  number       Int         @unique @default(autoincrement()) // #1024 ko'rinishida
  type         OrderType
  status       OrderStatus @default(NEW)
  clientId     String
  client       User        @relation("ClientOrders", fields: [clientId], references: [id])
  companyId    String?
  company      Company?    @relation(fields: [companyId], references: [id])
  assignedToId String?
  assignedTo   User?       @relation("DesignerOrders", fields: [assignedToId], references: [id])
  styleKeys    String[]    // ["modern","scandi"] — variatsiyada bir nechta
  roomType     String?     // living | bedroom | kitchen | bathroom | office | full_apartment
  areaM2       Float?
  note         String?     // mijoz izohi
  slaDeadline  DateTime    // yaratilganda plan bo'yicha hisoblanadi: 24h/12h/6h
  revisionsUsed Int        @default(0)
  revisionLimit Int        @default(1)  // plan bo'yicha: PAYG=1, START=2, PRO=3, ENT=3
  priceUzs     Int
  assets       Asset[]
  payment      Payment?
  renderJobs   RenderJob[]
  events       OrderEvent[]
  createdAt    DateTime    @default(now())
  deliveredAt  DateTime?
}

model Asset {
  id        String    @id @default(cuid())
  orderId   String
  order     Order     @relation(fields: [orderId], references: [id])
  kind      AssetKind
  r2Key     String                       // Cloudflare R2 kaliti (private)
  fileName  String
  mime      String
  sizeBytes Int
  width     Int?
  height    Int?
  isSelected Boolean  @default(false)    // AI_VARIANT ichidan dizayner tanlagani
  createdAt DateTime  @default(now())
}

model Payment {
  id          String      @id @default(cuid())
  orderId     String?     @unique
  order       Order?      @relation(fields: [orderId], references: [id])
  companyId   String?
  company     Company?    @relation(fields: [companyId], references: [id])
  provider    PayProvider
  amountUzs   Int
  purpose     String      // "order" | "subscription" | "credits"
  status      PayStatus   @default(PENDING)
  providerTxn String?     // Payme/Click tranzaksiya ID
  createdAt   DateTime    @default(now())
  paidAt      DateTime?
}

model RenderJob {
  id          String    @id @default(cuid())
  orderId     String
  order       Order     @relation(fields: [orderId], references: [id])
  workflowId  String    // ComfyUI workflow versiyasi (mas: "interior_v3_mlsd")
  provider    String    @default("runpod")
  status      JobStatus @default(QUEUED)
  gpuCostUsd  Float?    // unit-ekonomika: har jobda xarajat
  durationS   Int?
  errorMsg    String?
  createdAt   DateTime  @default(now())
  finishedAt  DateTime?
}

model OrderEvent {        // audit trail — har status o'zgarishi
  id        String   @id @default(cuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id])
  actorId   String?  // kim o'zgartirdi
  fromStatus String?
  toStatus  String
  note      String?
  createdAt DateTime @default(now())
}

model StyleCatalog {      // admin CRUD qiladi
  key       String  @id   // modern | scandi | eastern | loft | luxury | minimal
  nameUz    String
  nameRu    String
  coverR2Key String?      // stil kartochkasi rasmi
  isActive  Boolean @default(true)
  sortOrder Int     @default(0)
}

model Notification {
  id        String       @id @default(cuid())
  userId    String
  channel   NotifChannel
  title     String
  body      String
  isRead    Boolean      @default(false)
  createdAt DateTime     @default(now())
}

model Lead {              // landing demo-so'rovlari
  id        String   @id @default(cuid())
  name      String
  phone     String
  company   String?
  message   String?
  source    String?  // landing | instagram | telegram
  createdAt DateTime @default(now())
}

model DesignerStat {      // COGS hisobi uchun
  id         String   @id @default(cuid())
  designerId String
  orderId    String
  minutesSpent Int
  createdAt  DateTime @default(now())
}
```

---

# 5. API SPETSIFIKATSIYASI (Route Handlers)

| Endpoint | Metod | Rol | Vazifa |
|---|---|---|---|
| `/api/auth/otp/send` | POST | public | Telefon raqamga SMS OTP yuborish (Eskiz.uz), rate limit: 3/soat/raqam |
| `/api/auth/otp/verify` | POST | public | OTP tekshirish → session |
| `/api/auth/telegram` | POST | public | Telegram Login Widget hash tekshiruvi → session |
| `/api/leads` | POST | public | Demo so'rov → DB + admin Telegramiga xabar |
| `/api/upload` | POST | CLIENT+ | R2 presigned URL (MIME + magic-byte + 25MB tekshiruv) |
| `/api/orders` | POST/GET | CLIENT | Buyurtma yaratish (narx server tomonda hisoblanadi!), ro'yxat |
| `/api/orders/[id]` | GET/PATCH | CLIENT/DESIGNER/ADMIN | Detal; PATCH: revision so'rovi (CLIENT), status (DESIGNER/ADMIN) |
| `/api/orders/[id]/assets` | POST | DESIGNER | Variant/yakuniy render yuklash |
| `/api/orders/[id]/deliver` | POST | DESIGNER | QA tasdiqlash → DELIVERED + Telegram xabarnoma |
| `/api/payments/payme` | POST | webhook | Payme Merchant API (JSON-RPC: CheckPerformTransaction, CreateTransaction, PerformTransaction, CancelTransaction, CheckTransaction, GetStatement) + imzo/login tekshiruvi |
| `/api/payments/click` | POST | webhook | Click prepare/complete + MD5 sign tekshiruvi |
| `/api/payments/uzum` | POST | webhook | Uzum checkout callback |
| `/api/render/dispatch` | POST | ichki | BullMQ job → RunPod (Bosqich B; hozir MOCK) |
| `/api/render/webhook` | POST | webhook | RunPod natijasi → Asset(AI_VARIANT) + status QA + secret header tekshiruvi |
| `/api/marketing-package` | POST | CLIENT (Pro+) | Renderdan IG post (1080×1080, 1080×1920), banner, PDF brochure generatsiya |
| `/api/admin/kpi` | GET | ADMIN | KPI dashboard ma'lumotlari |
| `/api/admin/pricing` | GET/PUT | ADMIN | Narx/SLA/revision sozlamalari |
| `/api/cron/sla-check` | GET | cron | SLA deadline yaqinlashganda dizayner+adminga ogohlantirish |
| `/api/v1/*` | — | API key | Enterprise public API (keyingi bosqich, stub) |

**Muhim qoidalar:**
- Barcha input **Zod** bilan validatsiya qilinadi.
- Narx HECH QACHON frontenddan olinmaydi — server `plan + type` bo'yicha hisoblaydi.
- Barcha webhooklarda imzo tekshiruvi majburiy (Payme: Authorization Basic; Click: MD5 sign; RunPod: shared secret header).
- Rate limiting (Upstash Ratelimit): upload 10/min, payment 20/min, OTP 3/soat.

---

# 6. NARX MODELI (server konfiguratsiyasi, so'mda)

| Daraja | Narx | Nima kiradi | SLA | Revision | Kim uchun |
|---|---|---|---|---|---|
| **Pay-per-render** | 400 000 so'm / render | 1 render, 2 stil varianti | 48 soat | 1 | Sinovchilar, uy egalari |
| **Start** | 1 900 000 so'm/oy | 6 render/oy, 5 staging | 24 soat | 2 | Kichik agentlik, rieltor |
| **Pro** ⭐ | 4 900 000 so'm/oy | 20 render/oy, cheksiz staging, marketing paket | 12 soat | 3 | Qurilish kompaniyalari |
| **Enterprise** | 12 000 000+ so'm/oy (shartnoma) | Cheksiz, white-label, API, dedicated menejer | 6 soat | 3 | Yirik developerlar |

- Landing'da narxlar shu formatda: **"1 900 000 so'm/oy"** (probel bilan, $ YO'Q).
- Obuna = oylik kredit balансi (`Company.balance`). Buyurtma yaratilganda kredit yechiladi; PAYG da to'g'ridan to'lov.
- Enterprise: "Bog'laning" tugmasi → lead forma (hisob-faktura bilan ishlanadi).

---

# 7. FRONTEND — TO'LIQ SAHIFALAR XARITASI (SITEMAP)

## 7.1 Ochiq (public) sahifalar

| Sahifa | Yo'l | Mazmun |
|---|---|---|
| **Landing** | `/` | Hero: "2D rejadan sotuvga tayyor 3D render — 24 soatda" + CTA "Bepul demo render olish". Muammo/yechim bloki, qanday ishlaydi (3 qadam), oldin/keyin slayder (real demo-renderlar), interaktiv 3D viewer demo, narxlar (so'mda), **Beta dasturi bloki** (testimonial O'RNIGA), ROI kalkulyator, FAQ, lead forma |
| **Narxlar** | `/narxlar` | 4 darajali jadval (6-bo'lim), plan solishtirish, FAQ |
| **Portfolio** | `/portfolio` | Oldin/keyin galereya (admin CRUD orqali to'ldiriladi), stil bo'yicha filter |
| **Xizmatlar** | `/xizmatlar/[type]` | 4 ta xizmat sahifasi: 3D render, variatsiya, staging, marketing paket — har biri SEO uchun alohida |
| **Biz haqimizda** | `/biz` | Jamoa, gibrid model halol tushuntirilgan ("AI tayyorlaydi, professional dizayner sifatni kafolatlaydi") |
| **Kirish** | `/kirish` | Telefon + SMS OTP, Telegram Login tugmasi |
| **Huquqiy** | `/oferta`, `/maxfiylik` | Ommaviy oferta, maxfiylik siyosati (Payme/Click merchant talabi!) |

## 7.2 CLIENT kabineti (`/kabinet/*`)

- `/kabinet` — buyurtmalar ro'yxati (status badge, SLA countdown), balans/plan karta
- `/kabinet/yangi` — 4 qadamli buyurtma wizard (2.2-bo'lim)
- `/kabinet/buyurtma/[id]` — detal: status timeline, fayllar, tayyor render preview (to'lanmagan bo'lsa watermark), "Yuklab olish", "Revision so'rash" (limit ko'rsatilgan), marketing paket tugmasi (Pro+)
- `/kabinet/tolov` — to'lov tarixi, obuna boshqaruvi, kredit sotib olish
- `/kabinet/sozlamalar` — profil, til (uz/ru), Telegram ulash

## 7.3 DESIGNER paneli (`/studio/*`)

- `/studio` — navbat: kanban yoki jadval (NEW/QUEUED → PROCESSING → QA), SLA countdown rangli
- `/studio/buyurtma/[id]` — ish maydoni: input fayllar, AI variantlar grid (4 ta, birini tanlash), yakuniy fayl yuklash, vaqt tracker (start/stop), "QA tasdiqlash → yetkazish" tugmasi
- `/studio/statistika` — shaxsiy: bajarilgan buyurtmalar, o'rtacha vaqt

## 7.4 ADMIN paneli (`/admin/*`)

- `/admin` — KPI dashboard (10-bo'lim)
- `/admin/buyurtmalar` — hamma buyurtma, filter, dizaynerga biriktirish
- `/admin/mijozlar` — kompaniyalar CRM (plan, MRR, churn xavfi belgisi)
- `/admin/tolovlar` — to'lovlar jurnali
- `/admin/dizaynerlar` — yuklanish, o'rtacha vaqt, COGS/render
- `/admin/kontent` — StyleCatalog CRUD, portfolio CRUD, narx sozlamalari
- `/admin/leadlar` — demo so'rovlar ro'yxati

## 7.5 UI/dizayn talablari

- **Til:** uz (default) + ru, `next-intl` bilan, har sahifada switcher. Barcha matnlar tarjima fayllarida.
- **Mobile-first** — mijozlarning ~80% telefonda. PWA (manifest + offline sahifa).
- **Brend:** premium, ishonchli qurilish-tech estetika — to'q ko'k/grafit fon + oltin/amber aksent, katta oldin/keyin vizuallar. Arzon SaaS shabloniga o'xshamasin.
- **So'm formati:** `1 900 000 so'm` (probellar bilan). Sana: `03.07.2026`.
- **Status ranglari:** NEW ko'k, QUEUED kulrang, PROCESSING sariq, QA binafsha, REVISION to'q sariq, DELIVERED yashil, CANCELLED qizil.
- ErrorBoundary, skeleton loaderlar, bo'sh holatlar (empty state) illyustratsiya bilan, accessibility (ARIA, kontrast).

## 7.6 ROI kalkulyator (landing bloki)

Interaktiv: mijoz kirituvchi — oyiga nechta xonadon sotadi, hozirgi render narxi (default 5 mln so'm frilanser) va muddati (default 2–3 hafta). Chiqish: VISIO bilan tejaladigan pul + vaqt, "sotuv qancha erta boshlanadi". Hisob formulalari sodda va halol — bo'rttirilgan da'vosiz.

---

# 8. TELEGRAM BOT SPETSIFIKATSIYASI

Bot — yetkazish va xabarnoma kanali (buyurtma berish ham mumkin, MVP-lite):

| Komanda/hodisa | Harakat |
|---|---|
| `/start` | Salomlashish + telefon raqam so'rash (contact tugma) → User.telegramId bog'lash |
| `/buyurtma` | Mini-wizard: xizmat turi → fayl yuborish → stil (inline tugmalar) → tasdiqlash → to'lov havolasi |
| `/holat` | Faol buyurtmalar statusi |
| Status o'zgarishi | Avtomatik xabar: "✅ Buyurtma #1024 tayyor! Ko'rish: [havola]" |
| SLA ogohlantirish | Dizayner/adminga: "⚠️ #1024 deadline'ga 4 soat qoldi" |
| Yangi lead | Admin guruhiga: yangi demo so'rov ma'lumotlari |

Webhook: `/api/telegram/webhook` (secret token tekshiruvi bilan).

---

# 9. XAVFSIZLIK TALABLARI (majburiy)

1. **Zod** — barcha API input sxemalari.
2. **Rate limiting** (Upstash Ratelimit) — upload, payment, OTP endpointlarda.
3. **Webhook imzo tekshiruvi:** Payme (Basic auth login/parol), Click (MD5 sign_string), RunPod/Telegram (secret header/token). Imzosiz so'rov → 403 + log.
4. **Fayl yuklash:** MIME + magic-byte tekshiruv, max 25MB, faqat PDF/PNG/JPG/WEBP. Fayl nomlari sanitizatsiya.
5. **R2 private bucket** + signed URL (15 daqiqa amal qiladi). Mijoz qurilish rejalari — maxfiy hujjat, public URL taqiqlanadi.
6. **RBAC middleware:** `/kabinet` → CLIENT+, `/studio` → DESIGNER+, `/admin` → faqat ADMIN. API darajasida ham tekshiruv (UI emas).
7. **IDOR himoyasi:** CLIENT faqat o'z buyurtmalarini ko'radi (`where clientId = session.user.id`).
8. **Narx server tomonda** — frontenddan kelgan narx e'tiborga olinmaydi.
9. Kunlik DB backup (Neon PITR). Sentry'da PII maskalash.
10. Watermark: to'lanmagan/preview renderlarda diagonal "VISIO" watermark server tomonda (sharp bilan).

---

# 10. ADMIN KPI DASHBOARD (haftalik kuzatuv)

| Blok | Metrikalar |
|---|---|
| **Sotuv** | Yuborilgan demo-renderlar, uchrashuvlar, yangi to'lovchi mijozlar, MRR (so'm + $ ekvivalent) |
| **Mahsulot** | O'rtacha yetkazish vaqti (SLA 24h — asosiy va'da!), SLA buzilishlari %, revision ulushi (<30% bo'lishi kerak), COGS/render (GPU$ + dizayner minutlari × stavka) |
| **Mijoz** | Oylik churn, NPS (yetkazishdan keyin 1 savolli so'rov), mijoz boshiga oylik renderlar |
| **Moliya** | Gross margin, oylik tushum grafigi, plan bo'yicha taqsimot |

Grafik: recharts. Davr filtri: 7/30/90 kun.

---

# 11. BUILD BOSQICHLARI — z.ai UCHUN QURISH TARTIBI

**Ushbu tartibda qur. Har faza tugagach keyingisiga o't:**

### FAZA 1 — Yadro (eng muhim, birinchi qur)
1. Prisma sxema + seed (StyleCatalog 6 stil, 1 admin, 1 dizayner, 2 test mijoz, 5 namunaviy buyurtma turli statuslarda)
2. Auth: telefon+OTP (SMS provayderi MOCK — kod konsolga/DB ga yoziladi) + Telegram Login stub
3. Buyurtma lifecycle: wizard → upload (R2, env yo'q bo'lsa lokal MOCK storage) → status mashinasi → OrderEvent audit
4. CLIENT kabineti + DESIGNER studio paneli (qo'lda fayl yuklash bilan to'liq ishlaydigan manual-first oqim!)
5. ADMIN: buyurtmalar + biriktirish

### FAZA 2 — Pul va yetkazish
6. Narx hisoblash + Payme/Click webhook handlerlar (test rejim, imzo tekshiruvi bilan; sandbox kalitlar env dan)
7. Obuna/kredit tizimi (Company.balance)
8. Telegram bot (xabarnomalar + /holat)
9. Watermark + signed URL yuklab olish

### FAZA 3 — Ko'rinish va o'sish
10. Landing (7.1 to'liq: oldin/keyin slayder, ROI kalkulyator, beta bloki, 3D viewer demo)
11. ADMIN KPI dashboard + kontent CRUD
12. Marketing paket generatori (renderdan IG 1080×1080 / 1080×1920 / banner PDF — sharp/canvas bilan kompozitsiya)
13. RenderJob + `/api/render/webhook` (RunPod MOCK: dispatch → 30 soniyada fake variantlar qaytaradi) — Bosqich B ga tayyor interfeys
14. i18n (uz/ru), PWA, SEO (metadata, sitemap, JSON-LD faqat SoftwareApplication+Offer — AggregateRating YO'Q)

---

# 12. ENVIRONMENT O'ZGARUVCHILARI

```env
DATABASE_URL=              # Neon/Supabase Postgres
NEXTAUTH_SECRET=
NEXTAUTH_URL=
R2_ACCOUNT_ID=             # bo'lmasa lokal MOCK storage
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=visio-assets
REDIS_URL=                 # Upstash
ESKIZ_EMAIL=               # SMS OTP (bo'lmasa MOCK)
ESKIZ_PASSWORD=
TELEGRAM_BOT_TOKEN=
TELEGRAM_ADMIN_CHAT_ID=
PAYME_MERCHANT_ID=
PAYME_KEY=                 # webhook Basic auth
CLICK_MERCHANT_ID=
CLICK_SERVICE_ID=
CLICK_SECRET_KEY=
RUNPOD_API_KEY=            # Bosqich B (hozir MOCK)
RUNPOD_ENDPOINT_ID=
RENDER_WEBHOOK_SECRET=
SENTRY_DSN=
```

**Qoida:** har qanday tashqi servis kaliti yo'q bo'lsa — ilova yiqilmasin, MOCK rejimda ishlasin va admin panelda "MOCK rejim" belgisi ko'rinsin.

---

# 13. QABUL MEZONLARI (Definition of Done)

- [ ] Mijoz telefon+OTP bilan kirib, 4 qadamli wizard orqali buyurtma bera oladi (fayl yuklash bilan)
- [ ] Dizayner buyurtmani olib, yakuniy fayl yuklab, "yetkazish" tugmasi bilan DELIVERED qila oladi — **AI'siz, to'liq manual-first**
- [ ] Mijoz tayyor renderni preview (watermark) va to'lovdan keyin toza yuklab oladi
- [ ] Revision limiti ishlaydi (limitdan keyin pullik ogohlantirish)
- [ ] Payme/Click webhook test so'rovlari to'g'ri javob qaytaradi (protokol bo'yicha) va noto'g'ri imzoni rad etadi
- [ ] Telegram xabarnoma status o'zgarishida yetib boradi (token bo'lsa)
- [ ] Admin KPI dashboardda MRR, SLA, churn ko'rinadi
- [ ] Hech qayerda: $ narx, soxta testimonial, AggregateRating, Stripe, "$1M/18 oy" YO'Q
- [ ] `npm run build` — 0 error, TypeScript strict
- [ ] Barcha sahifalar uz tilida, ru tarjima fayllari tayyor
- [ ] Mobil (375px) da barcha oqimlar ishlaydi

---

# 14. KONTEKST: BIZNES RAQAMLAR (landing/pitch sahifalarida ishlatish uchun — halol versiya)

- Muammo: frilanser render — 2–3 hafta, 300–600$ (≈4–7.5 mln so'm). VISIO — 24 soat, 2× arzon.
- Unit-ekonomika (ichki, investor sahifalari uchun): COGS/render manual ~$17 → AI-assisted ~$5.5; gross margin 47% → 70%+; LTV:CAC ≈ 20×; breakeven 10–12 oy.
- Maqsadlar: 18 oyda $170–290K ARR (realistik), $1M ARR — 30–36 oy (Qozog'iston bilan). **Bu raqamlar faqat investor materiallari uchun — landing'da ko'rsatilmaydi.**
- IT Park rezidentligi — birinchi 90 kun (soliq 0%).

---

# 15. z.ai UCHUN YAKUNIY KO'RSATMA

Sen senior full-stack muhandissan. Yuqoridagi spetsifikatsiya bo'yicha **VISIO** platformasini qur:

1. **Stack:** Next.js (App Router) + TypeScript strict + Tailwind + Prisma + PostgreSQL. 4-bo'limdagi sxemani aynan ishlat.
2. **Tartib:** 11-bo'limdagi FAZA 1 → 2 → 3. Har fazada ishlaydigan holatga yetkaz.
3. **Eng muhim tamoyil:** platforma **manual-first** — AI integratsiyasisiz ham buyurtmadan yetkazishgacha to'liq sikl ishlashi shart. AI (RunPod) — MOCK interfeys bilan tayyorlab qo'yiladi.
4. **1-bo'limdagi taqiqlarni** hech qachon buzma.
5. Barcha UI matnlari o'zbek tilida, professional ohangda. Narxlar faqat so'mda.
6. Kod sifati: Zod validatsiya, RBAC har API'da, xatolar try/catch bilan, seed data bilan darhol demo qilsa bo'ladigan holat.

**Yakuniy natija:** birinchi 20 mijozga xizmat ko'rsatishga tayyor, investor demo qilsa bo'ladigan, halol va professional platforma.
