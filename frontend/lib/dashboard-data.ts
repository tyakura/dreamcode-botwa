// ============================================================
// Mock data untuk User Dashboard & Admin Dashboard (Phase 1).
// Belum terhubung database/API — siap digantikan saat integrasi.
// ============================================================

export type CustomerStatus =
  | "NEW"
  | "CONTACTED"
  | "INTERESTED"
  | "QUALIFIED"
  | "NEGOTIATION"
  | "DEAL"
  | "LOST";

export type DealStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PAID"
  | "COMPLETED"
  | "CANCELLED";

export type FollowUpStatus =
  | "SCHEDULED"
  | "SENT"
  | "DELIVERED"
  | "REPLIED"
  | "FAILED"
  | "CANCELLED";

export type SyncStatus = "SYNCED" | "PENDING" | "FAILED";

export type ExportStatus = "PENDING" | "PROCESSING" | "DONE" | "FAILED";

// ------------------------------------------------------------
// Profil akun (mock login)
// ------------------------------------------------------------
export const dashboardUser = {
  name: "Ahmad Fauzi",
  email: "owner@dreamcode.com",
  role: "Business Owner",
  initials: "AF",
  business: "Toko Online DreamShop",
};

export const adminUser = {
  name: "Super Admin",
  email: "admin@dreamcode.com",
  role: "Super Admin",
  initials: "SA",
};

export type DashboardNotification = {
  id: number;
  type: "NEW_CUSTOMER" | "NEW_DEAL" | "EXPORT_DONE" | "FORBIDDEN_DATA" | "FOLLOW_UP";
  message: string;
  time: string;
  isRead: boolean;
};

export const userNotifications: DashboardNotification[] = [
  { id: 1, type: "NEW_CUSTOMER", message: "Customer baru (Andi) masuk dan bertanya tentang Sepatu Sport", time: "5 mnt lalu", isRead: false },
  { id: 2, type: "NEW_DEAL", message: "Potential deal terdeteksi — Budi tertarik Tas Kulit", time: "32 mnt lalu", isRead: false },
  { id: 3, type: "FOLLOW_UP", message: "3 follow-up terjadwal untuk hari ini", time: "1 jam lalu", isRead: false },
  { id: 4, type: "FORBIDDEN_DATA", message: "Data terlarang terdeteksi di percakapan Eka", time: "3 jam lalu", isRead: false },
  { id: 5, type: "EXPORT_DONE", message: "Export customer selesai — file siap diunduh", time: "5 jam lalu", isRead: true },
];

export const adminNotifications: DashboardNotification[] = [
  { id: 1, type: "NEW_CUSTOMER", message: "12 pelanggan baru terdaftar hari ini di semua bisnis", time: "10 mnt lalu", isRead: false },
  { id: 2, type: "NEW_DEAL", message: "Potential deal senilai Rp 4.800.000 menunggu konfirmasi", time: "1 jam lalu", isRead: false },
  { id: 3, type: "FOLLOW_UP", message: "24 follow-up dijadwalkan dalam 24 jam ke depan", time: "2 jam lalu", isRead: false },
  { id: 4, type: "FORBIDDEN_DATA", message: "3 kejadian data terlarang terdeteksi hari ini", time: "4 jam lalu", isRead: true },
];

// ------------------------------------------------------------
// USER: Overview
// ------------------------------------------------------------
export type UserStat = {
  label: string;
  value: string;
  sub?: string;
  up?: boolean;
};

export const userOverviewStats = {
  totalCustomers: 84,
  totalDeals: 12,
  prospects: 61,
  followUpsToday: 8,
  followUpsOverdue: 3,
  chats: 342,
  aiConversations: 298,
  conversionRate: 14.2,
};

export const userOverviewStatsList: UserStat[] = [
  { label: "Total Customer", value: "84", sub: "+8 minggu ini", up: true },
  { label: "Total Deal", value: "12", sub: "Rp 21,4 jt terkumpul", up: true },
  { label: "Prospek Aktif", value: "61", sub: "5 qualified", up: true },
  { label: "Follow-up Hari Ini", value: "8", sub: "3 tertunda", up: false },
];

export const customerStatusPipeline = [
  { status: "NEW", count: 24, color: "bg-muted" },
  { status: "CONTACTED", count: 18, color: "bg-muted" },
  { status: "INTERESTED", count: 13, color: "bg-warning" },
  { status: "QUALIFIED", count: 8, color: "bg-accent-dark" },
  { status: "NEGOTIATION", count: 5, color: "bg-accent" },
  { status: "DEAL", count: 12, color: "bg-success" },
  { status: "LOST", count: 4, color: "bg-danger" },
];

export const aiPerformance = {
  handledRate: 87,
  resolveRate: 89,
  handoffRate: 11,
  failedRate: 2,
  avgResponseTime: "12 dtk",
  requests: 1284,
  tokens: "412K",
};

