# Product Requirements Document (PRD)
# AI WhatsApp Business Agent + Mini CRM

**Versi:** 1.0
**Tanggal:** 5 September 2026
**Status:** Draft

---

## 1. Ringkasan Produk

**Nama Produk:** AI WhatsApp Business Agent

**Deskripsi Singkat:**
Platform SaaS yang membantu bisnis mengotomatisasi Customer Service melalui WhatsApp menggunakan AI Agent. Setiap percakapan WhatsApp diubah menjadi data pelanggan terstruktur, dipantau melalui pipeline prospek → deal, dan dapat difollow-up otomatis maupun disinkronkan ke HubSpot.

**Visi Produk:**
> "Setiap chat pelanggan tidak lagi hilang sebagai percakapan, tetapi berubah menjadi data dan peluang bisnis yang dapat ditindaklanjuti."

**Target Pengguna:**
- Pemilik bisnis kecil-menengah (UMKM–enterprise) yang menggunakan WhatsApp sebagai kanal utama penjualan/CS.
- Tim Customer Service & Sales yang ingin mengurangi pekerjaan manual berulang.
- Platform owner/tim internal yang mengelola seluruh sistem multi-tenant.

**Masalah yang Diselesaikan:**
| Masalah | Solusi |
|---|---|
| CS tidak online 24 jam | AI Agent menjawab otomatis kapan saja |
| Chat pelanggan tidak terdata | Percakapan otomatis diubah jadi data terstruktur |
| Calon pelanggan lupa di-follow-up | Follow-up terjadwal otomatis (WhatsApp/Email) |
| Data dicatat manual | Ekstraksi data otomatis dari percakapan |
| Data deal dipindah manual | Deal record otomatis + notifikasi sales |
| CS lelah menjawab pertanyaan berulang | AI menangani FAQ, eskalasi hanya jika perlu |

---

## 2. Tujuan & Success Metrics

**Tujuan Utama:**
- Menjawab pelanggan 24 jam via AI.
- Mengklasifikasi pelanggan: prospek, deal, dan data terlarang.
- Otomatisasi follow-up dan ekspor data.
- Integrasi opsional ke HubSpot.

**Metrics yang Diukur:**
- Jumlah conversation & volume pesan WhatsApp
- AI response rate & AI resolution rate
- Human handoff rate
- Customer acquisition & prospect conversion rate
- Deal conversion rate
- Follow-up response & conversion rate
- Average response time
- Failed AI response rate

---

## 3. Cakupan Sistem (Scope)

Platform terdiri dari 3 bagian utama:

1. **Landing Page** — edukasi & akuisisi calon pengguna.
2. **User Dashboard** — pusat kontrol untuk bisnis/klien.
3. **Admin Dashboard** — pengelolaan platform oleh tim internal.

### Sitemap

```
/
├── Landing Page
├── Pricing
├── Features
├── Documentation
├── Login
├── Register
│
├── /dashboard
│   ├── Overview
│   ├── AI Agent
│   ├── Customer Service (Conversations)
│   ├── Customer Data (Prospect)
│   ├── Deal Data
│   ├── Follow Up
│   ├── Forbidden Data
│   ├── Integrations
│   ├── WhatsApp
│   ├── Export
│   └── Settings
│
└── /admin
    ├── Overview
    ├── Users
    ├── Businesses
    ├── AI Agents
    ├── Customer Data
    ├── Deals
    ├── Follow Ups
    ├── Forbidden Data
    ├── Integrations
    ├── System Logs
    └── Settings
```

---

## 4. Desain & Sistem Visual (UI Guidelines)

Gaya desain mengikuti referensi **Biztop** dengan pendekatan **simple, clean, dan modern SaaS**, minim ornamen, banyak white space, dan aksen hijau sebagai identitas brand.

### 4.1 Prinsip Desain

- **Simple & clean** — hindari elemen dekoratif berlebihan.
- **Konsisten** — satu sistem spacing, radius, dan tipografi di semua halaman.
- **Card-based** — statistik dan data utama ditampilkan dalam card.
- **Responsive** — mobile-first, karena target user sering cek dashboard dari HP.
- **Aksesibel** — kontras warna teks terhadap background harus tetap terbaca.

### 4.2 Palet Warna

Diambil langsung dari referensi desain yang diberikan.

