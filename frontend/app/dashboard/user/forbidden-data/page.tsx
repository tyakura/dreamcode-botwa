import { Plus, ShieldAlert, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardHeader } from "@/components/dashboard/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Table, TBody, Td, THead, Th, Tr } from "@/components/dashboard/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  forbiddenEvents,
  forbiddenRules,
  forbiddenSummary,
} from "@/lib/dashboard-data";

export default function UserForbiddenDataPage() {
  return (
    <>
      <PageHeader
        title="Forbidden Data"
        description="Atur aturan data terlarang (NIK, password, kartu kredit) yang dideteksi otomatis dari percakapan."
        actions={
          <Button variant="primary" size="md">
            <Plus className="h-4 w-4" />
            Tambah Aturan
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Aturan" value={forbiddenSummary.totalRules.toString()} icon={ShieldCheck} sub="Semua aturan" />
        <StatCard label="Aturan Aktif" value={forbiddenSummary.activeRules.toString()} icon={ShieldCheck} sub="Sedang aktif" up />
        <StatCard label="Kejadian Hari Ini" value={forbiddenSummary.eventsToday.toString()} icon={ShieldAlert} sub="Perlu perhatian" />
        <StatCard label="Ditandai (Mask)" value={forbiddenSummary.masked.toString()} icon={ShieldAlert} sub="Value dimask" />
        <StatCard label="Diblokir" value={forbiddenSummary.blocked.toString()} icon={ShieldAlert} sub="Action BLOCK" />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader title="Aturan Data Terlarang" subtitle="5 aturan terdaftar" />
          <Table>
            <THead>
              <Th>Nama</Th>
              <Th>Tipe</Th>
              <Th>Pola / Regex</Th>
              <Th>Aksi</Th>
              <Th>Retensi</Th>
              <Th>Aktif</Th>
            </THead>
            <TBody>
              {forbiddenRules.map((r) => (
                <Tr key={r.id}>
                  <Td className="font-semibold text-ink">{r.name}</Td>
                  <Td>
                    <Badge tone="neutral">{r.ruleType}</Badge>
                  </Td>
                  <Td>
                    <code className="rounded-md bg-cream px-2 py-1 text-xs text-primary">
                      {r.pattern}
                    </code>
                  </Td>
                  <Td>
                    <StatusBadge status={r.action} />
                  </Td>
                  <Td className="text-muted">{r.retention}</Td>
                  <Td>
                    <span
                      className={`inline-block h-2.5 w-2.5 rounded-full ${r.active ? "bg-success" : "bg-muted/40"}`}
                    />
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </Card>

        <Card>
          <CardHeader title="Log Deteksi" subtitle="Event terakhir saat data terlarang terdeteksi" />
          <Table>
            <THead>
              <Th>Aturan</Th>
              <Th>Pelanggan</Th>
              <Th>Percakapan</Th>
              <Th>Nilai Terdeteksi</Th>
              <Th>Aksi</Th>
              <Th>Waktu</Th>
            </THead>
            <TBody>
              {forbiddenEvents.map((e) => (
                <Tr key={e.id}>
                  <Td className="font-semibold text-ink">{e.rule}</Td>
                  <Td className="text-muted">{e.customer}</Td>
                  <Td className="font-mono text-xs text-muted">{e.conversation}</Td>
                  <Td>
                    <code className="rounded-md bg-danger/5 px-2 py-1 text-xs text-danger">
                      {e.detectedValueMasked}
                    </code>
                  </Td>
                  <Td>
                    <StatusBadge status={e.actionTaken} />
                  </Td>
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