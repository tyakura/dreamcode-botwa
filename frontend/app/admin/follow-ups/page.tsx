import { CalendarClock, Repeat2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardHeader } from "@/components/dashboard/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Table, TBody, Td, THead, Th, Tr } from "@/components/dashboard/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminFollowUps } from "@/lib/dashboard-data";

const summary = { total: 1840, scheduled: 286, sentToday: 42, failed: 18 };

export default function AdminFollowUpsPage() {
  return (
    <>
      <PageHeader
        title="Follow Ups"
        description="Volume follow-up seluruh bisnis. Pantau yang terjadwal, terkirim, gagal, dan tertunda."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Follow-up" value={summary.total.toLocaleString("id-ID")} icon={Repeat2} sub="30 hari terakhir" />
        <StatCard label="Terjadwal" value={summary.scheduled.toString()} icon={CalendarClock} sub="Antrian aktif" />
        <StatCard label="Terkirim Hari Ini" value={summary.sentToday.toString()} icon={CalendarClock} sub="WhatsApp + Email" up />
        <StatCard label="Gagal" value={summary.failed.toString()} icon={CalendarClock} sub="Perlu review" />
      </div>

      <Card className="mt-6">
        <CardHeader title="Contoh Follow-up" subtitle="Lintas bisnis" />
        <Table>
          <THead>
            <Th>Bisnis</Th>
            <Th>Customer</Th>
            <Th>Kanal</Th>
            <Th>Jadwal</Th>
            <Th>Status</Th>
            <Th>Aksi</Th>
          </THead>
          <TBody>
            {adminFollowUps.map((f) => (
              <Tr key={f.id}>
                <Td>
                  <Badge tone="dark">{f.business}</Badge>
                </Td>
                <Td className="font-bold text-ink">{f.customer}</Td>
                <Td>
                  <Badge tone={f.channel === "WHATSAPP" ? "accent" : "neutral"}>
                    {f.channel}
                  </Badge>
                </Td>
                <Td className="whitespace-nowrap text-muted">{f.scheduledAt}</Td>
                <Td>
                  <StatusBadge status={f.status} />
                </Td>
                <td className="px-5 py-3.5">
                  {f.status === "SCHEDULED" ? (
                    <Button variant="ghost" size="sm" className="text-danger hover:bg-danger/10">
                      Batal
                    </Button>
                  ) : (
                    <span className="text-xs text-muted/50">—</span>
                  )}
                </td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </Card>
    </>
  );
}