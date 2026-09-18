import { CircleDollarSign, Handshake, Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardBody, CardHeader } from "@/components/dashboard/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Table, TBody, Td, THead, Th, Tr } from "@/components/dashboard/table";
import { Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { deals, dealRevenueThisMonth } from "@/lib/dashboard-data";
import { formatIDR } from "@/lib/format";

const dealSummary = {
  total: 12,
  revenue: 21400000,
  pending: 3,
  completed: 7,
};

export default function UserDealsPage() {
  return (
    <>
      <PageHeader
        title="Deal Data"
        description="Deal terdeteksi otomatis dari percakapan, lalu dikonfirmasi manusia sebelum final."
        actions={
          <>
            <Select name="deal-status" label="Status deal" defaultValue="all" className="w-44">
              <option value="all">Semua status</option>
              <option>PENDING</option>
              <option>CONFIRMED</option>
              <option>PAID</option>
              <option>COMPLETED</option>
              <option>CANCELLED</option>
            </Select>
            <Button variant="primary" size="md">
              <Plus className="h-4 w-4" />
              Tambah Deal
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Deal" value={dealSummary.total.toString()} icon={Handshake} sub="Semua waktu" up />
        <StatCard label="Total Revenue" value={formatIDR(dealSummary.revenue)} icon={CircleDollarSign} sub="PAID & COMPLETED" up />
        <StatCard label="Menunggu Konfirmasi" value={dealSummary.pending.toString()} icon={Handshake} sub="Perlu aksi manusia" />
        <StatCard label="Selesai" value={dealSummary.completed.toString()} icon={Handshake} sub="Deal final" up />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Daftar Deal" subtitle="6 dari 12 deal tampil sebagai contoh" />
          <Table>
            <THead>
              <Th>ID</Th>
              <Th>Customer</Th>
              <Th>Produk</Th>
              <Th>Qty</Th>
              <Th>Nilai</Th>
              <Th>Pembayaran</Th>
              <Th>Status</Th>
              <Th>Sales / CS</Th>
              <Th>Tanggal</Th>
            </THead>
            <TBody>
              {deals.map((d) => (
                <Tr key={d.id}>
                  <Td className="font-mono text-xs text-muted">#{d.id}</Td>
                  <Td className="font-bold text-ink">{d.customer}</Td>
                  <Td className="max-w-40 truncate">{d.product}</Td>
                  <Td>{d.quantity}</Td>
                  <Td className="font-semibold text-ink">{formatIDR(d.amount)}</Td>
                  <Td>
                    <StatusBadge status={d.paymentStatus} />
                  </Td>
                  <Td>
                    <StatusBadge status={d.status} />
                  </Td>
                  <Td className="text-muted">{d.handledBy ?? "—"}</Td>
                  <Td className="whitespace-nowrap text-muted">{d.dealDate}</Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </Card>

        <Card>
          <CardHeader title="Nilai Deal per Bulan" subtitle="Dalam juta rupiah" />
          <CardBody>
            <div className="flex h-40 items-end justify-between gap-2">
              {dealRevenueThisMonth.map((d) => (
                <div key={d.month} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="w-full max-w-8 rounded-t-md bg-accent" style={{ height: `${(d.value / 8) * 100}%` }} />
                  <span className="text-[10px] font-semibold text-muted">{d.month}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Deal berstatus <b className="text-ink">PENDING</b> masih menunggu
              konfirmasi manusia sebelum menjadi deal final.
            </p>
          </CardBody>
        </Card>
      </div>
    </>
  );
}