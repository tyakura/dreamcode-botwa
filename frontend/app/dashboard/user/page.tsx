import {
  Bot,
  Handshake,
  MessageSquareText,
  Plus,
  Repeat2,
  Sparkles,
  TrendingUp,
  Users,
  Wifi,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardBody, CardHeader } from "@/components/dashboard/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  aiPerformance,
  customerStatusPipeline,
  dealRevenueThisMonth,
  dashboardUser,
  userNotifications,
} from "@/lib/dashboard-data";
import { formatNumber } from "@/lib/format";

const stats = [
  { label: "Total Customer", value: "84", sub: "+8 minggu ini", up: true, icon: Users },
  { label: "Total Deal", value: "12", sub: "Rp 21,4 jt terkumpul", up: true, icon: Handshake },
  { label: "Prospek Aktif", value: "61", sub: "5 qualified", up: true, icon: TrendingUp },
  { label: "Follow-up Hari Ini", value: "8", sub: "3 tertunda", up: false, icon: Repeat2 },
];

const followUpToday = [
  { customer: "Budi Santoso", time: "Hari ini 14:00", status: "SCHEDULED" },
  { customer: "Fajar Ramadhan", time: "Hari ini 10:30", status: "SCHEDULED" },
  { customer: "Citra Lestari", time: "Kemarin 09:00", status: "SENT" },
];

export default function UserOverviewPage() {
  const maxPipeline = Math.max(...customerStatusPipeline.map((p) => p.count));

  return (
    <>
      <PageHeader
        title={`Halo, ${dashboardUser.name.split(" ")[0]} 👋`}
        description={`Ringkasan performa bisnis ${dashboardUser.business}. Prospek baru yang masuk otomatis terekam dari percakapan WhatsApp.`}
        actions={
          <>
            <Button href="/dashboard/user/whatsapp" variant="outline" size="md">
              <Wifi className="h-4 w-4 text-success" />
              WhatsApp Terhubung
            </Button>
            <Button href="/dashboard/user/customers" variant="primary" size="md">
              <Plus className="h-4 w-4" />
              Customer Baru
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        {/* Funnel prospek */}
        <Card className="xl:col-span-2">
          <CardHeader
            title="Pipeline Prospek"
            subtitle="Distribusi status customer berdasarkan alur NEW → DEAL"
            action={
              <Button href="/dashboard/user/customers" variant="ghost" size="sm">
                Lihat semua
              </Button>
            }
          />
          <CardBody>
            <div className="flex flex-col gap-4">
              {customerStatusPipeline.map((p) => (
                <div key={p.status} className="flex items-center gap-3">
                  <span className="w-32 shrink-0 text-sm font-semibold text-muted">
                    {p.status}
                  </span>
                  <div className="h-6 flex-1 overflow-hidden rounded-full bg-cream">
                    <div
                      className={`flex h-full items-center rounded-full ${p.color}`}
                      style={{
                        width: `${(p.count / maxPipeline) * 100}%`,
                        minWidth: p.count > 0 ? "12%" : 0,
                      }}
                    />
                  </div>
                  <span className="w-24 shrink-0 text-right text-sm font-bold text-ink">
                    {formatNumber(p.count)} customer
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 sm:grid-cols-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Total chat
                </p>
                <p className="mt-1 text-xl font-extrabold text-ink">342</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Percakapan AI
                </p>
                <p className="mt-1 text-xl font-extrabold text-ink">298</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Conversion rate
                </p>
                <p className="mt-1 text-xl font-extrabold text-ink">14,2%</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Data terpilih
                </p>
                <p className="mt-1 text-xl font-extrabold text-ink">6</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Performa AI */}
        <Card>
          <CardHeader
            title="AI Agent"
            subtitle="Kinerja DreamBot CS — 24/7"
            action={<StatusBadge status="ACTIVE" />}
          />
          <CardBody className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-primary p-4 text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                <Bot className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">DreamBot CS</p>
                <p className="text-xs text-white/70">
                  AI menjawab {aiPerformance.handledRate}% chat secara otomatis
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Resolve rate", value: `${aiPerformance.resolveRate}%` },
                { label: "Handoff rate", value: `${aiPerformance.handoffRate}%` },
                { label: "Failed rate", value: `${aiPerformance.failedRate}%` },
                { label: "Rata-rata respon", value: aiPerformance.avgResponseTime },
              ].map((m) => (
                <div key={m.label} className="rounded-xl border border-line px-3.5 py-3">
                  <p className="text-xs font-semibold text-muted">{m.label}</p>
                  <p className="mt-0.5 text-lg font-extrabold text-ink">{m.value}</p>
                </div>
              ))}
            </div>

            <Button href="/dashboard/user/ai-agent" variant="dark" size="md" className="w-full">
              <Sparkles className="h-4 w-4" />
              Kelola AI Agent
            </Button>
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* Revenue bulanan */}
        <Card>
          <CardHeader
            title="Nilai Deal per Bulan"
            subtitle="Total nilai deal (dalam juta rupiah)"
            action={<Badge tone="success">Tumbuh 15%</Badge>}
          />
          <CardBody>
            <div className="flex h-44 items-end justify-between gap-3 px-1">
              {dealRevenueThisMonth.map((d) => (
                <div key={d.month} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[11px] font-bold text-muted">
                    {d.value}
                  </span>
                  <div
                    className="w-full max-w-10 rounded-t-lg bg-primary"
                    style={{ height: `${(d.value / 8) * 100}%` }}
                  >
                    <div
                      className="h-0 w-full rounded-t-lg bg-accent"
                      style={{ height: "100%" }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-muted">{d.month}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 border-t border-line pt-3 text-xs text-muted">
              Total nilai deal bulan ini:{" "}
              <span className="font-bold text-ink">Rp 7.200.000</span> · dihitung
              dari deal berstatus PAID & COMPLETED.
            </p>
          </CardBody>
        </Card>

        {/* Notifikasi & follow-up */}
        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader
              title="Follow-up Terdekat"
              subtitle="Jadwal follow-up yang perlu perhatian"
              action={
                <Button href="/dashboard/user/follow-ups" variant="ghost" size="sm">
                  Semua
                </Button>
              }
            />
            <CardBody>
              <div className="flex flex-col divide-y divide-line/70">
                {followUpToday.map((f) => (
                  <div key={f.customer} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-ink">{f.customer}</p>
                      <p className="text-xs text-muted">{f.time}</p>
                    </div>
                    <StatusBadge status={f.status} />
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Aktivitas Terbaru"
              subtitle="Notifikasi & event penting"
              action={
                <Button href="/dashboard/user/conversations" variant="ghost" size="sm">
                  Semua
                </Button>
              }
            />
            <CardBody>
              <div className="flex flex-col divide-y divide-line/70">
                {userNotifications.slice(0, 3).map((n) => (
                  <div key={n.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                    <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0 text-accent-dark" />
                    <div className="min-w-0">
                      <p className="text-sm leading-snug text-muted">{n.message}</p>
                      <p className="mt-0.5 text-xs text-muted/60">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}