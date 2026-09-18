import { Zap } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardBody, CardHeader } from "@/components/dashboard/card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Table, TBody, Td, THead, Th, Tr } from "@/components/dashboard/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminSyncLogs } from "@/lib/dashboard-data";

const integrationStats = {
  hubspot: { connected: 12, disconnected: 15, total: 27 },
};

export default function AdminIntegrationsPage() {
  return (
    <>
      <PageHeader
        title="Integrations"
        description="Status integrasi seluruh bisnis: HubSpot, WhatsApp, Email Provider, dan Custom Webhook."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {/* HubSpot overview */}
        <Card>
          <CardHeader
            title="HubSpot CRM"
            subtitle={`${integrationStats.hubspot.connected} bisnis terhubung`}
            action={<StatusBadge status={integrationStats.hubspot.connected > 0 ? "ACTIVE" : "INACTIVE"} />}
          />
          <CardBody className="space-y-3">
            {[
              { label: "Terhubung", value: integrationStats.hubspot.connected.toString(), color: "text-success" },
              { label: "Terputus", value: integrationStats.hubspot.disconnected.toString(), color: "text-warning" },
              { label: "Total", value: integrationStats.hubspot.total.toString(), color: "text-ink" },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between border-b border-line/70 pb-2.5 last:border-b-0 last:pb-0">
                <span className="text-sm text-muted">{r.label}</span>
                <span className={`text-sm font-bold ${r.color}`}>{r.value}</span>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* WhatsApp */}
        <Card>
          <CardHeader
            title="WhatsApp Business API"
            subtitle="76 koneksi aktif"
            action={<Badge tone="success">Stabil</Badge>}
          />
          <CardBody className="space-y-3">
            {[
              { label: "Koneksi aktif", value: "76", color: "text-success" },
              { label: "Terputus", value: "3", color: "text-danger" },
              { label: "Total", value: "80", color: "text-ink" },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between border-b border-line/70 pb-2.5 last:border-b-0 last:pb-0">
                <span className="text-sm text-muted">{r.label}</span>
                <span className={`text-sm font-bold ${r.color}`}>{r.value}</span>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Sync logs */}
      <Card className="mt-6">
        <CardHeader
          title="Riwayat Sinkronisasi"
          subtitle="Log sinkronisasi terakhir lintas bisnis"
          action={<Button variant="ghost" size="sm"><Zap className="h-4 w-4" /> Sync Semua</Button>}
        />
        <Table>
          <THead>
            <Th>Bisnis</Th>
            <Th>Entity</Th>
            <Th>Nilai</Th>
            <Th>Status</Th>
            <Th>Error</Th>
            <Th>Terakhir</Th>
          </THead>
          <TBody>
            {adminSyncLogs.map((l) => (
              <Tr key={l.id}>
                <Td><Badge tone="dark">{l.business}</Badge></Td>
                <Td>
                  <Badge tone={l.entityType === "DEAL" ? "dark" : "accent"}>
                    {l.entityType}
                  </Badge>
                </Td>
                <Td className="font-semibold text-ink">{l.entity}</Td>
                <Td><StatusBadge status={l.syncStatus} /></Td>
                <Td className="max-w-48 truncate text-xs text-danger">{l.error ?? "—"}</Td>
                <Td className="whitespace-nowrap text-muted">{l.syncedAt}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </Card>
    </>
  );
}