| Nama | Hex | Penggunaan |
|---|---|---|
| **Primary Dark (Deep Green)** | `#152A24` | Header, sidebar, hero section, teks heading utama, tombol dark |
| **Primary Accent (Lime Green)** | `#A6E24D` | Tombol CTA utama, highlight teks, badge, ikon aktif, chart accent |
| **Background Cream** | `#F5F1E6` | Background section sekunder, card alternatif |
| **Background White** | `#FFFFFF` | Background utama dashboard/card |
| **Text Body (Gray)** | `#4A4A4A` | Paragraf, deskripsi, teks sekunder |
| **Text Heading (Near Black Green)** | `#0F1F1B` | Judul, heading, teks penting |
| **Border/Divider** | `#E5E1D6` | Garis pemisah, border card |
| **Success** | `#3FB27F` | Status "Deal", "Connected", "Synced" |
| **Warning** | `#E8B84B` | Status "Pending", "Follow Up Tertunda" |
| **Danger** | `#E05D5D` | Status "Failed", "Forbidden Data", error state |

**Aturan pemakaian warna:**
- Lime green (`#A6E24D`) hanya untuk elemen interaktif/penting (tombol utama, badge status positif, ikon aktif) — jangan dipakai sebagai warna teks body karena kontrasnya rendah di atas putih.
- Deep green (`#152A24`) dipakai untuk sidebar & header agar dashboard terasa premium dan fokus.
- Background dashboard menggunakan kombinasi putih & cream secara bergantian antar section, mengikuti pola pada referensi (tidak monoton).

### 4.3 Tipografi

- **Font:** Sans-serif modern (contoh: Inter, Poppins, atau Plus Jakarta Sans).
- **Heading:** Bold, ukuran besar, warna `#0F1F1B`.
- **Body:** Regular, warna `#4A4A4A`, line-height nyaman dibaca (1.5–1.6).
- Hindari lebih dari 2 jenis font dalam satu halaman.

### 4.4 Komponen UI Standar

- Card statistik dengan angka besar + label kecil.
- Tombol utama: pill-shape, lime green, teks dark green (mengikuti gaya tombol "Book Appointment" pada referensi).
- Tombol sekunder: outline atau dark green solid.
- Badge status berwarna sesuai tabel warna status.
- Table data dengan zebra-row ringan menggunakan cream/putih.
- Modal/form dengan border radius medium (8–12px), shadow tipis.
- Toast notification, loading state, empty state, dan error state wajib tersedia di semua modul data.
- Sidebar dashboard: dark green background, ikon + label menu, item aktif diberi aksen lime.

---

## 5. Tech Stack

> Catatan arsitektur: blueprint awal menyebut NestJS sebagai frontend dan Next.js sebagai backend. Secara konvensi industri, susunan yang lebih tepat adalah sebaliknya. **Rekomendasi PRD ini mengikuti pendekatan standar** di bawah, namun tim dapat menyesuaikan sesuai keputusan akhir.

| Layer | Teknologi |
|---|---|
| Frontend | Next.js, TypeScript, Tailwind CSS |
| Backend | NestJS, TypeScript, REST API |
| Database | MySQL |
| Auth | Email + Password, JWT/Session, RBAC |
| Integrasi | WhatsApp Business API, Email Provider, HubSpot API (opsional), Excel Export |
| Deployment | Frontend: Vercel/VPS · Backend: VPS/Cloud · DB: MySQL managed/VPS |

---

## 6. Role & Akses (RBAC)

```
SUPER ADMIN → akses seluruh sistem
ADMIN       → kelola user/business sesuai permission
BUSINESS OWNER → kelola bisnis & AI Agent miliknya
STAFF / CS  → kelola customer, conversation, deal, follow-up sesuai permission
```

---

## 7. Fitur Utama

### 7.1 Landing Page
- Hero section dengan headline & CTA ("Coba Sekarang", "Lihat Demo").
- Problem section (pain point bisnis).
- Solution section (6 pilar: AI CS, Auto Customer Data, Deal Detection, Auto Follow Up, Data Protection, HubSpot Integration).
- CTA section penutup.

### 7.2 Authentication
- **Login:** email, password, remember session, forgot password.
- **Register:** nama, nama bisnis, email, no. WhatsApp, password → verifikasi email → create workspace → dashboard.

