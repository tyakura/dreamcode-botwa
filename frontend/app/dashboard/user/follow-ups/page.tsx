import { CalendarClock, Mail, Plus, Repeat2, Smartphone } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardBody, CardHeader } from "@/components/dashboard/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Table, TBody, Td, THead, Th, Tr } from "@/components/dashboard/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { followUps, followUpSettings, followUpSummary } from "@/lib/dashboard-data";

export default function UserFollowUpsPage() {
  return (
    <>
      <PageHeader
        title="Follow Up"
        description="Follow-up manual oleh CS dan otomatis berdasarkan rule: jeda waktu, jam kirim, dan kondisi berhenti."
        actions={
          <Button variant="primary" size="md">
            <Plus className="h-4 w-4" />
            Buat Follow-up
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Hari Ini" value={followUpSummary.scheduledToday.toString()} icon={CalendarClock} sub="Terjadwal" up />
        <StatCard label="Total Jadwal" value={followUpSummary.scheduledTotal.toString()} icon={CalendarClock} sub="Antrian" />
        <StatCard label="Terkirim" value={followUpSummary.sent.toString()} icon={CalendarClock} sub="Sent" up />
        <StatCard label="Dibalas" value={followUpSummary.replied.toString()} icon={CalendarClock} sub="Replied" up />
        <StatCard label="Gagal" value={followUpSummary.failed.toString()} icon={CalendarClock} sub="Failed" />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Daftar Follow-up" subtitle="6 dari 21 jadwal tampil sebagai contoh" />
          <Table>
            <THead>
              <Th>Customer</Th>
              <Th>Kanal</Th>
              <Th>Tipe</Th>
              <Th>Jadwal</Th>
              <Th>Pesan</Th>
              <Th>Status</Th>
              <Th>Terikirim</Th>
            </THead>
            <TBody>
              {followUps.map((f) => (
                <Tr key={f.id}>
                  <Td className="font-bold text-ink">{f.customer}</Td>
                  <Td>
                    <Badge tone={f.channel === "WHATSAPP" ? "accent" : "neutral"} className="gap-1">
                      {f.channel === "WHATSAPP" ? (
                        <Smartphone className="h-3 w-3" />
                      ) : (
                        <Mail className="h-3 w-3" />
                      )}
                      {f.channel}
                    </Badge>
                  </Td>
                  <Td>
                    <span className="rounded-md bg-cream px-2 py-1 text-xs font-semibold text-muted">
                      {f.type}
                    </span>
                  </Td>
                  <Td className="whitespace-nowrap text-muted">{f.scheduledAt}</Td>
                  <Td className="max-w-xs truncate italic text-muted">
                    &ldquo;{f.message}&rdquo;
                  </Td>
                  <Td>
                    <StatusBadge status={f.status} />
                  </Td>
                  <Td className="whitespace-nowrap text-muted">{f.sentAt ?? "—"}</Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </Card>

        <Card>
          <CardHeader title="Pengaturan Otomatis" subtitle="Rule yang dipakai scheduler follow-up" />
          <CardBody className="space-y-3 text-sm">
            {[
              { label: "Max follow-up", value: `${followUpSettings.maxFollowUp}x` },
              { label: "Interval", value: `${followUpSettings.intervalHours} jam` },
              { label: "Jam kirim", value: `${followUpSettings.sendTimeStart} – ${followUpSettings.sendTimeEnd}` },
              { label: "Hari kirim", value: followUpSettings.sendDays },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3">
                <span className="text-muted">{row.label}</span>
                <span className="font-bold text-ink">{row.value}</span>
              </div>
            ))}
            <div className="rounded-xl bg-cream px-3.5 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Template default</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{followUpSettings.defaultTemplate}</p>
            </div>
            <div className="rounded-xl border border-danger/20 bg-danger/5 px-3.5 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-danger">Kondisi berhenti</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{followUpSettings.stopConditions}</p>
            </div>
            <Button variant="dark" size="md" className="w-full">
              <Repeat2 className="h-4 w-4" />
              Ubah Pengaturan
            </Button>
          </CardBody>
        </Card>
      </div>
    </>
  );
}