// ------------------------------------------------------------
// Customer
// ------------------------------------------------------------
export type CustomerRecord = {
  id: number;
  name: string;
  whatsapp: string;
  email?: string;
  company?: string;
  productInterest: string;
  needs?: string;
  status: CustomerStatus;
  source: "WHATSAPP" | "EMAIL" | "MANUAL" | "WEB";
  isSelected: boolean;
  lastContactAt: string;
};

export const customers: CustomerRecord[] = [
  { id: 1, name: "Andi Saputra", whatsapp: "6281234567890", productInterest: "Sepatu Sport", needs: "Cari ukuran 42, warna hitam", status: "NEW", source: "WHATSAPP", isSelected: true, lastContactAt: "5 mnt lalu" },
  { id: 2, name: "Budi Santoso", whatsapp: "6289876543210", email: "budi@mail.com", company: "PT Karya Mandiri", productInterest: "Tas Kulit", needs: "Cocok untuk hadiah karyawan", status: "INTERESTED", source: "WHATSAPP", isSelected: false, lastContactAt: "32 mnt lalu" },
  { id: 3, name: "Citra Lestari", whatsapp: "6285550001111", email: "citra@majujaya.com", company: "PT Maju Jaya", productInterest: "Grosir Sepatu", needs: "Butuh 50 pasang untuk reseller", status: "QUALIFIED", source: "EMAIL", isSelected: true, lastContactAt: "3 jam lalu" },
  { id: 4, name: "Dedi Kurniawan", whatsapp: "6281112223333", email: "dedi@mail.com", productInterest: "Tas Kulit", needs: "Pembelian ulang", status: "DEAL", source: "WHATSAPP", isSelected: false, lastContactAt: "Kemarin" },
  { id: 5, name: "Eka Pratiwi", whatsapp: "6287778889999", email: "eka@gmail.com", productInterest: "Kopi Luwak", needs: "Tanya harga grosir", status: "CONTACTED", source: "WHATSAPP", isSelected: false, lastContactAt: "2 hari lalu" },
  { id: 6, name: "Fajar Ramadhan", whatsapp: "6283334445555", email: "fajar@umkm.co", company: "UMKM Sejahtera", productInterest: "Packaging Custom", needs: "Kebutuhan 100 pcs kemasan premium", status: "NEGOTIATION", source: "WEB", isSelected: true, lastContactAt: "1 hari lalu" },
  { id: 7, name: "Gita Permata", whatsapp: "6286667778888", productInterest: "Baju Seragam", needs: "Seragam tim 12 orang", status: "INTERESTED", source: "WHATSAPP", isSelected: false, lastContactAt: "4 hari lalu" },
  { id: 8, name: "Hendra Wijaya", whatsapp: "6289990001111", email: "hendra@tech.id", productInterest: "Gadget Aksesori", needs: "Menunggu budget approval", status: "QUALIFIED", source: "MANUAL", isSelected: false, lastContactAt: "Seminggu lalu" },
  { id: 9, name: "Indra Lesmana", whatsapp: "6282223334444", productInterest: "Kopi Luwak", needs: "Memilih kompetitor", status: "LOST", source: "WHATSAPP", isSelected: false, lastContactAt: "2 minggu lalu" },
];

export const customerStatusOptions: CustomerStatus[] = [
  "NEW",
  "CONTACTED",
  "INTERESTED",
  "QUALIFIED",
  "NEGOTIATION",
  "DEAL",
  "LOST",
];

// ------------------------------------------------------------
// Deal
// ------------------------------------------------------------
export type DealRecord = {
  id: number;
  customer: string;
  product: string;
  quantity: number;
  amount: number;
  paymentStatus: "UNPAID" | "PARTIAL" | "PAID";
  status: DealStatus;
  handledBy?: string;
  dealDate: string;
  notes?: string;
};

export const deals: DealRecord[] = [
  { id: 1, customer: "Citra Lestari", product: "Grosir Sepatu Sport", quantity: 50, amount: 12500000, paymentStatus: "PARTIAL", status: "CONFIRMED", handledBy: "Tono (CS)", dealDate: "Kemarin", notes: "DP 30% diterima" },
  { id: 2, customer: "Dedi Kurniawan", product: "Tas Kulit", quantity: 2, amount: 700000, paymentStatus: "PAID", status: "COMPLETED", handledBy: "Tono (CS)", dealDate: "Hari ini", notes: "Pembayaran lunas" },
  { id: 3, customer: "Fajar Ramadhan", product: "Packaging Custom", quantity: 100, amount: 4800000, paymentStatus: "UNPAID", status: "PENDING", dealDate: "2 hari lalu", notes: "Menunggu konfirmasi manusia" },
  { id: 4, customer: "Budi Santoso", product: "Tas Kulit", quantity: 1, amount: 350000, paymentStatus: "UNPAID", status: "PENDING", handledBy: "AI", dealDate: "Hari ini", notes: "Potential deal dari percakapan" },
  { id: 5, customer: "Eka Pratiwi", product: "Kopi Luwak (5 bungkus)", quantity: 5, amount: 900000, paymentStatus: "PAID", status: "PAID", handledBy: "Tono (CS)", dealDate: "3 hari lalu" },
  { id: 6, customer: "Hendra Wijaya", product: "Gadget Aksesori", quantity: 10, amount: 2750000, paymentStatus: "UNPAID", status: "CANCELLED", handledBy: "AI", dealDate: "5 hari lalu", notes: "Budget tidak disetujui" },
];

