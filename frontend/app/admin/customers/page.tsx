import { Search, Users } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardHeader } from "@/components/dashboard/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Table, TBody, Td, THead, Th, Tr } from "@/components/dashboard/table";
import { Badge } from "@/components/ui/badge";
import { adminCustomers } from "@/lib/dashboard-data";

const summary = { total: 14320, active: 11240, newToday: 12 };

export default function AdminCustomersPage() {
  return (
    <>
      <PageHeader
        title="Customer Data"
        description="Data pelanggan dari seluruh bisnis di platform. Filter per bisnis, status, atau sumber."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Customer" value={summary.total.toLocaleString("id-ID")} icon={Users} sub="Semua bisnis" up />
        <StatCard label="Aktif" value={summary.active.toLocaleString("id-ID")} icon={Users} sub="Non-LOST" up />
        <StatCard label="Baru Hari Ini" value={summary.newToday.toString()} icon={Users} sub="Status NEW" />
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Daftar Customer"
          subtitle="6 contoh data lintas bisnis"
          action={
            <label className="flex items-center gap-2 rounded-full border border-line bg-cream px-3.5 py-2 text-sm">
              <Search className="h-4 w-4 text-muted/60" />
              <input placeholder="Cari nama, WA, bisnis..." className="w-48 bg-transparent text-ink placeholder:text-muted/60 focus:outline-none" />
            </label>
          }
        />
        <Table>
          <THead>
            <Th>Bisnis</Th>
            <Th>Customer</Th>
            <Th>WhatsApp</Th>
            <Th>Produk</Th>
            <Th>Status</Th>
            <Th>Sumber</Th>
            <Th>Terakhir Update</Th>
          </THead>
          <TBody>
            {adminCustomers.map((c) => (
              <Tr key={c.id}>
                <Td>
                  <Badge tone="dark">{c.business}</Badge>
                </Td>
                <Td className="font-bold text-ink">
                  <Link
                    href={`/admin/customers/${c.id}`}
                    className="transition-colors hover:text-accent-dark hover:underline"
                  >
                    {c.name}
                  </Link>
                </Td>
                <Td className="font-mono text-xs text-muted">+{c.whatsapp}</Td>
                <Td className="max-w-32 truncate text-muted">{c.product}</Td>
                <Td>
                  <StatusBadge status={c.status} />
                </Td>
                <Td>
                  <span className="rounded-md bg-cream px-2 py-1 text-xs font-semibold text-muted">
                    {c.source}
                  </span>
                </Td>
                <Td className="whitespace-nowrap text-muted">{c.updatedAt}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </Card>
    </>
  );
}