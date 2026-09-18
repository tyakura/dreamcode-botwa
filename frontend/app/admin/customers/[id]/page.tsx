import {
  ArrowLeft,
  Building2,
  CalendarClock,
  Handshake,
  Mail,
  MessageSquareText,
  PencilLine,
  Phone,
  RefreshCcw,
  Repeat2,
  Smartphone,
  Wallet,
} from "lucide-react";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardBody, CardHeader } from "@/components/dashboard/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Table, TBody, Td, THead, Th, Tr } from "@/components/dashboard/table";
import {
  adminCustomers,
  getAdminCustomerActivities,
  getAdminCustomerById,
  getAdminCustomerDeals,
  getAdminCustomerFollowUps,
} from "@/lib/dashboard-data";
import type { CustomerActivityRecord } from "@/lib/dashboard-data";
import { formatIDR } from "@/lib/format";

export async function generateStaticParams() {
  return adminCustomers.map((c) => ({ id: String(c.id) }));
}

function compactIDR(value: number): string {
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toLocaleString("id-ID", {
      maximumFractionDigits: 1,
    })} jt`;
  }
  return formatIDR(value);
}

function InfoField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd className="text-sm font-bold text-ink">{children}</dd>
    </div>
  );
}

const activityIcon: Record<
  CustomerActivityRecord["type"],
  { icon: typeof MessageSquareText; className: string }
> = {
  STATUS_CHANGE: { icon: RefreshCcw, className: "bg-accent/25 text-primary" },
  CONVERSATION: { icon: MessageSquareText, className: "bg-cream-dark text-ink" },
  FOLLOW_UP: { icon: Repeat2, className: "bg-amber-100 text-amber-950" },
  DEAL: { icon: Handshake, className: "bg-emerald-100 text-emerald-950" },
};

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = getAdminCustomerById(Number(id));
  if (!customer) notFound();

  const deals = getAdminCustomerDeals(customer.name);
  const followUps = getAdminCustomerFollowUps(customer.name);
  const activities = getAdminCustomerActivities(customer.id);
  const totalDealValue = deals.reduce((sum, d) => sum + d.amount, 0);

  return (
    <>
      <div className="mb-4">
        <Button
          href="/admin/customers"
          variant="ghost"
          size="sm"
          className="-ml-3 gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Customer Data
        </Button>
      </div>

      <PageHeader
        title={customer.name}
        description={`Customer #${customer.id} · ${customer.business} · ${customer.status} · terakhir update ${customer.updatedAt}`}
        actions={
          <>
            <Button variant="outline" size="md">
              <PencilLine className="h-4 w-4" />
              Edit Data
            </Button>
            <a
              href={`https://wa.me/${customer.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-bold text-primary shadow-sm transition-colors hover:bg-accent-dark"
            >
              <Phone className="h-4 w-4" />
              Chat WhatsApp
            </a>
            <StatusBadge status={customer.status} />
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Deal"
          value={deals.length.toString()}
          icon={Handshake}
          sub={deals.length > 0 ? "Terkait customer" : "Belum ada deal"}
          up={deals.length > 0}
        />
        <StatCard
          label="Nilai Deal"
          value={compactIDR(totalDealValue)}
          icon={Wallet}
          sub={deals.length > 0 ? "Total transaksi" : "Menunggu penawaran"}
          up={deals.length > 0}
        />
        <StatCard
          label="Terakhir Update"
          value={customer.updatedAt}
          icon={CalendarClock}
          sub="Diubah terakhir"
        />
        <StatCard
          label="Sumber"
          value={customer.source}
          icon={Smartphone}
          sub={`@ ${customer.business}`}
        />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        {/* Profil */}
        <Card className="xl:col-span-2">
          <CardHeader
            title="Data Klien"
            subtitle="Informasi kontak dan profil pelanggan lintas bisnis"
          />
          <CardBody>
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <InfoField label="Bisnis">
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-muted" />
                  {customer.business}
                </span>
              </InfoField>
              <InfoField label="Nama Lengkap">{customer.name}</InfoField>
              <InfoField label="WhatsApp">
                <span className="font-mono text-xs">+{customer.whatsapp}</span>
              </InfoField>
              <InfoField label="Email">{customer.email ?? "—"}</InfoField>
              <InfoField label="Perusahaan">
                {customer.company ?? "Individu"}
              </InfoField>
              <InfoField label="Produk">
                {customer.product}
              </InfoField>
              <InfoField label="Alamat">
                {customer.address ? (
                  <>
                    {customer.address}
                    {customer.city ? `, ${customer.city}` : null}
                  </>
                ) : (
                  "—"
                )}
              </InfoField>
              <InfoField label="Status">
                <StatusBadge status={customer.status} />
              </InfoField>
              <InfoField label="Sumber">{customer.source}</InfoField>
              <InfoField label="Data Dibuat">
                {customer.createdAt ?? "—"}
              </InfoField>
            </dl>

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                Tag:
              </span>
              {(customer.tags ?? []).map((tag) => (
                <Badge key={tag} tone="accent">
                  {tag}
                </Badge>
              ))}
            </div>

            {customer.notes ? (
              <div className="mt-4 rounded-xl border border-line bg-cream px-3.5 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                  Catatan
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {customer.notes}
                </p>
              </div>
            ) : null}
          </CardBody>
        </Card>

        {/* Aktivitas */}
        <Card>
          <CardHeader
            title="Timeline Aktivitas"
            subtitle="Riwayat interaksi lintas bisnis"
          />
          <CardBody>
            {activities.length > 0 ? (
              <div className="ml-1 border-l border-line">
                {activities.map((a) => {
                  const conf = activityIcon[a.type];
                  const Icon = conf.icon;
                  return (
                    <div
                      key={a.id}
                      className="relative flex gap-4 pb-5 pl-7 last:pb-0"
                    >
                      <span
                        className={`absolute -left-2.5 top-0 flex h-6 w-6 items-center justify-center rounded-full ${conf.className}`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-ink">{a.title}</p>
                        {a.detail ? (
                          <p className="mt-0.5 text-xs leading-relaxed text-muted">
                            {a.detail}
                          </p>
                        ) : null}
                        <p className="mt-0.5 text-[11px] text-muted/60">{a.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState title="Belum ada aktivitas" />
            )}
          </CardBody>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        {/* Deals */}
        <Card>
          <CardHeader
            title="Deal Terkait"
            subtitle={`${deals.length} deal tercatat atas nama ${customer.name}`}
          />
          {deals.length > 0 ? (
            <Table>
              <THead>
                <Th>ID</Th>
                <Th>Produk</Th>
                <Th>Nilai</Th>
                <Th>Pembayaran</Th>
                <Th>Status</Th>
                <Th>Tanggal</Th>
              </THead>
              <TBody>
                {deals.map((d) => (
                  <Tr key={d.id}>
                    <Td className="font-mono text-xs text-muted">#{d.id}</Td>
                    <Td className="font-medium text-ink">{d.product}</Td>
                    <Td className="font-semibold text-ink">
                      {formatIDR(d.amount)}
                    </Td>
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
          ) : (
            <EmptyState
              icon={Handshake}
              title="Belum ada deal"
              description="Deal customer bisnis ini akan tampil di sini."
            />
          )}
        </Card>

        {/* Follow-up */}
        <Card>
          <CardHeader
            title="Follow Up"
            subtitle={`${followUps.length} follow-up terjadwal`}
          />
          {followUps.length > 0 ? (
            <Table>
              <THead>
                <Th>Kanal</Th>
                <Th>Jadwal</Th>
                <Th>Status</Th>
              </THead>
              <TBody>
                {followUps.map((f) => (
                  <Tr key={f.id}>
                    <Td>
                      <Badge tone={f.channel === "WHATSAPP" ? "accent" : "neutral"}>
                        {f.channel}
                      </Badge>
                    </Td>
                    <Td className="whitespace-nowrap text-muted">
                      {f.scheduledAt}
                    </Td>
                    <Td>
                      <StatusBadge status={f.status} />
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          ) : (
            <EmptyState
              icon={Mail}
              title="Belum ada follow-up"
              description="Follow-up customer bisnis ini akan tampil di sini."
            />
          )}
        </Card>
      </div>
    </>
  );
}