export const dealRevenueThisMonth = [
  { month: "Apr", value: 3.2 },
  { month: "Mei", value: 4.1 },
  { month: "Jun", value: 5.4 },
  { month: "Jul", value: 4.8 },
  { month: "Agu", value: 6.3 },
  { month: "Sep", value: 7.2 },
];

// ------------------------------------------------------------
// Conversation
// ------------------------------------------------------------
export type ConversationRecord = {
  id: number;
  customer: string;
  whatsapp: string;
  lastMessage: string;
  mode: "AI" | "HUMAN";
  status: "OPEN" | "CLOSED" | "PENDING";
  assignedTo?: string;
  updatedAt: string;
  aiGenerated: boolean;
};

export const conversations: ConversationRecord[] = [
  { id: 1, customer: "Andi Saputra", whatsapp: "6281234567890", lastMessage: "Halo kak, sepatu sport ukuran berapa saja tersedia?", mode: "AI", status: "OPEN", updatedAt: "5 mnt lalu", aiGenerated: true },
  { id: 2, customer: "Budi Santoso", whatsapp: "6289876543210", lastMessage: "Apakah ada promo untuk Tas Kulit bulan ini?", mode: "AI", status: "OPEN", updatedAt: "32 mnt lalu", aiGenerated: true },
  { id: 3, customer: "Citra Lestari", whatsapp: "6285550001111", lastMessage: "Minta penawaran grosir sepatu 50 pasang dong", mode: "AI", status: "PENDING", updatedAt: "3 jam lalu", aiGenerated: true },
  { id: 4, customer: "Dedi Kurniawan", whatsapp: "6281112223333", lastMessage: "Oke sudah saya transfer ya kak", mode: "HUMAN", status: "CLOSED", assignedTo: "Tono (CS)", updatedAt: "Kemarin", aiGenerated: false },
  { id: 5, customer: "Eka Pratiwi", whatsapp: "6287778889999", lastMessage: "Nomor kartu saya 4111-2222-3333-4444...", mode: "AI", status: "CLOSED", updatedAt: "2 hari lalu", aiGenerated: true },
  { id: 6, customer: "Fajar Ramadhan", whatsapp: "6283334445555", lastMessage: "Bisa kirim contoh packaging-nya?", mode: "HUMAN", status: "OPEN", assignedTo: "Rina (CS)", updatedAt: "1 hari lalu", aiGenerated: false },
];

export const conversationSummary = {
  open: 12,
  pending: 4,
  closed: 326,
  totalMessages: 1482,
  aiHandled: 298,
};

// ------------------------------------------------------------
// Follow Up
// ------------------------------------------------------------
export type FollowUpRecord = {
  id: number;
  customer: string;
  channel: "WHATSAPP" | "EMAIL";
  type: "MANUAL" | "AUTOMATIC";
  scheduledAt: string;
  message: string;
  status: FollowUpStatus;
  sentAt?: string;
};

export const followUps: FollowUpRecord[] = [
  { id: 1, customer: "Budi Santoso", channel: "WHATSAPP", type: "MANUAL", scheduledAt: "Hari ini 14:00", message: "Halo Budi, masih tertarik dengan Tas Kulit? Kami ada promo akhir bulan lho.", status: "SCHEDULED" },
  { id: 2, customer: "Fajar Ramadhan", channel: "WHATSAPP", type: "AUTOMATIC", scheduledAt: "Hari ini 10:30", message: "Halo Fajar, kami masih menunggu keputusan Anda mengenai Packaging Custom.", status: "SCHEDULED" },
  { id: 3, customer: "Citra Lestari", channel: "EMAIL", type: "AUTOMATIC", scheduledAt: "Kemarin 09:00", message: "Berikut penawaran grosir sepatu yang Anda minta.", status: "SENT", sentAt: "Kemarin 09:02" },
  { id: 4, customer: "Gita Permata", channel: "WHATSAPP", type: "AUTOMATIC", scheduledAt: "2 hari lalu 11:00", message: "Halo Gita, ada kabar tentang seragam tim Anda?", status: "REPLIED", sentAt: "2 hari lalu 11:01" },
  { id: 5, customer: "Hendra Wijaya", channel: "WHATSAPP", type: "MANUAL", scheduledAt: "3 hari lalu", message: "Follow-up budget approval untuk Gadget Aksesori.", status: "FAILED", sentAt: "3 hari lalu" },
  { id: 6, customer: "Indra Lesmana", channel: "EMAIL", type: "AUTOMATIC", scheduledAt: "1 minggu lalu", message: "Kami berhenti follow-up karena Anda memilih kompetitor.", status: "CANCELLED" },
];

