import type { Metadata } from "next";
import {
  Bot,
  Database,
  Handshake,
  MessageSquareText,
  Plug,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Dokumentasi",
  description:
    "Panduan cepat, alur pengguna, model data, dan referensi API WhatsApp Business Agent.",
};

const steps = [
  {
    icon: UserPlus,
    title: "1. Daftar akun",
    desc: "Buat akun, isi nama bisnis, email, dan nomor WhatsApp. Verifikasi email untuk membuat workspace.",
  },
  {
    icon: Bot,
    title: "2. Buat AI Agent",
    desc: "Atur nama agent, personaliti, jam operasional, dan knowledge base (FAQ, produk, harga).",
  },
  {
    icon: Plug,
    title: "3. Hubungkan WhatsApp",
    desc: "Koneksikan Business Account WhatsApp ke platform. AI Agent langsung aktif menjawab.",
  },
  {
    icon: MessageSquareText,
    title: "4. Pantau percakapan",
    desc: "Semua chat terdata sebagai customer, conversation, dan prospek dengan status otomatis.",
  },
  {
    icon: Handshake,
    title: "5. Follow-up & deal",
    desc: "Follow-up terjadwal berjalan otomatis hingga deal terkonfirmasi. Sinkronkan ke HubSpot.",
  },
];

const custStatus = [
  "NEW",
  "CONTACTED",
  "INTERESTED",
  "QUALIFIED",
  "NEGOTIATION",
  "DEAL",
];
const dealStatus = ["PENDING", "CONFIRMED", "PAID", "COMPLETED"];
const followUpStatus = ["SCHEDULED", "SENT", "DELIVERED", "REPLIED", "FAILED", "CANCELLED"];

const models = [
  { table: "users", note: "id, name, email, password_hash, role_id, status" },
  { table: "businesses", note: "owner_id, name, description, status (workspace tenant)" },
  { table: "customers", note: "nama, WhatsApp, email, perusahaan, produk diminati, kebutuhan, status, source" },
  { table: "conversations", note: "business_id, customer_id, ai_agent_id, channel, status, assigned_to" },
  { table: "messages", note: "sender_type (customer/AI/user), message, ai_generated" },
  { table: "deals", note: "product, quantity, amount, payment_status, status, deal_date, source" },
  { table: "follow_ups", note: "type, channel, scheduled_at, message, status, sent_at, replied_at" },
  { table: "forbidden_rules", note: "name, rule_type, pattern, action (mask/block), active" },
  { table: "integrations", note: "provider (HubSpot), access_token_encrypted, status, config" },
  { table: "ai_agents", note: "name, system_prompt, personality, operating_hours, status" },
  { table: "knowledge_base", note: "title, content, source_type (FAQ/produk/dokumen)" },
  { table: "export_jobs", note: "filter, file_path, status PENDING → PROCESSING → DONE/FAILED" },
];

const endpoints: { group: string; routes: string[] }[] = [
  {
    group: "Auth",
    routes: [
      "POST /auth/register",
      "POST /auth/login",
      "POST /auth/logout",
      "POST /auth/forgot-password",
    ],
  },
  {
    group: "Customers",
    routes: [
      "GET /customers",
      "POST /customers",
      "PATCH /customers/:id",
      "DELETE /customers/:id",
      "GET /customers/export",
    ],
  },
  {
    group: "Conversations",
    routes: [
      "GET /conversations",
      "GET /conversations/:id",
      "POST /conversations/:id/messages",
      "POST /conversations/:id/handoff",
    ],
  },
  {
    group: "Deals",
    routes: ["GET /deals", "POST /deals", "GET /deals/:id", "PATCH /deals/:id"],
  },
  {
    group: "Follow Ups",
    routes: [
      "GET /follow-ups",
      "POST /follow-ups",
      "PATCH /follow-ups/:id",
      "POST /follow-ups/:id/cancel",
    ],
  },
  {
    group: "AI Agent",
    routes: [
      "GET /agents",
      "POST /agents",
      "PATCH /agents/:id",
      "POST /agents/:id/test",
    ],
  },
  {
    group: "Integrations",
    routes: [
      "GET /integrations",
      "POST /integrations/hubspot/connect",
      "POST /integrations/hubspot/sync",
      "POST /integrations/hubspot/disconnect",
    ],
  },
];

const roles = [
  ["Super Admin", "Akses seluruh sistem platform"],
  ["Admin", "Kelola user & business sesuai permission"],
  ["Business Owner", "Kelola bisnis & AI Agent miliknya"],
  ["Staff / CS", "Kelola customer, conversation, deal, follow-up"],
];

