import { Handshake, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardHeader } from "@/components/dashboard/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Table, TBody, Td, THead, Th, Tr } from "@/components/dashboard/table";
import { Badge } from "@/components/ui/badge";
import { adminDeals } from "@/lib/dashboard-data";
import { formatIDR, formatNumber } from "@/lib/format";

const summary = { total: 2310, revenue: 142300000, completed: 1820 };

export default function AdminDealsPage() {
  return (
    <>
      <PageHeader
        title="Deals"
        description="Total deal dari seluruh bisnis di platform. Pantau pipeline dan status pembayaran."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Deal" value={formatNumber(summary.total)} icon={Handshake} sub="Semua bisnis" up />
        <StatCard label="Total Revenue" value={formatIDR(summary.revenue)} icon={TrendingUp} sub="PAID + COMPLETED" up />
        <StatCard label="Selesai" value={formatNumber(summary.completed)} icon={Handshake} sub="78.8% conversion" up />
      </div>

      <Card className="mt-6">
        <CardHeader title="Daftar Deal" subtitle="Contoh deal dari beberapa bisnis" />
        <Table>
          <THead>
            <Th>Bisnis</Th>
            <Th>Customer</Th>
            <Th>Produk</Th>
            <Th>Nilai</Th>
            <Th>Pembayaran</Th>
            <Th>Status</Th>
            <Th>Tanggal</Th>
          </THead>
          <TBody>
            {adminDeals.map((d) => (
              <Tr key={d.id}>
                <Td>
                  <Badge tone="dark">{d.business}</Badge>
                </Td>
                <Td className="font-bold text-ink">{d.customer}</Td>
                <Td className="max-w-40 truncate text-muted">{d.product}</Td>
                <Td className="font-semibold text-ink">{formatIDR(d.amount)}</Td>
                <Td>
                  <StatusBadge status={d.paymentStatus} />
                </Td>
                <Td>
                  <StatusBadge status={d.status} />
                </Td>
                <Td className="whitespace-nowrap text-muted">{d.date}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </Card>
    </>
  );
}