import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger" | "dark";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  const tones: Record<BadgeTone, string> = {
    neutral: "bg-cream-dark text-ink border-line",
    accent: "bg-accent/25 text-primary border-accent/50 font-bold",
    success: "bg-emerald-100 text-emerald-950 border-emerald-300 font-semibold",
    warning: "bg-amber-100 text-amber-950 border-amber-300 font-semibold",
    danger: "bg-rose-100 text-rose-950 border-rose-300 font-semibold",
    dark: "bg-primary text-white border-primary font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}