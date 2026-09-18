import { FileDown, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardBody, CardHeader } from "@/components/dashboard/card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Table, TBody, Td, THead, Th, Tr } from "@/components/dashboard/table";
import { Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { exportFilters, exportJobs } from "@/lib/dashboard-data";

export default function UserExportPage() {
  return (
    <>
      <PageHeader
        title="Export Data"
        description="Export data customer & deal ke Excel. Pilih filter sesuai kebutuhan, hasil siap diunduh."
      />

      <div className="grid gap-5 lg:grid-cols-5">
        {/* Form filter export */}
        <Card className="lg:col-span-2">
          <CardHeader title="Filter Export" subtitle="Pilih parameter data yang ingin di-export" />
          <CardBody className="space-y-4">
            <Select name="status" label="Status customer" defaultValue="all" className="w-full">
              {exportFilters.status.map((s) => (
                <option key={s} value={s === "Semua" ? "all" : s}>
                  {s}
                </option>
              ))}
            </Select>
            <Select name="product" label="Produk" defaultValue="all" className="w-full">
              {exportFilters.products.map((p) => (
                <option key={p} value={p === "Semua" ? "all" : p}>
                  {p}
                </option>
              ))}
            </Select>
            <Select name="source" label="Sumber lead" defaultValue="all" className="w-full">
              {exportFilters.source.map((s) => (
                <option key={s} value={s === "Semua" ? "all" : s}>
                  {s}
                </option>
              ))}
            </Select>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-ink">Tanggal (opsional)</span>
              <input
                type="date"
                className="h-11 w-full rounded-lg border border-line bg-white px-3.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-accent/60"
              />
            </label>
            <Button variant="primary" size="md" className="w-full">
              <FileDown className="h-4 w-4" />
              Buat Export
            </Button>
          </CardBody>
        </Card>

        {/* Riwayat export */}
        <Card className="lg:col-span-3">
          <CardHeader
            title="Riwayat Export"
            subtitle="Status permintaan export sebelumnya"
            action={
              <Button variant="ghost" size="sm">
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </Button>
            }
          />
          <Table>
            <THead>
              <Th>ID</Th>
              <Th>Filter</Th>
              <Th>Baris</Th>
              <Th>Status</Th>
              <Th>Oleh</Th>
              <Th>Dibuat</Th>
              <Th>Selesai</Th>
              <Th />
            </THead>
            <TBody>
              {exportJobs.map((j) => (
                <Tr key={j.id}>
                  <Td className="font-mono text-xs text-muted">#{j.id}</Td>
                  <Td className="max-w-56 truncate text-xs text-muted">{j.filter}</Td>
                  <Td className="text-muted">
                    {j.rowCount != null ? `${j.rowCount.toLocaleString("id-ID")} baris` : "—"}
                  </Td>
                  <Td>
                    <StatusBadge status={j.status} />
                  </Td>
                  <Td className="text-muted">{j.requestedBy}</Td>
                  <Td className="whitespace-nowrap text-muted">{j.createdAt}</Td>
                  <Td className="whitespace-nowrap text-muted">
                    {j.completedAt ?? "—"}
                  </Td>
                  <Td>
                    {j.status === "DONE" ? (
                      <Button variant="primary" size="sm">
                        <FileDown className="h-3.5 w-3.5" />
                        Unduh
                      </Button>
                    ) : j.status === "FAILED" ? (
                      <Button variant="ghost" size="sm" className="text-danger hover:bg-danger/10">
                        Ulangi
                      </Button>
                    ) : (
                      <span className="text-xs text-muted/70">Proses...</span>
                    )}
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </Card>
      </div>
    </>
  );
}