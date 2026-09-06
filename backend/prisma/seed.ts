import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ROLES = ["SUPER_ADMIN", "ADMIN", "BUSINESS_OWNER", "STAFF_CS"];

async function main() {
  console.log("Seeding database...");

  const roles: Record<string, { id: number }> = {};
  for (const name of ROLES) {
    const role = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    roles[name] = role;
    console.log(`  Role: ${name}`);
  }

  const passwordHash = await bcrypt.hash("admin123", 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@dreamcode.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@dreamcode.com",
      passwordHash,
      roleId: roles.SUPER_ADMIN.id,
      status: "ACTIVE",
    },
  });
  console.log("  User Super Admin: admin@dreamcode.com / admin123");

  const owner = await prisma.user.upsert({
    where: { email: "owner@dreamcode.com" },
    update: {},
    create: {
      name: "Business Owner",
      email: "owner@dreamcode.com",
      passwordHash,
      roleId: roles.BUSINESS_OWNER.id,
      status: "ACTIVE",
    },
  });
  console.log("  User Business Owner: owner@dreamcode.com / admin123");

  const staff = await prisma.user.upsert({
    where: { email: "staff@dreamcode.com" },
    update: {},
    create: {
      name: "Staff CS",
      email: "staff@dreamcode.com",
      passwordHash,
      roleId: roles.STAFF_CS.id,
      status: "ACTIVE",
    },
  });
  console.log("  User Staff CS: staff@dreamcode.com / admin123");

  // Sample business
  const business = await prisma.business.upsert({
    where: { id: 1 },
    update: {},
    create: {
      ownerId: owner.id,
      name: "Toko Online DreamShop",
      description: "Contoh bisnis untuk demo DreamCode BotWA",
      status: "ACTIVE",
    },
  });
  console.log(`  Business: ${business.name}`);

  const existingMembers = await prisma.businessMember.count({ where: { businessId: business.id } });
  if (existingMembers === 0) {
    await prisma.businessMember.createMany({
      data: [
        { businessId: business.id, userId: owner.id, roleId: roles.BUSINESS_OWNER.id, status: "ACTIVE" },
        { businessId: business.id, userId: staff.id, roleId: roles.STAFF_CS.id, status: "ACTIVE" },
      ],
    });
  }

  // Sample AI Agent
  let agent = await prisma.aiAgent.findFirst({ where: { businessId: business.id } });
  if (!agent) {
    agent = await prisma.aiAgent.create({
      data: {
        businessId: business.id,
        name: "DreamBot CS",
        systemPrompt: "Kamu adalah customer service yang ramah dan membantu untuk DreamShop. Jawab dalam bahasa Indonesia.",
        personality: "ramah",
        operatingHours: "24/7",
        status: "ACTIVE",
      },
    });
    console.log(`  AI Agent: ${agent.name}`);
  }

  // Sample Knowledge Base
  if ((await prisma.knowledgeBase.count({ where: { businessId: business.id } })) === 0) {
    await prisma.knowledgeBase.createMany({
      data: [
        { businessId: business.id, aiAgentId: agent.id, title: "Jam operasional toko", content: "Toko buka setiap hari 08.00 - 21.00 WIB.", sourceType: "FAQ" },
        { businessId: business.id, aiAgentId: agent.id, title: "Info pengiriman", content: "Pengiriman seluruh Indonesia via JNE, J&T, dan SiCepat.", sourceType: "FAQ" },
        { businessId: business.id, aiAgentId: agent.id, title: "Produk unggulan", content: "Produk unggulan kami: Sepatu Sport Rp 250.000, Tas Kulit Rp 350.000.", sourceType: "PRODUCT" },
      ],
    });
    console.log("  Knowledge Base: 3 item");
  }

  // Sample Customers
  const customerCount = await prisma.customer.count({ where: { businessId: business.id } });
  if (customerCount === 0) {
    await prisma.customer.createMany({
      data: [
        { businessId: business.id, name: "Andi", whatsapp: "6281234567890", productInterest: "Sepatu Sport", status: "NEW", source: "WHATSAPP", isSelected: true },
        { businessId: business.id, name: "Budi", whatsapp: "6289876543210", email: "budi@mail.com", productInterest: "Tas Kulit", status: "INTERESTED", source: "WHATSAPP" },
        { businessId: business.id, name: "Citra", whatsapp: "6285550001111", company: "PT Maju Jaya", productInterest: "Grosir Sepatu", status: "QUALIFIED", source: "EMAIL", isSelected: true },
        { businessId: business.id, name: "Dedi", whatsapp: "6281112223333", productInterest: "Tas Kulit", status: "DEAL", source: "WHATSAPP" },
      ],
    });
    console.log(`  Customers: 4 data`);
  } else {
    console.log(`  Customers: sudah ada (${customerCount} data)`);
  }

  // Sample Deal (untuk Dedi)
  const dedi = await prisma.customer.findFirst({ where: { businessId: business.id, name: "Dedi" } });
  if (dedi && (await prisma.deal.count({ where: { customerId: dedi.id } })) === 0) {
    await prisma.deal.create({
      data: {
        businessId: business.id,
        customerId: dedi.id,
        handledBy: staff.id,
        product: "Tas Kulit",
        quantity: 2,
        amount: 700000,
        paymentStatus: "PAID",
        status: "COMPLETED",
        dealDate: new Date(),
        source: "MANUAL",
      },
    });
    console.log("  Deal: Tas Kulit x2 Rp 700.000 (COMPLETED)");
  }

  // Sample Follow Up Settings
  if ((await prisma.followUpSetting.count({ where: { businessId: business.id } })) === 0) {
    await prisma.followUpSetting.create({
      data: {
        businessId: business.id,
        aiAgentId: agent.id,
        maxFollowUp: 3,
        intervalHours: 24,
        sendTimeStart: "09:00",
        sendTimeEnd: "18:00",
        sendDays: "MON,TUE,WED,THU,FRI",
        defaultTemplate: "Halo {name}, kami masih menunggu keputusan Anda mengenai {product}. Apakah ada yang bisa kami bantu?",
        stopConditions: "Berhenti jika customer sudah deal atau membalas pesan.",
      },
    });
    console.log("  FollowUpSetting: default");
  }

  // Sample Forbidden Rules
  if ((await prisma.forbiddenRule.count({ where: { businessId: business.id } })) === 0) {
    await prisma.forbiddenRule.createMany({
      data: [
        { businessId: business.id, name: "Nomor NIK", ruleType: "PATTERN", pattern: "\\d{16}", action: "MASK", active: true, retentionPolicy: "7d" },
        { businessId: business.id, name: "Password", ruleType: "KEYWORD", pattern: "password", action: "BLOCK", active: true, retentionPolicy: "30d" },
        { businessId: business.id, name: "Nomor Kartu", ruleType: "PATTERN", pattern: "\\d{4}-\\d{4}-\\d{4}-\\d{4}", action: "MASK", active: true, retentionPolicy: "30d" },
      ],
    });
    console.log("  ForbiddenRules: 3 rule");
  }

  // Sample Integration HubSpot
  if ((await prisma.integration.count({ where: { provider: "hubspot" } })) === 0) {
    await prisma.integration.createMany({
      data: [
        { businessId: business.id, provider: "hubspot", accessTokenEncrypted: "demo-encrypted-token", status: "DISCONNECTED", config: null },
      ],
    });
    console.log("  Integration: HubSpot (DISCONNECTED)");
  }

  // Sample Notifications
  if ((await prisma.notification.count({ where: { businessId: business.id } })) === 0) {
    await prisma.notification.createMany({
      data: [
        { businessId: business.id, userId: staff.id, type: "NEW_CUSTOMER", message: "Customer baru (Andi) masuk dan bertanya tentang Sepatu Sport", isRead: false },
        { businessId: business.id, type: "FOLLOW_UP", message: "3 follow-up terjadwal untuk hari ini", isRead: false },
      ],
    });
    console.log("  Notifications: 2 item");
  }

  console.log("\nSeeding selesai!");
  console.log("\nAkun demo:");
  console.log("  admin@dreamcode.com (SUPER_ADMIN)");
  console.log("  owner@dreamcode.com  (BUSINESS_OWNER)");
  console.log("  staff@dreamcode.com  (STAFF_CS)");
  console.log("  Password semua: admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });