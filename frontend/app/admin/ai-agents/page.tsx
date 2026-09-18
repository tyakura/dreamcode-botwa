import { Bot, Globe, Search } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardHeader } from "@/components/dashboard/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Table, TBody, Td, THead, Th, Tr } from "@/components/dashboard/table";
import {
  adminAgentTotals,
  adminAiAgents,
} from "@/lib/dashboard-data";
import { formatNumber } from "@/lib/format";

export default function AdminAiAgentsPage() {
  return (
    <>
      <PageHeader
        title="AI Agents"
        description="Pemantauan seluruh AI Agent di semua bisnis: request volume, failed, escalation rate, dan token usage."
        actions={
          <label className="flex items-center gap-2 rounded-full border border-line bg-cream px-3.5 py-2 text-sm">
            <Search className="h-4 w-4 text-muted/60" />
            <input placeholder="Cari agent..." className="w-40 bg-transparent text-ink placeholder:text-muted/60 focus:outline-none" />
          </label>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Agent" value={adminAgentTotals.totalAgents.toString()} icon={Bot} sub="Semua bisnis" />
        <StatCard label="Aktif" value={adminAgentTotals.activeAgents.toString()} icon={Bot} sub="75% aktif" up />
        <StatCard label="Request Total" value={adminAgentTotals.requestsTotal} icon={Globe} sub="30 hari terakhir" up />
        <StatCard label="Escalation Rate" value={`${adminAgentTotals.avgEscalation}%`} icon={Bot} sub="Rata-rata platform" />
      </div>

      <Card className="mt-6">
        <CardHeader title="Daftar AI Agents" subtitle="Monitoring agent dari setiap bisnis" />
        <Table>
          <THead>
            <Th>Agent</Th>
            <Th>Bisnis</Th>
            <Th>Personality</Th>
            <Th>Status</Th>
            <Th>Request</Th>
            <Th>Failed</Th>
            <Th>Eskalasi</Th>
            <Th>Token</Th>
          </THead>
          <TBody>
            {adminAiAgents.map((a) => (
              <Tr key={a.id}>
                <Td>
                  <p className="font-bold text-ink">{a.name}</p>
                  <p className="text-xs text-muted">{a.operatingHours}</p>
                </Td>
                <Td className="text-muted">{a.business}</Td>
                <Td className="text-muted">{a.personality}</Td>
                <Td>
                  <StatusBadge status={a.status} />
                </Td>
                <Td className="font-semibold text-ink">{formatNumber(a.requests)}</Td>
                <Td className={a.failed > 20 ? "font-semibold text-danger" : "text-muted"}>
                  {formatNumber(a.failed)}
                </Td>
                <Td>
                  <span className={`rounded-md px-2 py-1 text-xs font-bold ${
                    a.escalationRate >= 13 ? "bg-danger/10 text-danger" : "bg-cream text-muted"
                  }`}>
                    {a.escalationRate}%
                  </span>
                </Td>
                <Td className="text-muted">{a.tokens}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </Card>
    </>
  );
}