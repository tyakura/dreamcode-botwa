import { Bot, MessageSquareText, UserRound } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardHeader } from "@/components/dashboard/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Table, TBody, Td, THead, Th, Tr } from "@/components/dashboard/table";
import { Badge } from "@/components/ui/badge";
import { conversationSummary, conversations } from "@/lib/dashboard-data";
import { formatNumber } from "@/lib/format";

export default function UserConversationsPage() {
  return (
    <>
      <PageHeader
        title="Customer Service — Conversations"
        description="Semua percakapan WhatsApp pelanggan. AI menjawab otomatis, manusia mengambil alih saat handoff."
        actions={
          <div className="flex items-center gap-2">
            <Badge tone="success">
              AI menangani {conversationSummary.aiHandled} chat
            </Badge>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Percakapan Terbuka" value={formatNumber(conversationSummary.open)} icon={MessageSquareText} sub="Perlu ditindaklanjuti" up />
        <StatCard label="Menunggu" value={formatNumber(conversationSummary.pending)} icon={MessageSquareText} sub="Pending human handoff" up />
        <StatCard label="Selesai" value={formatNumber(conversationSummary.closed)} icon={MessageSquareText} sub="Total ditutup" />
        <StatCard label="Total Pesan" value={formatNumber(conversationSummary.totalMessages)} icon={MessageSquareText} sub="Semua kanal" />
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Daftar Percakapan"
          subtitle="Diurutkan berdasarkan aktivitas terbaru"
          action={
            <div className="flex items-center gap-2">
              <Badge tone="accent">AI: {conversationSummary.aiHandled}</Badge>
              <Badge tone="neutral">Human: {conversationSummary.totalMessages - conversationSummary.aiHandled}</Badge>
            </div>
          }
        />
        <Table>
          <THead>
            <Th>Pelanggan</Th>
            <Th>Pesan Terakhir</Th>
            <Th>Mode</Th>
            <Th>Status</Th>
            <Th>Ditangani Oleh</Th>
            <Th>Terakhir Aktif</Th>
          </THead>
          <TBody>
            {conversations.map((c) => (
              <Tr key={c.id}>
                <Td>
                  <p className="font-bold text-ink">{c.customer}</p>
                  <p className="text-xs text-muted">+{c.whatsapp}</p>
                </Td>
                <Td className="max-w-xs truncate italic text-muted">
                  &ldquo;{c.lastMessage}&rdquo;
                </Td>
                <Td>
                  <Badge tone={c.mode === "AI" ? "accent" : "dark"} className="gap-1">
                    {c.mode === "AI" ? (
                      <Bot className="h-3 w-3" />
                    ) : (
                      <UserRound className="h-3 w-3" />
                    )}
                    {c.mode}
                  </Badge>
                </Td>
                <Td>
                  <StatusBadge status={c.status} />
                </Td>
                <Td className="text-muted">
                  {c.assignedTo ?? (c.mode === "AI" ? "DreamBot CS" : "—")}
                </Td>
                <Td className="whitespace-nowrap text-muted">{c.updatedAt}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </Card>
    </>
  );
}