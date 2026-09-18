import { Building2, Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardHeader } from "@/components/dashboard/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Table, TBody, Td, THead, Th, Tr } from "@/components/dashboard/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminBusinesses } from "@/lib/dashboard-data";

const bizSummary = {
  total: 128,
  active: 112,
  suspended: 6,
};

export default function AdminBusinessesPage() {
  return (
    <>
      <PageHeader
        title="Businesses"
        description="Kelola seluruh bisnis/tenant di platform. Lihat status, jumlah agent, customer, dan integrasi."
        actions={
          <Button variant="primary" size="md">
            <Plus className="h-4 w-4" />
            Tambah Bisnis
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Bisnis" value={bizSummary.total.toString()} icon={Building2} sub="Semua status" />
        <StatCard label="Aktif" value={bizSummary.active.toString()} icon={Building2} sub="Beroperasi normal" up />
        <StatCard label="Suspended" value={bizSummary.suspended.toString()} icon={Building2} sub="Perlu review" />
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Daftar Bisnis"
          subtitle="4 bisnis sebagai contoh data"
          action={
            <label className="flex items-center gap-2 rounded-full border border-line bg-cream px-3.5 py-2 text-sm">
              <Search className="h-4 w-4 text-muted/60" />
              <input placeholder="Cari bisnis..." className="w-40 bg-transparent text-ink placeholder:text-muted/60 focus:outline-none" />
            </label>
          }
        />
        <Table>
          <THead>
            <Th>Bisnis</Th>
            <Th>Owner</Th>
            <Th>Status</Th>
            <Th>Agents</Th>
            <Th>Customers</Th>
            <Th>Integrasi</Th>
            <Th>Dibuat</Th>
            <Th className="text-right">Aksi</Th>
          </THead>
          <TBody>
            {adminBusinesses.map((b) => (
              <Tr key={b.id}>
                <Td className="font-bold text-ink">{b.name}</Td>
                <Td className="text-muted">{b.owner}</Td>
                <Td>
                  <StatusBadge status={b.status} />
                </Td>
                <Td className="text-muted">{b.agents}</Td>
                <Td className="text-muted">{b.customers}</Td>
                <Td>
                  {b.integration === "CONNECTED" ? (
                    <Badge tone="success">Connected</Badge>
                  ) : b.integration === "DISCONNECTED" ? (
                    <Badge tone="warning">Disconnected</Badge>
                  ) : (
                    <Badge tone="neutral">None</Badge>
                  )}
                </Td>
                <Td className="whitespace-nowrap text-muted">{b.createdAt}</Td>
                <td className="px-5 py-3.5 text-right">
                  <Button variant="ghost" size="sm">
                    Kelola
                  </Button>
                </td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </Card>
    </>
  );
}