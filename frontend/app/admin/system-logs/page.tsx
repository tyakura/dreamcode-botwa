import { AlertTriangle, History, Search } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardBody, CardHeader } from "@/components/dashboard/card";
import { Table, TBody, Td, THead, Th, Tr } from "@/components/dashboard/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auditLogs, systemErrorLogs } from "@/lib/dashboard-data";

export default function AdminSystemLogsPage() {
  return (
    <>
      <PageHeader
        title="System Logs"
        description="Audit trail seluruh aksi penting di platform dan error log sistem."
        actions={
          <label className="flex items-center gap-2 rounded-full border border-line bg-cream px-3.5 py-2 text-sm">
            <Search className="h-4 w-4 text-muted/60" />
            <input placeholder="Cari aksi, user, entity..." className="w-48 bg-transparent text-ink placeholder:text-muted/60 focus:outline-none" />
          </label>
        }
      />

      <div className="grid gap-5 xl:grid-cols-3">
        {/* Error logs */}
        <Card className="xl:col-span-1">
          <CardHeader
            title="Error Logs"
            subtitle={`${systemErrorLogs.length} error dalam 48 jam terakhir`}
            action={<Badge tone="danger">Perlu review</Badge>}
          />
          <CardBody className="space-y-3">
            {systemErrorLogs.map((e) => (
              <div key={e.id} className={`rounded-xl border px-4 py-3 ${
                e.level === "ERROR" ? "border-danger/30 bg-danger/5" : "border-warning/30 bg-warning/5"
              }`}>
                <div className="flex items-center gap-2">
                  {e.level === "ERROR" ? (
                    <AlertTriangle className="h-3.5 w-3.5 text-danger" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                  )}
                  <Badge tone={e.level === "ERROR" ? "danger" : "warning"}>{e.level}</Badge>
                </div>
                <p className="mt-2 text-sm font-medium text-ink">{e.message}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-muted">
                  <span className="font-mono">{e.stack}</span>
                  <span>{e.time}</span>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Audit logs */}
        <Card className="xl:col-span-2">
          <CardHeader
            title="Audit Logs"
            subtitle="Riwayat aksi user & sistem"
            action={<Button variant="ghost" size="sm"><History className="h-3.5 w-3.5" /> Export logs</Button>}
          />
          <Table>
            <THead>
              <Th>Waktu</Th>
              <Th>User</Th>
              <Th>Aksi</Th>
              <Th>Entity</Th>
              <Th>ID</Th>
              <Th>Metadata</Th>
            </THead>
            <TBody>
              {auditLogs.map((a) => (
                <Tr key={a.id}>
                  <Td className="whitespace-nowrap text-muted">{a.createdAt}</Td>
                  <Td>
                    <p className="font-semibold text-ink">{a.user}</p>
                    {a.business ? (
                      <p className="text-xs text-muted">{a.business}</p>
                    ) : null}
                  </Td>
                  <Td>
                    <Badge tone={a.action.includes("create") ? "success" : a.action.includes("suspend") || a.action.includes("delete") ? "danger" : "accent"}>
                      {a.action}
                    </Badge>
                  </Td>
                  <Td>
                    <span className="rounded-md bg-cream px-2 py-1 text-xs font-semibold text-muted">
                      {a.entity}
                    </span>
                  </Td>
                  <Td className="font-mono text-xs text-muted">#{a.entityId}</Td>
                  <Td>
                    <code className="max-w-48 block truncate rounded-md bg-cream px-2 py-1 text-xs text-primary">
                      {a.metadata}
                    </code>
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