export const followUpSummary = {
  scheduledToday: 8,
  scheduledTotal: 21,
  sent: 9,
  replied: 4,
  failed: 2,
};

export const followUpSettings = {
  maxFollowUp: 3,
  intervalHours: 24,
  sendTimeStart: "09:00",
  sendTimeEnd: "18:00",
  sendDays: "Senin – Jumat",
  defaultTemplate: "Halo {name}, kami masih menunggu keputusan Anda mengenai {product}. Apakah ada yang bisa kami bantu?",
  stopConditions: "Berhenti jika customer sudah deal, membalas, meminta berhenti, atau masuk forbidden list.",
};

// ------------------------------------------------------------
// Forbidden Data
// ------------------------------------------------------------
export type ForbiddenRuleRecord = {
  id: number;
  name: string;
  ruleType: "KEYWORD" | "PATTERN" | "FIELD";
  pattern: string;
  action: "MASK" | "BLOCK" | "FLAG";
  active: boolean;
  retention: string;
};

export type ForbiddenEventRecord = {
  id: number;
  rule: string;
  customer: string;
  conversation: string;
  detectedValueMasked: string;
  actionTaken: "MASK" | "BLOCK" | "FLAG";
  createdAt: string;
};

export const forbiddenRules: ForbiddenRuleRecord[] = [
  { id: 1, name: "Nomor NIK", ruleType: "PATTERN", pattern: "\\d{16}", action: "MASK", active: true, retention: "7 hari" },
  { id: 2, name: "Nomor Kartu", ruleType: "PATTERN", pattern: "\\d{4}-\\d{4}-\\d{4}-\\d{4}", action: "MASK", active: true, retention: "30 hari" },
  { id: 3, name: "Password", ruleType: "KEYWORD", pattern: "password", action: "BLOCK", active: true, retention: "30 hari" },
  { id: 4, name: "Alamat Rumah", ruleType: "FIELD", pattern: "^(Jl|Jl\\.|Jalan) ", action: "MASK", active: true, retention: "24 jam" },
  { id: 5, name: "Nomor Rekening", ruleType: "PATTERN", pattern: "\\d{10,14}", action: "BLOCK", active: false, retention: "30 hari" },
];

export const forbiddenEvents: ForbiddenEventRecord[] = [
  { id: 1, rule: "Nomor Kartu", customer: "Eka Pratiwi", conversation: "Chat #5", detectedValueMasked: "4•••-••••-••••-4444", actionTaken: "MASK", createdAt: "2 hari lalu" },
  { id: 2, rule: "Alamat Rumah", customer: "Andi Saputra", conversation: "Chat #1", detectedValueMasked: "Jl. ••••••••••", actionTaken: "MASK", createdAt: "1 hari lalu" },
  { id: 3, rule: "Nomor NIK", customer: "Hendra Wijaya", conversation: "Chat #8", detectedValueMasked: "3•••••••••••••1", actionTaken: "MASK", createdAt: "3 hari lalu" },
  { id: 4, rule: "Password", customer: "Gita Permata", conversation: "Chat #7", detectedValueMasked: "[DIBLOKIR]", actionTaken: "BLOCK", createdAt: "4 hari lalu" },
];

export const forbiddenSummary = {
  totalRules: 5,
  activeRules: 4,
  eventsToday: 3,
  masked: 12,
  blocked: 2,
};

// ------------------------------------------------------------
// Integrations (User)
// ------------------------------------------------------------
export type IntegrationRecord = {
  id: number;
  provider: string;
  name: string;
  status: "CONNECTED" | "DISCONNECTED" | "NOT_CONFIGURED";
  description: string;
  lastSync?: string;
};

export const userIntegrations: IntegrationRecord[] = [
  { id: 1, provider: "hubspot", name: "HubSpot CRM", status: "DISCONNECTED", description: "Sinkronkan customer, deal, dan follow-up ke HubSpot." },
  { id: 2, provider: "whatsapp", name: "WhatsApp Business API", status: "CONNECTED", description: "Kanal utama percakapan pelanggan.", lastSync: "Online" },
  { id: 3, provider: "email", name: "Email Provider (SMTP)", status: "NOT_CONFIGURED", description: "Kirim follow-up otomatis via email." },
  { id: 4, provider: "webhook", name: "Custom Webhook", status: "NOT_CONFIGURED", description: "Kirim data event ke sistem lain." },
];

export const hubspotSyncLogs: { id: number; entityType: "CUSTOMER" | "DEAL"; entity: string; syncStatus: SyncStatus; error?: string; syncedAt: string }[] = [
  { id: 1, entityType: "CUSTOMER", entity: "Citra Lestari", syncStatus: "SYNCED", syncedAt: "Kemarin 09:05" },
  { id: 2, entityType: "DEAL", entity: "Deal #1 — Grosir Sepatu", syncStatus: "SYNCED", syncedAt: "Kemarin 09:06" },
  { id: 3, entityType: "CUSTOMER", entity: "Indra Lesmana", syncStatus: "FAILED", error: "Token HubSpot tidak valid", syncedAt: "2 hari lalu" },
  { id: 4, entityType: "DEAL", entity: "Deal #3 — Packaging", syncStatus: "PENDING", syncedAt: "Menunggu antrian" },
];

// ------------------------------------------------------------
// WhatsApp (User)
// ------------------------------------------------------------
export type WebhookEvent = {
  id: number;
  event: string;
  detail: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  time: string;
};

export const whatsappStatus = {
  number: "+62 812-3456-7890",
  connected: true,
  webhookActive: true,
  autoReply: true,
  aiAgentActive: true,
  lastEventAt: "5 mnt lalu",
  incomingToday: 42,
  outgoingToday: 58,
};

export const webhookEvents: WebhookEvent[] = [
  { id: 1, event: "message.inbound", detail: "Pesan masuk dari Andi Saputra", status: "SUCCESS", time: "5 mnt lalu" },
  { id: 2, event: "message.outbound", detail: "Balasan AI dikirim ke Andi Saputra", status: "SUCCESS", time: "5 mnt lalu" },
  { id: 3, event: "message.inbound", detail: "Pesan masuk dari Budi Santoso", status: "SUCCESS", time: "32 mnt lalu" },
  { id: 4, event: "webhook.verify", detail: "Verifikasi signature berhasil", status: "SUCCESS", time: "1 jam lalu" },
  { id: 5, event: "message.outbound", detail: "Pesan ke Citra Lestari gagal terkirim", status: "FAILED", time: "3 jam lalu" },
  { id: 6, event: "connection.status", detail: "Koneksi WhatsApp terpelihara", status: "PENDING", time: "4 jam lalu" },
];

// ------------------------------------------------------------
// Export
// ------------------------------------------------------------
export type ExportJobRecord = {
  id: number;
  filter: string;
  status: ExportStatus;
  requestedBy: string;
  createdAt: string;
  completedAt?: string;
  rowCount?: number;
};

export const exportJobs: ExportJobRecord[] = [
  { id: 1, filter: 'Status: QUALIFIED · Sumber: Semua · Tanggal: 1–30 Sep', status: "DONE", requestedBy: "Ahmad Fauzi", createdAt: "Hari ini 08:10", completedAt: "Hari ini 08:11", rowCount: 128 },
  { id: 2, filter: 'Status: Semua · Sumber: WHATSAPP', status: "PROCESSING", requestedBy: "Rina (CS)", createdAt: "Hari ini 10:20" },
  { id: 3, filter: 'Status: INTERESTED · Produk: Tas Kulit', status: "PENDING", requestedBy: "Tono (CS)", createdAt: "Hari ini 10:45" },
  { id: 4, filter: 'Deal · Tanggal: 1–31 Agu', status: "FAILED", requestedBy: "Ahmad Fauzi", createdAt: "Kemarin 16:00", completedAt: "Kemarin 16:01" },
];

export const exportFilters = {
  status: ["Semua", "NEW", "CONTACTED", "INTERESTED", "QUALIFIED", "NEGOTIATION", "DEAL", "LOST"],
  source: ["Semua", "WHATSAPP", "EMAIL", "MANUAL", "WEB"],
  products: ["Semua", "Sepatu Sport", "Tas Kulit", "Kopi Luwak", "Packaging Custom", "Baju Seragam"],
};

// ------------------------------------------------------------
// AI Agent & Knowledge Base (User)
// ------------------------------------------------------------
export type AiAgentRecord = {
  id: number;
  businessId?: number;
  business?: string;
  name: string;
  personality: string;
  operatingHours: string;
  status: "ACTIVE" | "INACTIVE";
  systemPrompt: string;
  requests: number;
  failed: number;
  escalationRate: number;
  tokens: string;
};

export const aiAgents: AiAgentRecord[] = [
  {
    id: 1,
    businessId: 1,
    business: "Toko Online DreamShop",
    name: "DreamBot CS",
    personality: "Ramah, santai, cepat",
    operatingHours: "24/7",
    status: "ACTIVE",
    systemPrompt: "Kamu adalah customer service yang ramah dan membantu untuk DreamShop. Jawab dalam bahasa Indonesia, singkat, dan tawarkan produk sesuai kebutuhan.",
    requests: 1284,
    failed: 23,
    escalationRate: 11,
    tokens: "412K",
  },
];

export type KnowledgeBaseItem = {
  id: number;
  title: string;
  content: string;
  sourceType: "FAQ" | "PRODUCT" | "DOCUMENT" | "MANUAL";
};

export const knowledgeBase: KnowledgeBaseItem[] = [
  { id: 1, title: "Jam operasional toko", content: "Toko buka setiap hari 08.00 - 21.00 WIB.", sourceType: "FAQ" },
  { id: 2, title: "Info pengiriman", content: "Pengiriman seluruh Indonesia via JNE, J&T, dan SiCepat. Estimasi 2–5 hari kerja.", sourceType: "FAQ" },
  { id: 3, title: "Produk unggulan", content: "Sepatu Sport Rp 250.000 · Tas Kulit Rp 350.000 · Kopi Luwak Rp 180.000/bungkus.", sourceType: "PRODUCT" },
  { id: 4, title: "Price list grosir", content: "Potongan 15% untuk pembelian di atas 20 pcs. Pengiriman gratis untuk min. Rp 5 jt.", sourceType: "PRODUCT" },
  { id: 5, title: "Panduan perawatan produk", content: "Simpan tas kulit di tempat kering, jauh dari sinar matahari langsung.", sourceType: "DOCUMENT" },
];

export const agentSetting = {
  name: "DreamBot CS",
  personality: "Ramah, santai, cepat",
  description: "AI agent untuk Customer Service Toko Online DreamShop",
  operatingHours: "24/7",
  humanHandoffTrigger: "Saat AI tidak yakin menjawab atau customer meminta CS manusia.",
};

// ------------------------------------------------------------
// Settings (User)
// ------------------------------------------------------------
export const userSettings = {
  business: { name: "Toko Online DreamShop", description: "Menjual produk fashion, kopi, dan packaging custom.", email: "owner@dreamcode.com", phone: "+62 812-3456-7890" },
  notify: {
    newCustomer: true,
    highIntent: true,
    potentialDeal: true,
    dealConfirmed: true,
    aiNeedsHelp: true,
    followUpFailed: true,
    whatsappDisconnected: true,
    hubspotSyncFailed: false,
  },
};

// ============================================================
// ADMIN
// ============================================================
export const adminOverviewStatsList: UserStat[] = [
  { label: "Total Bisnis", value: "128", sub: "+6 minggu ini", up: true },
  { label: "User Aktif", value: "412", sub: "98% aktif", up: true },
  { label: "AI Agent Aktif", value: "96", sub: "75% dari total", up: true },
  { label: "Koneksi WhatsApp", value: "80", sub: "3 perlu perhatian", up: false },
];

export type SystemCounters = {
  totalBusinesses: number;
  totalUsers: number;
  activeUsers: number;
  activeAgents: number;
  whatsappConnections: number;
  totalCustomers: number;
  totalDeals: number;
  totalConversations: number;
  followUpVolume: number;
  systemErrors: number;
};

export const systemCounters: SystemCounters = {
  totalBusinesses: 128,
  totalUsers: 420,
  activeUsers: 412,
  activeAgents: 96,
  whatsappConnections: 80,
  totalCustomers: 14320,
  totalDeals: 2310,
  totalConversations: 96210,
  followUpVolume: 1840,
  systemErrors: 3,
};

export const platformHealth = [
  { label: "Error rate (24 jam)", value: 0.4, ok: true },
  { label: "Response time API", value: 240, unit: "ms", ok: true },
  { label: "Uptime bulan ini", value: 99.9, unit: "%", ok: true },
  { label: "Antrian job (queue)", value: 12, unit: "pekerjaan", ok: true },
];

export type AdminUserRecord = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE";
  activeBusinesses: number;
  aiUsage: string;
  joinedAt: string;
};

export const adminUsers: AdminUserRecord[] = [
  { id: 1, name: "Super Admin", email: "admin@dreamcode.com", role: "SUPER_ADMIN", status: "ACTIVE", activeBusinesses: 1, aiUsage: "—", joinedAt: "1 Jan 2026" },
  { id: 2, name: "Admin Platform", email: "platform@dreamcode.com", role: "ADMIN", status: "ACTIVE", activeBusinesses: 1, aiUsage: "—", joinedAt: "10 Feb 2026" },
  { id: 3, name: "Ahmad Fauzi", email: "owner@dreamcode.com", role: "BUSINESS_OWNER", status: "ACTIVE", activeBusinesses: 2, aiUsage: "41K pesan", joinedAt: "5 Mar 2026" },
  { id: 4, name: "Siti Rahma", email: "siti@kopinusantara.co", role: "BUSINESS_OWNER", status: "ACTIVE", activeBusinesses: 1, aiUsage: "18K pesan", joinedAt: "14 Apr 2026" },
  { id: 5, name: "Bima Putra", email: "bima@laundryexpress.id", role: "BUSINESS_OWNER", status: "SUSPENDED", activeBusinesses: 1, aiUsage: "3K pesan", joinedAt: "2 Jun 2026" },
  { id: 6, name: "Staff CS DreamShop", email: "staff@dreamcode.com", role: "STAFF_CS", status: "ACTIVE", activeBusinesses: 1, aiUsage: "6K pesan", joinedAt: "22 Jul 2026" },
];

export const userRoleCount = { total: 420, active: 412, suspended: 6, inactive: 2 };

export type AdminBusinessRecord = {
  id: number;
  name: string;
  owner: string;
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE";
  agents: number;
  customers: number;
  integration: "CONNECTED" | "DISCONNECTED" | "NONE";
  createdAt: string;
};

export const adminBusinesses: AdminBusinessRecord[] = [
  { id: 1, name: "Toko Online DreamShop", owner: "Ahmad Fauzi", status: "ACTIVE", agents: 1, customers: 84, integration: "DISCONNECTED", createdAt: "5 Mar 2026" },
  { id: 2, name: "Kopi Nusantara", owner: "Siti Rahma", status: "ACTIVE", agents: 1, customers: 152, integration: "CONNECTED", createdAt: "14 Apr 2026" },
  { id: 3, name: "Laundry Express", owner: "Bima Putra", status: "SUSPENDED", agents: 0, customers: 37, integration: "NONE", createdAt: "2 Jun 2026" },
  { id: 4, name: "Tokos Serba Ada", owner: "Yoga Pratama", status: "ACTIVE", agents: 2, customers: 203, integration: "DISCONNECTED", createdAt: "18 Aug 2026" },
];

export const adminAiAgents: AiAgentRecord[] = [
  { id: 1, businessId: 1, business: "DreamShop", name: "DreamBot CS", personality: "Ramah", operatingHours: "24/7", status: "ACTIVE", systemPrompt: "Customer service DreamShop.", requests: 1284, failed: 23, escalationRate: 11, tokens: "412K" },
  { id: 2, businessId: 2, business: "Kopi Nusantara", name: "KopiBot", personality: "Ceria", operatingHours: "08:00–22:00", status: "ACTIVE", systemPrompt: "Bantu pelanggan memilih kopi.", requests: 986, failed: 12, escalationRate: 8, tokens: "318K" },
  { id: 3, businessId: 4, business: "Tokos Serba Ada", name: "TokoBot", personality: "Santai", operatingHours: "24/7", status: "ACTIVE", systemPrompt: "Katalog toko serba ada.", requests: 2311, failed: 41, escalationRate: 14, tokens: "702K" },
  { id: 4, businessId: 4, business: "Tokos Serba Ada", name: "PromoBot", personality: "Semangat", operatingHours: "09:00–18:00", status: "INACTIVE", systemPrompt: "Promosi produk.", requests: 0, failed: 0, escalationRate: 0, tokens: "0" },
];

export const adminAgentTotals = {
  totalAgents: 128,
  activeAgents: 96,
  requestsTotal: "2,4 jt",
  failedRequests: "41,2 rb",
  avgEscalation: 12,
};

export type AdminCustomerRecord = {
  id: number;
  business: string;
  name: string;
  whatsapp: string;
  product: string;
  status: CustomerStatus;
  source: string;
  updatedAt: string;
};

export const adminCustomers: AdminCustomerRecord[] = [
  { id: 1, business: "DreamShop", name: "Andi Saputra", whatsapp: "6281234567890", product: "Sepatu Sport", status: "NEW", source: "WHATSAPP", updatedAt: "5 mnt lalu" },
  { id: 2, business: "Kopi Nusantara", name: "Rara Kirana", whatsapp: "6284445556666", product: "Kopi Robusta", status: "INTERESTED", source: "WHATSAPP", updatedAt: "20 mnt lalu" },
  { id: 3, business: "Tokos Serba Ada", name: "Dimas Anggoro", whatsapp: "6287778889999", product: "Elektronik", status: "QUALIFIED", source: "WEB", updatedAt: "1 jam lalu" },
  { id: 4, business: "DreamShop", name: "Citra Lestari", whatsapp: "6285550001111", product: "Grosir Sepatu", status: "QUALIFIED", source: "EMAIL", updatedAt: "3 jam lalu" },
  { id: 5, business: "Laundry Express", name: "Nina Sari", whatsapp: "6281231231234", product: "Laundry Kilat", status: "DEAL", source: "WHATSAPP", updatedAt: "Kemarin" },
  { id: 6, business: "Kopi Nusantara", name: "Fajar Ramadhan", whatsapp: "6283334445555", product: "Packaging Custom", status: "NEGOTIATION", source: "WEB", updatedAt: "1 hari lalu" },
];

export type AdminDealRecord = {
  id: number;
  business: string;
  customer: string;
  product: string;
  amount: number;
  paymentStatus: string;
  status: DealStatus;
  date: string;
};

export const adminDeals: AdminDealRecord[] = [
  { id: 1, business: "DreamShop", customer: "Citra Lestari", product: "Grosir Sepatu Sport", amount: 12500000, paymentStatus: "PARTIAL", status: "CONFIRMED", date: "Kemarin" },
  { id: 2, business: "DreamShop", customer: "Dedi Kurniawan", product: "Tas Kulit", amount: 700000, paymentStatus: "PAID", status: "COMPLETED", date: "Hari ini" },
  { id: 3, business: "Kopi Nusantara", customer: "Rara Kirana", product: "Kopi Robusta 10kg", amount: 1900000, paymentStatus: "UNPAID", status: "PENDING", date: "Hari ini" },
  { id: 4, business: "Tokos Serba Ada", customer: "Dimas Anggoro", product: "Elektronik Paket A", amount: 8500000, paymentStatus: "PAID", status: "PAID", date: "2 hari lalu" },
  { id: 5, business: "Laundry Express", customer: "Nina Sari", product: "Langganan Bulanan", amount: 350000, paymentStatus: "UNPAID", status: "CANCELLED", date: "3 hari lalu" },
];

export type AdminFollowUpRecord = {
  id: number;
  business: string;
  customer: string;
  channel: string;
  scheduledAt: string;
  status: FollowUpStatus;
};

export const adminFollowUps: AdminFollowUpRecord[] = [
  { id: 1, business: "DreamShop", customer: "Budi Santoso", channel: "WHATSAPP", scheduledAt: "Hari ini 14:00", status: "SCHEDULED" },
  { id: 2, business: "Kopi Nusantara", customer: "Rara Kirana", channel: "EMAIL", scheduledAt: "Hari ini 09:30", status: "SCHEDULED" },
  { id: 3, business: "DreamShop", customer: "Citra Lestari", channel: "EMAIL", scheduledAt: "Kemarin 09:00", status: "SENT" },
  { id: 4, business: "Tokos Serba Ada", customer: "Dimas Anggoro", channel: "WHATSAPP", scheduledAt: "2 hari lalu", status: "REPLIED" },
  { id: 5, business: "Laundry Express", customer: "Nina Sari", channel: "WHATSAPP", scheduledAt: "3 hari lalu", status: "FAILED" },
];

export const adminForbiddenSummary = {
  totalRules: 312,
  activeRules: 268,
  eventsToday: 11,
  masked: 48,
  blocked: 3,
};

export const adminForbiddenEvents = forbiddenEvents.map((e) => ({ ...e, business: "DreamShop" }));

export const adminSyncLogs = hubspotSyncLogs.map((l) => ({ ...l, business: l.entityType === "CUSTOMER" ? "Kopi Nusantara" : "DreamShop" }));

export type AuditLogRecord = {
  id: number;
  business?: string;
  user: string;
  action: string;
  entity: string;
  entityId: number;
  metadata: string;
  createdAt: string;
};

export const auditLogs: AuditLogRecord[] = [
  { id: 1, business: "DreamShop", user: "Ahmad Fauzi", action: "customer.update", entity: "Customer", entityId: 3, metadata: '{"status":"QUALIFIED"}', createdAt: "Hari ini 10:42" },
  { id: 2, business: "DreamShop", user: "AI System", action: "deal.create", entity: "Deal", entityId: 4, metadata: '{"source":"AI_DETECTION"}', createdAt: "Hari ini 10:15" },
  { id: 3, business: "Kopi Nusantara", user: "Siti Rahma", action: "integration.connect", entity: "Integration", entityId: 2, metadata: '{"provider":"hubspot"}', createdAt: "Hari ini 09:58" },
  { id: 4, business: "Laundry Express", user: "Super Admin", action: "business.suspend", entity: "Business", entityId: 3, metadata: '{"reason":"pelanggaran"}', createdAt: "Kemarin 17:20" },
  { id: 5, business: undefined, user: "Super Admin", action: "user.update", entity: "User", entityId: 5, metadata: '{"status":"SUSPENDED"}', createdAt: "Kemarin 17:21" },
  { id: 6, business: "DreamShop", user: "Tono (CS)", action: "followup.create", entity: "FollowUp", entityId: 1, metadata: '{"channel":"WHATSAPP"}', createdAt: "3 hari lalu 11:05" },
];

export const systemErrorLogs = [
  { id: 1, level: "ERROR", message: "HubSpot sync timeout pada token #412", stack: "IntegrationService", time: "Hari ini 02:14" },
  { id: 2, level: "ERROR", message: "Webhook WhatsApp signature invalid", stack: "WhatsappController", time: "Kemarin 23:40" },
  { id: 3, level: "WARN", message: "Follow-up scheduler late 4 menit", stack: "FollowUpCron", time: "Kemarin 09:03" },
];

export const platformSettings = {
  name: "AI WhatsApp Business Agent",
  environment: "development",
  jwtExpiry: "7 hari",
  rateLimit: "100 req/menit",
  signupMode: "Terbuka",
  maintenanceMode: false,
  defaultTimezone: "Asia/Jakarta",
};