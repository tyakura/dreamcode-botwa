import { Bot, FileText, Plus, Settings2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardBody, CardHeader } from "@/components/dashboard/card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Table, TBody, Td, THead, Th, Tr } from "@/components/dashboard/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { agentSetting, aiAgents, knowledgeBase } from "@/lib/dashboard-data";
import { formatNumber } from "@/lib/format";

const kbTone: Record<string, "accent" | "success" | "neutral"> = {
  FAQ: "accent",
  PRODUCT: "success",
  DOCUMENT: "neutral",
  MANUAL: "neutral",
};

export default function UserAiAgentPage() {
  const [agent] = aiAgents;

  return (
    <>
      <PageHeader
        title="AI Agent"
        description="Konfigurasi agen yang menjawab pelanggan 24 jam dan mengekstrak data dari percakapan."
        actions={
          <Button variant="dark" size="md">
            <Settings2 className="h-4 w-4" />
            Konfigurasi Agent
          </Button>
        }
      />

      <div className="grid gap-5 xl:grid-cols-3">
        {/* Kartu agent */}
        <Card className="xl:col-span-2">
          <CardHeader
            title={agent.name}
            subtitle="Agent utama untuk customer service bisnis Anda"
            action={<StatusBadge status={agent.status} />}
          />
          <CardBody>
            <div className="flex flex-wrap gap-6">
              <div className="flex min-w-40 flex-col gap-2">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary">
                  <Bot className="h-7 w-7" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Personality</p>
                  <p className="text-sm font-bold text-ink">{agent.personality}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Jam operasional</p>
                  <p className="text-sm font-bold text-ink">{agent.operatingHours}</p>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">System prompt</p>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
                  {agent.systemPrompt}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Request", value: formatNumber(agent.requests) },
                    { label: "Gagal", value: formatNumber(agent.failed) },
                    { label: "Eskalasi", value: `${agent.escalationRate}%` },
                    { label: "Token dipakai", value: agent.tokens },
                  ].map((m) => (
                    <div key={m.label} className="rounded-xl border border-line px-3 py-2.5">
                      <p className="text-[11px] font-semibold text-muted">{m.label}</p>
                      <p className="text-base font-extrabold text-ink">{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Ringkasan utility */}
        <Card>
          <CardHeader title="Utility Agent" subtitle="Pengaturan umum yang dipakai seluruh percakapan" />
          <CardBody className="space-y-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted">Human handoff</span>
              <span className="font-semibold text-ink">{agentSetting.humanHandoffTrigger}</span>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-line pt-3">
              <span className="text-muted">Follow-up otomatis</span>
              <Button href="/dashboard/user/follow-ups" variant="ghost" size="sm">Atur</Button>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-line pt-3">
              <span className="text-muted">Knowledge base</span>
              <Button href="#knowledge-base" variant="ghost" size="sm">Lihat</Button>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-line pt-3">
              <span className="text-muted">Forbidden rules</span>
              <Button href="/dashboard/user/forbidden-data" variant="ghost" size="sm">Atur</Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Knowledge base */}
      <Card id="knowledge-base" className="mt-6">
        <CardHeader
          title="Knowledge Base"
          subtitle="Sumber pengetahuan AI: FAQ, produk, price list, dan dokumen"
          action={
            <Button variant="primary" size="sm">
              <Plus className="h-4 w-4" />
              Tambah Konten
            </Button>
          }
        />
        <Table>
          <THead>
            <Th>Judul</Th>
            <Th>Tipe</Th>
            <Th>Konten</Th>
            <Th className="text-right">Aksi</Th>
          </THead>
          <TBody>
            {knowledgeBase.map((kb) => (
              <Tr key={kb.id}>
                <Td className="font-semibold text-ink">
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-accent-dark" />
                    {kb.title}
                  </span>
                </Td>
                <Td>
                  <Badge tone={kbTone[kb.sourceType]}>{kb.sourceType}</Badge>
                </Td>
                <Td className="max-w-md truncate">{kb.content}</Td>
                <Td>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">Ubah</Button>
                    <Button variant="ghost" size="sm" className="text-danger hover:bg-danger/10">
                      Hapus
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </Card>
    </>
  );
}