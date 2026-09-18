import { FileDown, Filter, Search, Star } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardBody, CardHeader } from "@/components/dashboard/card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Table, TBody, Td, THead, Th, Tr } from "@/components/dashboard/table";
import { Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  customers,
  customerStatusOptions,
  exportFilters,
} from "@/lib/dashboard-data";

export default function UserCustomersPage() {
  return (
    <>
      <PageHeader
        title="Customer Data (Prospect)"
        description="Data pelanggan otomatis dari percakapan. Status berjalan NEW → CONTACTED → INTERESTED → QUALIFIED → NEGOTIATION → DEAL."
        actions={
          <>
            <Button href="/dashboard/user/export" variant="outline" size="md">
              <FileDown className="h-4 w-4" />
              Export Excel
            </Button>
            <Button variant="primary" size="md">
              Tambah Customer
            </Button>
          </>
        }
      />

      {/* Filter bar */}
      <Card>
        <CardBody className="flex flex-wrap items-end gap-3">
          <Select name="status" label="Status" defaultValue="all" className="w-44">
            <option value="all">Semua status</option>
            {customerStatusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
          <Select name="source" label="Sumber" defaultValue="all" className="w-44">
            {exportFilters.source.map((s) => (
              <option key={s} value={s === "Semua" ? "all" : s}>
                {s}
              </option>
            ))}
          </Select>
          <label className="flex h-11 flex-1 items-center gap-2 rounded-lg border border-line bg-white px-3.5 text-sm">
            <Search className="h-4 w-4 text-muted/60" />
            <input
              placeholder="Cari nama, WhatsApp, email..."
              className="w-full bg-transparent text-ink placeholder:text-muted/60 focus:outline-none"
            />
          </label>
          <Button variant="dark" size="md" className="gap-2">
            <Filter className="h-4 w-4" />
            Terapkan
          </Button>
        </CardBody>
      </Card>

      <Card className="mt-5">
        <CardHeader
          title="Daftar Customer"
          subtitle="9 dari 84 customer tampil sebagai contoh data"
          action={
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              data terpilih (is_selected)
            </div>
          }
        />
        <Table>
          <THead>
            <Th>Customer</Th>
            <Th>Email</Th>
            <Th>Perusahaan</Th>
            <Th>Produk Diminati</Th>
            <Th>Status</Th>
            <Th>Sumber</Th>
            <Th>Terakhir Kontak</Th>
            <Th />
          </THead>
          <TBody>
            {customers.map((c) => (
              <Tr key={c.id}>
                <Td>
                  <p className="font-bold text-ink">{c.name}</p>
                  <p className="text-xs text-muted">+{c.whatsapp}</p>
                </Td>
                <Td className="text-muted">{c.email ?? "—"}</Td>
                <Td className="text-muted">{c.company ?? "—"}</Td>
                <Td className="max-w-40">
                  <p className="truncate font-medium text-muted">{c.productInterest}</p>
                  {c.needs ? (
                    <p className="truncate text-xs text-muted/70">{c.needs}</p>
                  ) : null}
                </Td>
                <Td>
                  <StatusBadge status={c.status} />
                </Td>
                <Td>
                  <span className="rounded-md bg-cream px-2 py-1 text-xs font-semibold text-muted">
                    {c.source}
                  </span>
                </Td>
                <Td className="whitespace-nowrap text-muted">{c.lastContactAt}</Td>
                <Td>
                  {c.isSelected ? (
                    <Star className="h-4 w-4 fill-warning text-warning" />
                  ) : (
                    <button
                      type="button"
                      aria-label="Tandai terpilih"
                      className="text-muted/40 transition-colors hover:text-warning"
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  )}
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </Card>
    </>
  );
}