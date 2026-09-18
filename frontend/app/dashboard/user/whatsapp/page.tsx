import { CheckCircle2, Smartphone, Wifi, WifiOff } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardBody, CardHeader } from "@/components/dashboard/card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Table, TBody, Td, THead, Th, Tr } from "@/components/dashboard/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  webhookEvents,
  whatsappStatus,
} from "@/lib/dashboard-data";

export default function UserWhatsappPage() {
  return (
    <>
      <PageHeader
        title="WhatsApp"
        description="Status koneksi WhatsApp Business API, webhook, auto-reply, dan log event terakhir."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Status koneksi */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Status Koneksi"
            subtitle="Informasi koneksi WhatsApp Business API ke platform"
            action={
              whatsappStatus.connected ? (
                <Badge tone="success" className="gap-1">
                  <Wifi className="h-3 w-3" />
                  Terhubung
                </Badge>
              ) : (
                <Badge tone="danger" className="gap-1">
                  <WifiOff className="h-3 w-3" />
                  Terputus
                </Badge>
              )
            }
          />
          <CardBody className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "Nomor terdaftar", value: whatsappStatus.number },
              { label: "Status webhook", value: whatsappStatus.webhookActive ? "Aktif" : "Nonaktif" },
              { label: "Auto reply", value: whatsappStatus.autoReply ? "Hidup" : "Mati" },
              { label: "AI Agent", value: whatsappStatus.aiAgentActive ? "Aktif — DreamBot CS" : "Nonaktif" },
              { label: "Pesan masuk hari ini", value: whatsappStatus.incomingToday.toString() },
              { label: "Pesan keluar hari ini", value: whatsappStatus.outgoingToday.toString() },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3">
                <span className="text-sm text-muted">{item.label}</span>
                <span className="text-sm font-bold text-ink">{item.value}</span>
              </div>
            ))}
            <div className="sm:col-span-2">
              <Button variant="dark" size="md" className="w-full">
                <Smartphone className="h-4 w-4" />
                Ubah Pengaturan WhatsApp
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Statistik singkat */}
        <Card>
          <CardHeader title="Ringkasan Hari Ini" />
          <CardBody className="space-y-5">
            <div className="flex items-center gap-4 rounded-xl bg-primary p-5 text-white">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
                <Smartphone className="h-5 w-5" />
              </span>
              <div>
                <p className="text-2xl font-extrabold">
                  {whatsappStatus.incomingToday}
                </p>
                <p className="text-xs text-white/90">Pesan masuk</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl bg-success/10 p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-success text-white">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-2xl font-extrabold text-ink">
                  {whatsappStatus.outgoingToday}
                </p>
                <p className="text-xs text-muted">Pesan keluar (AI + Human)</p>
              </div>
            </div>
            <p className="text-xs text-muted/70">
              Terakhir event: <span className="font-semibold text-ink">{whatsappStatus.lastEventAt}</span>
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Webhook log */}
      <Card className="mt-6">
        <CardHeader
          title="Log Webhook"
          subtitle="Event terakhir yang diterima dari WhatsApp Business API"
          action={
            <Button variant="ghost" size="sm">
              Lihat semua
            </Button>
          }
        />
        <Table>
          <THead>
            <Th>Event</Th>
            <Th>Detail</Th>
            <Th>Status</Th>
            <Th>Waktu</Th>
          </THead>
          <TBody>
            {webhookEvents.map((e) => (
              <Tr key={e.id}>
                <Td>
                  <code className="rounded-md bg-cream px-2 py-1 text-xs text-primary">
                    {e.event}
                  </code>
                </Td>
                <Td className="max-w-md truncate text-muted">{e.detail}</Td>
                <Td>
                  <StatusBadge status={e.status} />
                </Td>
                <Td className="whitespace-nowrap text-muted">{e.time}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </Card>
    </>
  );
}