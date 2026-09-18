import {
  ArrowLeft,
  CalendarClock,
  Handshake,
  Link,
  MessageSquareText,
  PencilLine,
  Phone,
  RefreshCcw,
  Repeat2,
  Smartphone,
  Star,
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
  customers,
  getCustomerActivities,
  getCustomerById,
  getCustomerConversations,
  getCustomerDeals,
  getCustomerFollowUps,
} from "@/lib/dashboard-data";
import type { CustomerActivityRecord } from "@/lib/dashboard-data";
import { formatIDR } from "@/lib/format";

export async function generateStaticParams() {
  return customers.map((c) => ({ id: String(c.id) }));
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

export default async function UserCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = getCustomerById(Number(id));
  if (!customer) notFound();

  const deals = getCustomerDeals(customer.name);
  const conversations = getCustomerConversations(customer.name);
  const followUps = getCustomerFollowUps(customer.name);
  const activities = getCustomerActivities(customer.id);
  const totalDealValue = deals.reduce((sum, d) => sum + d.amount, 0);

  return (
    <>
      <div className="mb-4">
        <Button
          href="/dashboard/user/customers"
          variant="ghost"
          size="sm"
          className="-ml-3 gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Data Customer
        </Button>
      </div>

      <PageHeader
        title={customer.name}
        description={`Detail customer #${customer.id} — ${customer.status} · terakhir kontak ${customer.lastContactAt}`}
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
          sub={
            deals.length > 0 ? `${conversations.length} percakapan` : "Belum ada deal"
          }
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
          label="Terakhir Kontak"
          value={customer.lastContactAt}
          icon={CalendarClock}
          sub="Terakhir diupdate"
        />
        <StatCard
          label="Sumber"
          value={customer.source}
          icon={Smartphone}
          sub={customer.source === "WHATSAPP" ? "Kanal utama" : "Lainnya"}
        />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        {/* Profil */}
        <Card className="xl:col-span-2">
          <CardHeader
            title="Data Klien"
            subtitle="Informasi kontak dan profil pelanggan"
            action={
              customer.isSelected ? (
                <Badge tone="warning" className="gap-1">
                  <Star className="h-3 w-3 fill-warning text-warning" />
                  Terpilih
                </Badge>
              ) : (
                <Badge tone="neutral">Belum terpilih</Badge>
              )
            }
          />
          <CardBody>
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <InfoField label="Nama Lengkap">
                <span className="flex items-center gap-1.5">
                  {customer.name}
                  {customer.isSelected ? (
                    <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                  ) : null}
                </span>
              </InfoField>
              <InfoField label="WhatsApp">
                <span className="font-mono text-xs">+{customer.whatsapp}</span>
              </InfoField>
              <InfoField label="Email">{customer.email ?? "—"}</InfoField>
              <InfoField label="Perusahaan">
                {customer.company ?? "Individu"}
              </InfoField>
              <InfoField label="Produk Diminati">
                {customer.productInterest}
              </InfoField>
              <InfoField label="Kebutuhan">
                {customer.needs ?? "—"}
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
            subtitle="Riwayat interaksi dengan customer"
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

      {/* Deals */}
      <Card className="mt-5">
        <CardHeader
          title="Deal Terkait"
          subtitle={`${deals.length} deal tercatat atas nama ${customer.name}`}
        />
        {deals.length > 0 ? (
          <Table>
            <THead>
              <Th>ID</Th>
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
                  <Td className="font-medium text-ink">{d.product}</Td>
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
        ) : (
          <EmptyState
            icon={Handshake}
            title="Belum ada deal"
            description="Deal akan tercantum di sini saat terdeteksi dari percakapan."
          />
        )}
      </Card>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        {/* Percakapan */}
        <Card>
          <CardHeader
            title="Percakapan"
            subtitle={`${conversations.length} percakapan terkait`}
          />
          {conversations.length > 0 ? (
            <Table>
              <THead>
                <Th>Pesan Terakhir</Th>
                <Th>Mode</Th>
                <Th>Status</Th>
                <Th>Ditangani</Th>
              </THead>
              <TBody>
                {conversations.map((c) => (
                  <Tr key={c.id}>
                    <Td className="max-w-52 truncate italic text-muted">
                      &ldquo;{c.lastMessage}&rdquo;
                    </Td>
                    <Td>
                      <Badge tone={c.mode === "AI" ? "accent" : "dark"}>
                        {c.mode}
                      </Badge>
                    </Td>
                    <Td>
                      <StatusBadge status={c.status} />
                    </Td>
                    <Td className="whitespace-nowrap text-muted">
                      {c.assignedTo ?? (c.mode === "AI" ? "DreamBot CS" : "—")}
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          ) : (
            <EmptyState
              icon={MessageSquareText}
              title="Belum ada percakapan"
              description="Percakapan WhatsApp customer tampil di sini."
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
                <Th>Tipe</Th>
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
                    <Td>
                      <span className="rounded-md bg-cream px-2 py-1 text-xs font-semibold text-muted">
                        {f.type}
                      </span>
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
              icon={Link}
              title="Belum ada follow-up"
              description="Follow-up otomatis atau manual akan tampil di sini."
            />
          )}
        </Card>
      </div>
    </>
  );
}