export default function DocumentationPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-primary py-16 text-white">
          <div className="container-x mx-auto max-w-3xl text-center">
            <Badge tone="accent" className="bg-accent/15 text-accent">
              Dokumentasi
            </Badge>
            <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">
              Semua yang perlu Anda ketahui untuk mulai
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
              Panduan cepat, alur bisnis, model data, dan referensi API —
              dikemas ringkas untuk tim teknis dan non-teknis.
            </p>
          </div>
        </section>

        {/* QUICK START */}
        <section className="bg-cream py-16">
          <div className="container-x">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-extrabold">Panduan Cepat</h2>
              <p className="mt-3 text-muted">
                Dari daftar sampai AI Agent aktif dalam 5 langkah.
              </p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {steps.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-line bg-white p-5"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 text-base font-bold text-ink">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATUSES */}
        <section className="bg-white py-16">
          <div className="container-x grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-line bg-cream p-6">
              <h3 className="font-bold text-ink">Status Customer (Pipeline)</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {custStatus.map((s) => {
                  const tone =
                    s === "DEAL"
                      ? "success"
                      : s === "NEW"
                        ? "neutral"
                        : "warning";
                  return (
                    <Badge key={s} tone={tone as "success" | "neutral" | "warning"}>
                      {s}
                    </Badge>
                  );
                })}
              </div>
            </div>
            <div className="rounded-2xl border border-line bg-cream p-6">
              <h3 className="font-bold text-ink">Status Deal</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {dealStatus.map((s) => {
                  const tone =
                    s === "COMPLETED"
                      ? "success"
                      : s === "PENDING"
                        ? "warning"
                        : "neutral";
                  return (
                    <Badge key={s} tone={tone as "success" | "warning" | "neutral"}>
                      {s}
                    </Badge>
                  );
                })}
              </div>
            </div>
            <div className="rounded-2xl border border-line bg-cream p-6">
              <h3 className="font-bold text-ink">Status Follow-up</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {followUpStatus.map((s) => {
                  const tone =
                    s === "REPLIED"
                      ? "success"
                      : s === "FAILED" || s === "CANCELLED"
                        ? "danger"
                        : s === "SCHEDULED"
                          ? "warning"
                          : "neutral";
                  return (
                    <Badge key={s} tone={tone as "success" | "danger" | "warning" | "neutral"}>
                      {s}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ROLES */}
        <section className="bg-cream py-16">
          <div className="container-x">
            <div className="mx-auto max-w-2xl text-center">
              <Badge tone="accent">Role & Akses</Badge>
              <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl">
                Kontrol akses per peran
              </h2>
            </div>
            <div className="mx-auto mt-8 grid max-w-3xl gap-3">
              {roles.map(([role, desc]) => (
                <div
                  key={role}
                  className="flex flex-col gap-1 rounded-xl border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="font-bold text-ink">{role}</span>
                  <span className="text-sm text-muted">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DATA MODEL */}
        <section className="bg-white py-16">
          <div className="container-x">
            <div className="mx-auto max-w-2xl text-center">
              <Badge tone="accent">
                <Database className="h-3.5 w-3.5" />
                Model Data
              </Badge>
              <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl">
                Entitas utama yang dikelola platform
              </h2>
            </div>
            <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-line">
              <table className="w-full text-left text-sm">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Tabel</th>
                    <th className="px-4 py-3 font-semibold">Field kunci</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {models.map((m, i) => (
                    <tr key={m.table} className={i % 2 ? "bg-cream/60" : "bg-white"}>
                      <td className="px-4 py-3 font-mono text-[13px] font-semibold text-primary">
                        {m.table}
                      </td>
                      <td className="px-4 py-3 text-muted">{m.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* API */}
        <section className="bg-cream py-16">
          <div className="container-x">
            <div className="mx-auto max-w-2xl text-center">
              <Badge tone="accent">Referensi API</Badge>
              <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl">
                Endpoint REST — ringkasan
              </h2>
              <p className="mt-3 text-muted">
                Backend menggunakan NestJS + TypeScript dengan autentikasi JWT &
                RBAC.
              </p>
            </div>
            <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
              {endpoints.map(({ group, routes }) => (
                <div
                  key={group}
                  className="rounded-2xl border border-line bg-white p-5"
                >
                  <h3 className="font-bold text-ink">{group}</h3>
                  <div className="mt-3 flex flex-col gap-2">
                    {routes.map((r) => (
                      <code
                        key={r}
                        className="rounded-lg bg-cream px-3 py-2 font-mono text-[12.5px] text-primary"
                      >
                        {r}
                      </code>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mx-auto mt-10 flex max-w-4xl flex-col items-center justify-between gap-4 rounded-2xl bg-primary p-6 text-white sm:flex-row">
              <div>
                <h3 className="text-lg font-extrabold">
                  Alur inti: chat → data → follow-up → deal
                </h3>
                <p className="mt-1 text-sm text-white/80">
                  Customer WhatsApp → AI Agent → Conversation → Customer dibuat →
                  Intent dianalisis → Follow-up otomatis → Deal dikonfirmasi.
                </p>
              </div>
              <div className="flex items-center gap-3 text-accent">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-sm font-semibold">Enkripsi & audit log aktif</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary py-14 text-center text-white">
          <div className="container-x">
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              Siap mencobanya?
            </h2>
            <Button href="/register" variant="primary" size="lg" className="mt-5">
              Daftar Gratis Sekarang
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}