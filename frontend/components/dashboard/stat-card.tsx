import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/dashboard/card";

export function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  up,
  className,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  sub?: string;
  up?: boolean;
  className?: string;
}) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-wide text-muted">
            {label}
          </p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink">
            {value}
          </p>
          {sub ? (
            <p
              className={cn(
                "mt-1.5 flex items-center gap-1 text-xs font-medium",
                up ? "text-success" : "text-danger",
              )}
            >
              {up ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {sub}
            </p>
          ) : null}
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-accent">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </Card>
  );
}