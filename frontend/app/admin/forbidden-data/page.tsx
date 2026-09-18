import { ShieldAlert, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardHeader } from "@/components/dashboard/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Table, TBody, Td, THead, Th, Tr } from "@/components/dashboard/table";
import { Badge } from "@/components/ui/badge";
import { adminForbiddenEvents, adminForbiddenSummary, forbiddenRules } from "@/lib/dashboard-data";

export default function AdminForbiddenDataPage() {
  return (
    <>
      <PageHeader
        title="Forbidden Data"
        description="Aturan data terlarang dan log deteksi lintas seluruh bisnis di platform."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Aturan" value={adminForbiddenSummary.totalRules.toLocaleString("id-ID")} icon={ShieldCheck} sub="Seluruh bisnis" />
        <StatCard label="Aturan Aktif" value={adminForbiddenSummary.activeRules.toString()} icon={ShieldCheck} sub="Sedang berjalan" up />
        <StatCard label="Kejadian Hari Ini" value={adminForbiddenSummary.eventsToday.toString()} icon={ShieldAlert} sub="Perlu perhatian" />
        <StatCard label="Mask" value={adminForbiddenSummary.masked.toString()} icon={ShieldAlert} sub="Value di-mask" />
        <StatCard label="Blocked" value={adminForbiddenSummary.blocked.toString()} icon={ShieldAlert} sub="Diblokir oleh sistem" />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader title="Aturan (Contoh Global)" subtitle="Aturan ini berlaku lintas bisnis" />
          <Table>
            <THead>
              <Th>Nama</Th>
              <Th>Tipe</Th>
              <Th>Pola</Th>
              <Th>Aksi</Th>
              <Th>Aktif</Th>
            </THead>
            <TBody>
              {forbiddenRules.map((r) => (
                <Tr key={r.id}>
                  <Td className="font-semibold text-ink">{r.name}</Td>
                  <Td><Badge tone="neutral">{r.ruleType}</Badge></Td>
                  <Td><code className="rounded-md bg-cream px-2 py-1 text-xs text-primary">{r.pattern}</code></Td>
                  <Td><StatusBadge status={r.action} /></Td>
                  <Td>
                    <span className={`inline-block h-2.5 w-2.5 rounded-full ${r.active ? "bg-success" : "bg-muted/40"}`} />
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </Card>

        <Card>
          <CardHeader title="Log Deteksi Terakhir" subtitle="Event lintas bisnis" />
          <Table>
            <THead>
              <Th>Bisnis</Th>
              <Th>Pelanggan</Th>
              <Th>Nilai</Th>
              <Th>Aksi</Th>
              <Th>Waktu</Th>
            </THead>
            <TBody>
              {adminForbiddenEvents.map((e) => (
                <Tr key={e.id}>
                  <Td><Badge tone="dark">{e.business}</Badge></Td>
                  <Td className="font-semibold text-ink">{e.customer}</Td>
                  <Td><code className="rounded-md bg-danger/5 px-2 py-1 text-xs text-danger">{e.detectedValueMasked}</code></Td>
                  <Td><StatusBadge status={e.actionTaken} /></Td>
                  <Td className="whitespace-nowrap text-muted">{e.createdAt}</Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </Card>
      </div>
    </>
  );
}