// VISIO seed — spec §11 FAZA 1: 1 admin, 1 dizayner, 2 mijoz, 6 stil, 5 buyurtma
import { db } from "../src/lib/db";
import { STYLES, PLANS, ORDER_TYPES, ORDER_STATUSES, SLA_HOURS } from "../src/lib/constants";
import { computeSlaDeadline } from "../src/lib/orders";

async function main() {
  console.log("🌱 Seeding VISIO...");

  // Clean
  await db.designerStat.deleteMany();
  await db.orderEvent.deleteMany();
  await db.renderJob.deleteMany();
  await db.asset.deleteMany();
  await db.payment.deleteMany();
  await db.notification.deleteMany();
  await db.order.deleteMany();
  await db.lead.deleteMany();
  await db.user.deleteMany();
  await db.company.deleteMany();
  await db.styleCatalog.deleteMany();
  await db.setting.deleteMany();

  // Styles
  for (const s of STYLES) {
    await db.styleCatalog.create({
      data: {
        key: s.key,
        nameUz: s.nameUz,
        nameRu: s.nameRu,
        coverR2Key: `images/style-${s.key}.png`,
        isActive: true,
        sortOrder: s.sortOrder,
      },
    });
  }
  console.log("✓ 6 styles");

  // Companies
  const tashkentDev = await db.company.create({
    data: {
      name: "Toshkent Qurilish MChJ",
      type: "DEVELOPER",
      plan: PLANS.PRO,
      balance: 14,
      planUntil: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      innStir: "123456789",
    },
  });
  const samarkandRealty = await db.company.create({
    data: {
      name: "Samarqand Rieltor",
      type: "AGENCY",
      plan: PLANS.START,
      balance: 3,
      planUntil: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    },
  });
  const personalClient = await db.company.create({
    data: { name: "Shaxsiy mijoz", type: "OWNER", plan: PLANS.PAYG, balance: 0 },
  });
  console.log("✓ 3 companies");

  // Users
  const admin = await db.user.create({
    data: { role: "ADMIN", name: "Sardor Karimov", phone: "+998901234567", phoneVerified: true, email: "admin@visio.uz", locale: "uz" },
  });
  const designer = await db.user.create({
    data: { role: "DESIGNER", name: "Dilnoza Yusupova", phone: "+998902345678", phoneVerified: true, email: "dilnoza@visio.uz", locale: "uz" },
  });
  const designer2 = await db.user.create({
    data: { role: "DESIGNER", name: "Akmal Rahimov", phone: "+998903456789", phoneVerified: true, email: "akmal@visio.uz", locale: "uz" },
  });
  const client1 = await db.user.create({
    data: { role: "CLIENT", name: "Bekzod Tursunov", phone: "+998911112233", phoneVerified: true, email: "bekzod@tq.uz", locale: "uz", companyId: tashkentDev.id },
  });
  const client2 = await db.user.create({
    data: { role: "CLIENT", name: "Madina Azizova", phone: "+998922223344", phoneVerified: true, locale: "uz", companyId: samarkandRealty.id },
  });
  const client3 = await db.user.create({
    data: { role: "CLIENT", name: "Otabek Yusupov", phone: "+998933334455", phoneVerified: true, locale: "uz", companyId: personalClient.id },
  });
  console.log("✓ 6 users (1 admin, 2 designer, 3 client)");

  // Settings (pricing defaults mirror constants.ts)
  await db.setting.createMany({
    data: [
      { key: "payg_render_price", value: "400000" },
      { key: "start_price", value: "1900000" },
      { key: "pro_price", value: "4900000" },
      { key: "enterprise_price", value: "12000000" },
      { key: "sla_payg_hours", value: "48" },
      { key: "sla_start_hours", value: "24" },
      { key: "sla_pro_hours", value: "12" },
      { key: "sla_enterprise_hours", value: "6" },
    ],
  });

  // Orders — 5 sample in various statuses
  const orders = [
    {
      number: 1, type: ORDER_TYPES.RENDER_3D, status: ORDER_STATUSES.NEW, clientId: client1.id,
      companyId: tashkentDev.id, styleKeys: JSON.stringify(["modern"]), roomType: "living", areaM2: 32,
      note: "Mehmonxona, oynali. Zamonaviy stil.", priceUzs: 0,
      slaDeadline: computeSlaDeadline(PLANS.PRO), createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      number: 2, type: ORDER_TYPES.STAGING, status: ORDER_STATUSES.PROCESSING, clientId: client2.id,
      companyId: samarkandRealty.id, assignedToId: designer.id, styleKeys: JSON.stringify(["scandi"]), roomType: "bedroom", areaM2: 18,
      note: "Bo'sh yotoqxona, mebel bilan to'ldiring.", priceUzs: 0,
      slaDeadline: computeSlaDeadline(PLANS.START), createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      number: 3, type: ORDER_TYPES.VARIATION, status: ORDER_STATUSES.QA, clientId: client1.id,
      companyId: tashkentDev.id, assignedToId: designer.id, styleKeys: JSON.stringify(["modern", "scandi", "loft", "luxury", "minimal"]), roomType: "living", areaM2: 28,
      note: "5 ta stil varianti kerak.", priceUzs: 0,
      slaDeadline: computeSlaDeadline(PLANS.PRO), createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    },
    {
      number: 4, type: ORDER_TYPES.RENDER_3D, status: ORDER_STATUSES.DELIVERED, clientId: client3.id,
      companyId: personalClient.id, assignedToId: designer2.id, styleKeys: JSON.stringify(["eastern"]), roomType: "kitchen", areaM2: 12,
      note: "Oshxona, sharqona stil.", priceUzs: 400000,
      slaDeadline: computeSlaDeadline(PLANS.PAYG), createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      deliveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      number: 5, type: ORDER_TYPES.RENDER_3D, status: ORDER_STATUSES.REVISION, clientId: client2.id,
      companyId: samarkandRealty.id, assignedToId: designer2.id, styleKeys: JSON.stringify(["luxury"]), roomType: "living", areaM2: 40,
      note: "Ranglar ochroq bo'lsin.", priceUzs: 0, revisionsUsed: 1, revisionLimit: 2,
      slaDeadline: computeSlaDeadline(PLANS.START), createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000),
    },
  ];

  for (const o of orders) {
    const order = await db.order.create({ data: o });
    // Add an input asset for each
    await db.asset.create({
      data: {
        orderId: order.id,
        kind: "INPUT_PLAN",
        r2Key: "images/before-1.png",
        fileName: "floor_plan.png",
        mime: "image/png",
        sizeBytes: 240000,
        width: 1024,
        height: 1024,
      },
    });
    // For delivered order, add a RENDER asset
    if (o.status === ORDER_STATUSES.DELIVERED) {
      await db.asset.create({
        data: {
          orderId: order.id,
          kind: "RENDER",
          r2Key: "images/after-1.png",
          fileName: "render_final.png",
          mime: "image/png",
          sizeBytes: 580000,
          width: 1024,
          height: 1024,
        },
      });
      await db.payment.create({
        data: {
          orderId: order.id,
          companyId: o.companyId,
          provider: "PAYME",
          amountUzs: o.priceUzs,
          purpose: "order",
          status: "PAID",
          paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
      });
    }
    // For QA order, add AI variants
    if (o.status === ORDER_STATUSES.QA) {
      for (const s of ["modern", "scandi", "loft"]) {
        await db.asset.create({
          data: {
            orderId: order.id,
            kind: "AI_VARIANT",
            r2Key: `images/style-${s}.png`,
            fileName: `variant_${s}.png`,
            mime: "image/png",
            sizeBytes: 420000,
            width: 1024, height: 1024,
            isSelected: s === "modern",
          },
        });
      }
    }
    // Order events
    await db.orderEvent.create({
      data: { orderId: order.id, actorId: o.clientId, fromStatus: null, toStatus: ORDER_STATUSES.NEW, note: "Buyurtma yaratildi" },
    });
    if (o.assignedToId) {
      await db.orderEvent.create({
        data: { orderId: order.id, actorId: admin.id, fromStatus: ORDER_STATUSES.NEW, toStatus: ORDER_STATUSES.PROCESSING, note: "Dizaynerga biriktirildi" },
      });
    }
    if (o.status === ORDER_STATUSES.DELIVERED) {
      await db.orderEvent.create({
        data: { orderId: order.id, actorId: o.assignedToId || admin.id, fromStatus: ORDER_STATUSES.QA, toStatus: ORDER_STATUSES.DELIVERED, note: "Yetkazib berildi" },
      });
    }
    if (o.status === ORDER_STATUSES.REVISION) {
      await db.orderEvent.create({
        data: { orderId: order.id, actorId: o.clientId, fromStatus: ORDER_STATUSES.PROCESSING, toStatus: ORDER_STATUSES.REVISION, note: "Tahrir so'raldi" },
      });
    }
    if (o.status === ORDER_STATUSES.QA) {
      await db.orderEvent.create({
        data: { orderId: order.id, actorId: o.assignedToId || admin.id, fromStatus: ORDER_STATUSES.PROCESSING, toStatus: ORDER_STATUSES.QA, note: "Sifat nazoratiga o'tdi" },
      });
    }
  }
  console.log("✓ 5 orders with assets, payments, events");

  // A sample lead
  await db.lead.create({
    data: { name: "Jasur Karimov", phone: "+998945556677", company: "Yangi Bunyodkor", message: "Ofis binosi uchun render kerak", source: "landing" },
  });
  console.log("✓ 1 lead");

  // Designer stats
  await db.designerStat.create({ data: { designerId: designer.id, orderId: (await db.order.findFirst({ where: { number: 4 } }))!.id, minutesSpent: 45 } });
  console.log("✓ designer stats");

  console.log("\n🎉 Seed complete!");
  console.log("Demo logins (OTP: 123456 yoki MOCK kod UI'da ko'rinadi):");
  console.log("  ADMIN:    +998901234567 (Sardor)");
  console.log("  DESIGNER: +998902345678 (Dilnoza)");
  console.log("  CLIENT:   +998911112233 (Bekzod)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