### 7.3 User Dashboard — Overview
Statistik utama: total customer, total deal, prospek, follow-up hari ini/tertunda, jumlah chat, jumlah percakapan AI, conversion rate.

### 7.4 Customer Service (AI Agent)
- Alur: Customer WhatsApp → WhatsApp API → AI Agent → Knowledge Base → Jawaban → Customer.
- Kemampuan AI: jawab FAQ, jelaskan produk & harga, gali kebutuhan, ekstraksi data, deteksi intent/prospek/deal, trigger follow-up, human handoff.
- Human handoff otomatis saat AI tidak yakin menjawab.

### 7.5 Customer Data (Prospect/Lite)
- Status: `NEW → CONTACTED → INTERESTED → QUALIFIED → NEGOTIATION → DEAL`.
- Field minimal: nama, WhatsApp, email, perusahaan, produk diminati, kebutuhan, status, source, last conversation/contact.
- Ekstraksi otomatis dari percakapan (nama, produk, quantity, kebutuhan, timeline, intent).

### 7.6 Export Excel
- Filter: semua data, per status, per tanggal, per produk, per sumber.
- Output: file Excel siap unduh.

### 7.7 Deal Data
- Status: `PENDING → CONFIRMED → PAID → COMPLETED`.
- Deteksi otomatis potential deal dari percakapan → butuh konfirmasi manusia sebelum final.
- Field: customer, produk, quantity, harga, total, status pembayaran, sales/CS, tanggal deal, catatan.

### 7.8 Follow Up System
- Manual (CS input jadwal & pesan) dan Automatic (rule-based: 24 jam, 48 jam, 7 hari, dst).
- Channel: WhatsApp & Email.
- Status: `SCHEDULED → SENT → DELIVERED → REPLIED / FAILED / CANCELLED`.
- Business rules: max follow-up, jeda, jam & hari kirim, template, kondisi stop (dibalas, minta stop, sudah deal, masuk forbidden list).

### 7.9 Forbidden Data (Data Protection)
- Admin/User set field, keyword, pattern, dan action (mask/block).
- Deteksi otomatis pada pesan masuk → log event.
- Konfigurasi retention policy & hak akses lihat data.

### 7.10 HubSpot Integration (Opsional)
- Connect via OAuth.
- Sync: Customer, Deal, Follow Up, Conversation.
- Arah sync awal: Platform → HubSpot (searah), pengembangan lanjut dua arah.
- Status sync: `SYNCED / PENDING / FAILED`.
- Setting: field mapping, auto/manual sync, disconnect.

### 7.11 WhatsApp Integration
- Hubungkan Business Account → WhatsApp API → Platform → AI Agent.
- Setting: nomor, status koneksi, webhook status, auto reply, status AI Agent.

### 7.12 AI Agent Configuration
- Setting: nama agent, personality/tone, deskripsi bisnis, produk, FAQ, jam operasional, escalation rules, follow-up rules, forbidden rules.
- Knowledge base: FAQ, katalog produk, price list, profil perusahaan, info pengiriman/pembayaran, dokumen.

### 7.13 Admin Dashboard
- Overview: total business, active user, active AI agent, koneksi WhatsApp, total conversation/customer/deal, volume follow-up, system errors.
- User management: lihat, suspend, activate, lihat subscription & usage AI.
- Business management: lihat & ubah status business, agent, integrasi, usage.
- AI monitoring: request count, failed request, escalation rate, error, token usage.

### 7.14 Notification System
Notifikasi untuk: customer baru, customer high intent, potential deal, deal confirmed, AI butuh bantuan manusia, follow-up gagal, WhatsApp disconnected, HubSpot sync gagal.

---

## 8. Alur Bisnis Inti (Core Business Flow)

```
Customer WhatsApp → AI Agent → Conversation dibuat
   → Customer baru? → Create Customer → Extract info → Status = NEW

Customer bertanya → AI jawab → Analisis intent → Update customer

Customer tertarik → Status = INTERESTED → Save product interest → Optional follow-up

Customer setuju → Potential Deal → Human confirmation → Create Deal
   → Status = DEAL → Stop follow-up
```

**User Journey MVP:**
```
Landing Page → Register → Create Business → Dashboard
→ Create AI Agent → Input Knowledge Base → Connect WhatsApp
→ AI Agent Active → Customer Chat → Data Otomatis Terbentuk
→ Prospect → Follow Up → Deal → (Optional) Sync ke HubSpot
```

---

## 9. Model Data (Ringkasan)

| Tabel | Field Kunci |
|---|---|
| users | id, name, email, password_hash, role_id, status |
| roles | id, name |
| businesses | id, owner_id, name, description, status |
| customers | id, business_id, name, whatsapp, email, company, status, source, notes |
| conversations | id, business_id, customer_id, channel, status, assigned_to |
| messages | id, conversation_id, sender_type, message, ai_generated |
| deals | id, business_id, customer_id, product, quantity, amount, status, deal_date |
| follow_ups | id, business_id, customer_id, channel, scheduled_at, message, status, sent_at |
| forbidden_rules | id, business_id, name, rule_type, pattern, action, active |
| integrations | id, business_id, provider, access_token, status, config |
| ai_agents | id, business_id, name, system_prompt, status |
| knowledge_base | id, business_id, title, content, source_type |
| audit_logs | id, business_id, user_id, action, entity, entity_id, metadata |

---

## 10. API Endpoint (Ringkasan)

```
Auth          : POST /auth/register | /auth/login | /auth/logout | /auth/forgot-password
Customers     : GET/POST/PATCH/DELETE /customers | GET /customers/export
Conversations : GET /conversations | GET /conversations/:id | POST /conversations/:id/messages | POST /conversations/:id/handoff
Deals         : GET/POST /deals | GET/PATCH /deals/:id
Follow Ups    : GET/POST /follow-ups | PATCH /follow-ups/:id | POST /follow-ups/:id/cancel
AI Agent      : GET/POST /agents | PATCH /agents/:id | POST /agents/:id/test
Integrations  : GET /integrations | POST /integrations/hubspot/connect|sync|disconnect
```

---

## 11. Non-Functional Requirements

### Security (Minimum)
- Password hashing, JWT/session security, RBAC.
- API authentication, input validation, rate limiting.
- Webhook verification (WhatsApp/HubSpot).
- Enkripsi token/secret — tidak boleh disimpan plain text.
- Audit log untuk aksi penting.
- Environment variable aman & backup database berkala.

### Prinsip Pengembangan
```
Reliable → Secure → Simple → Scalable → Advanced AI
```
AI berperan membantu memahami, mengklasifikasi, mengekstrak, menjawab, dan merekomendasikan — **bukan** sumber kebenaran utama data bisnis. Database & business rules tetap menjadi sumber data utama.

---

## 12. MVP Scope & Roadmap

| Fase | Fokus |
|---|---|
| **Phase 1 — Foundation** | Landing page, login, register, user & admin dashboard, database, role system |
| **Phase 2 — Customer Management** | Customer CRUD, conversation management, status, ekstraksi data, export Excel |
| **Phase 3 — AI Agent** | Konfigurasi AI, knowledge base, AI response, human handoff |
| **Phase 4 — WhatsApp** | Koneksi WhatsApp, webhook masuk, pesan keluar, sinkronisasi percakapan |
| **Phase 5 — Deal** | Manajemen deal, deteksi potential deal, konfirmasi, update status otomatis |
| **Phase 6 — Follow Up** | Scheduler, follow-up WhatsApp/email, stop condition |
| **Phase 7 — Data Protection** | Forbidden data rules, deteksi, masking/blocking, audit log |
| **Phase 8 — HubSpot** | OAuth/connect, sync customer & deal, field mapping, sync logs |

---

## 13. Arsitektur Tingkat Tinggi

```
Landing Page → Authentication → User Portal / Admin Portal
                                        │
                                  Backend / API
                                        │
                ┌───────────────┬───────────────┬───────────────┐
              MySQL          AI Service       Scheduler
                                   │                │
                          ┌────────┼────────┐       │
                       WhatsApp  HubSpot   Email ───┘
```

---

## 14. Catatan Penutup

Dokumen ini adalah acuan awal (v1.0) untuk pengembangan MVP. Detail teknis lanjutan (wireframe per halaman, spesifikasi API lengkap, skema database final) disarankan dikembangkan sebagai dokumen turunan terpisah setelah scope Phase 1–2 disepakati tim.
