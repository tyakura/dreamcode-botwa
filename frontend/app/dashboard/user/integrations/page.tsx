import { ExternalLink, Plug, Zap } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardBody, CardHeader } from "@/components/dashboard/card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Table, TBody, Td, THead, Th, Tr } from "@/components/dashboard/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  hubspotSyncLogs,
  userIntegrations,
} from "@/lib/dashboard-data";

export default function UserIntegrationsPage() {
  return (
    <>
      <PageHeader
        title="Integrations"
        description="Hubungkan platform dengan layanan eksternal: HubSpot CRM, WhatsApp Business API, Email Provider, dan Custom Webhook."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {userIntegrations.map((i) => (
          <Card key={i.id}>
            <CardHeader
              title={i.name}
              subtitle={i.description}
              action={
                <StatusBadge
                  status={
                    i.status === "NOT_CONFIGURED"
                      ? "NOT_CONFIGURED"
                      : i.status
                  }
                />
              }
            />
            <CardBody>
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-muted">
                  Provider:{" "}
                  <span className="font-semibold text-ink">{i.provider}</span>
                </p>
                {i.lastSync ? (
                  <Badge tone="success" className="gap-1">
                    <Zap className="h-3 w-3" />
                    {i.lastSync}
                  </Badge>
                ) : null}
              </div>
              <div className="mt-4">
                {i.status === "DISCONNECTED" ? (
                  <Button variant="primary" size="md" className="w-full">
                    <ExternalLink className="h-4 w-4" />
                    Hubungkan
                  </Button>
                ) : i.status === "NOT_CONFIGURED" ? (
                  <Button variant="outline" size="md" className="w-full" disabled>
                    <Plug className="h-4 w-4" />
                    Belum Dikonfigurasi
                  </Button>
                ) : (
                  <Button variant="ghost" size="md" className="w-full text-danger hover:bg-danger/10">
                    Putuskan Koneksi
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Riwayat Sinkronisasi HubSpot"
          subtitle="Log sinkronisasi customer dan deal ke HubSpot (arah: Platform → HubSpot)"
          action={
            <Button variant="outline" size="sm">
              <Zap className="h-4 w-4" />
              Sync Sekarang
            </Button>
          }
        />
        <Table>
          <THead>
            <Th>Entity</Th>
            <Th>Nilai</Th>
            <Th>Status</Th>
            <Th>Error</Th>
            <Th>Terakhir Sync</Th>
          </THead>
          <TBody>
            {hubspotSyncLogs.map((l) => (
              <Tr key={l.id}>
                <Td>
                  <Badge tone={l.entityType === "DEAL" ? "dark" : "accent"}>
                    {l.entityType}
                  </Badge>
                </Td>
                <Td className="font-semibold text-ink">{l.entity}</Td>
                <Td>
                  <StatusBadge status={l.syncStatus} />
                </Td>
                <Td className="max-w-48 truncate text-xs text-danger">
                  {l.error ?? "—"}
                </Td>
                <Td className="whitespace-nowrap text-muted">{l.syncedAt}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </Card>
    </>
  );
}