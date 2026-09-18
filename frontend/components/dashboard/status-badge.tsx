import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  const s = status.toUpperCase();
  let tone: "neutral" | "accent" | "success" | "warning" | "danger" | "dark" =
    "neutral";

  if (
    ["DEAL", "COMPLETED", "CONFIRMED", "PAID", "SYNCED", "DONE", "ACTIVE", "CONNECTED", "ONLINE", "REPLIED", "DELIVERED", "QUALIFIED", "SUCCESS", "OPEN"].includes(s)
  ) {
    tone = "success";
  } else if (
    ["PENDING", "SCHEDULED", "SENT", "PROCESSING", "PARTIAL", "PENDING_SYNC", "NEW", "CONTACTED", "INACTIVE", "DISCONNECTED", "PENDING"].includes(s)
  ) {
    tone = "warning";
  } else if (
    ["FAILED", "CANCELLED", "SUSPENDED", "LOST", "BLOCKED", "ERROR", "OFFLINE", "BLOCK"].includes(s)
  ) {
    tone = "danger";
  } else if (
    ["INTERESTED", "NEGOTIATION", "FLAG", "NOT_CONFIGURED", "MASK", "WARN", "CLOSED"].includes(s)
  ) {
    tone = "accent";
  }

  return <Badge tone={tone}>{status}</Badge>;
}