import {
  AlertTriangle,
  Bot,
  Building2,
  Clock,
  Globe,
  Handshake,
  History,
  Repeat2,
  Users,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardBody, CardHeader } from "@/components/dashboard/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Table, TBody, Td, THead, Th, Tr } from "@/components/dashboard/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  adminBusinesses,
  adminUsers,
  platformHealth,
  systemCounters,
  adminNotifications,
} from "@/lib/dashboard-data";
import { formatNumber } from "@/lib/format";

export default function AdminOverviewPage() {
  return (
    <>
      <PageHeader
        title="Admin Overview"
        description="Ringkasan seluruh platform: bisnis aktif, user, AI Agent, koneksi WhatsApp, dan kesehatan sistem."
        actions={
          <Badge tone="accent" className="gap-1">
            <Zap className="h-3.5 w-3.5" />
            Semua sistem aktif
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Bisnis" value={formatNumber(systemCounters.totalBusinesses)} icon={Building2} sub={`${systemCounters.activeUsers} user aktif`} up />
        <StatCard label="AI Agent Aktif" value={systemCounters.activeAgents.toString()} icon={Bot} sub="75% dari total agent" up />
        <StatCard label="Total Pelanggan" value={formatNumber(systemCounters.totalCustomers)} icon={Users} sub="Semua bisnis" up />
        <StatCard label="Follow-up Volume" value={formatNumber(systemCounters.followUpVolume)} icon={Repeat2} sub="30 hari terakhir" />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        {/* Counters grid */}
        <Card className="xl:col-span-2">
          <CardHeader title="Platform Metrics" subtitle="Statistik agregat seluruh bisnis di platform" />
          <CardBody>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label: "Koneksi WhatsApp", value: systemCounters.whatsappConnections.toString(), icon: Globe },
                { label: "Total Percakapan", value: formatNumber(systemCounters.totalConversations), icon: History },
                { label: "Total Deal", value: formatNumber(systemCounters.totalDeals), icon: Handshake },
                { label: "System Errors (24j)", value: systemCounters.systemErrors.toString(), icon: AlertTriangle },
                { label: "User Terdaftar", value: formatNumber(systemCounters.totalUsers), icon: Users },
                { label: "Bisnis Terdaftar", value: formatNumber(systemCounters.totalBusinesses), icon: Building2 },
              ].map((m) => (
                <div key={m.label} className="flex items-start gap-3 rounded-xl border border-line px-4 py-3.5">
                  <m.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent-dark" />
                  <div>
                    <p className="text-xs font-semibold text-muted">{m.label}</p>
                    <p className="mt-1 text-xl font-extrabold text-ink">{m.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Kesehatan sistem */}
        <Card>
          <CardHeader title="Kesehatan Sistem" subtitle="Status layanan platform" action={<StatusBadge status="ACTIVE" />} />
          <CardBody className="space-y-4">
            {platformHealth.map((h) => (
              <div key={h.label} className="flex items-center justify-between gap-3 border-b border-line/70 pb-3 last:border-b-0 last:pb-0">
                <span className="text-sm text-muted">{h.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-ink">
                    {h.value.toLocaleString("id-ID")}{h.unit ? h.unit : "%"}
                  </span>
                  <span className={`h-2 w-2 rounded-full ${h.ok ? "bg-success" : "bg-warning"}`} />
                </div>
              </div>
            ))}
            <Button variant="outline" size="md" className="w-full">
              <Clock className="h-4 w-4" />
              Lihat uptime history
            </Button>
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* User terbaru */}
        <Card>
          <CardHeader
            title="User Terbaru"
            subtitle="6 user terdaftar sebagai contoh"
            action={
              <Button href="/admin/users" variant="ghost" size="sm">
                Lihat semua
              </Button>
            }
          />
          <Table>
            <THead>
              <Th>User</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Bergabung</Th>
            </THead>
            <TBody>
              {adminUsers.slice(0, 4).map((u) => (
                <Tr key={u.id}>
                  <Td>
                    <p className="font-bold text-ink">{u.name}</p>
                    <p className="text-xs text-muted">{u.email}</p>
                  </Td>
                  <Td>
                    <Badge tone={u.role === "SUPER_ADMIN" ? "dark" : u.role === "ADMIN" ? "accent" : "neutral"}>
                      {u.role.replace("_", " ")}
                    </Badge>
                  </Td>
                  <Td>
                    <StatusBadge status={u.status} />
                  </Td>
                  <Td className="whitespace-nowrap text-muted">{u.joinedAt}</Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </Card>

        {/* Bisnis terbaru */}
        <Card>
          <CardHeader
            title="Bisnis Terbaru"
            subtitle="4 bisnis sebagai contoh"
            action={
              <Button href="/admin/businesses" variant="ghost" size="sm">
                Lihat semua
              </Button>
            }
          />
          <Table>
            <THead>
              <Th>Bisnis</Th>
              <Th>Owner</Th>
              <Th>Customers</Th>
              <Th>Status</Th>
            </THead>
            <TBody>
              {adminBusinesses.map((b) => (
                <Tr key={b.id}>
                  <Td className="font-bold text-ink">{b.name}</Td>
                  <Td className="text-muted">{b.owner}</Td>
                  <Td className="text-muted">{b.customers}</Td>
                  <Td>
                    <StatusBadge status={b.status} />
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </Card>
      </div>

      {/* Notifikasi terbaru */}
      <Card className="mt-6">
        <CardHeader title="Notifikasi Terbaru" subtitle="Event penting dari seluruh platform" />
        <CardBody>
          <div className="flex flex-col divide-y divide-line/70">
            {adminNotifications.map((n) => (
              <div key={n.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                  n.type === "FORBIDDEN_DATA" ? "bg-danger" : n.type === "FOLLOW_UP" ? "bg-warning" : "bg-accent"
                }`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug text-muted">{n.message}</p>
                  <p className="mt-0.5 text-xs text-muted/60">{n.time}</p>
                </div>
                {!n.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />}
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </>
  );
}