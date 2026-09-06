import type { Metadata } from "next";
import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Dashboard pengguna untuk AI WhatsApp Business Agent — segera hadir.",
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <header className="bg-primary">
        <div className="container-x flex h-16 items-center justify-between">
          <Logo dark />
          <Button href="/" variant="light" size="sm">
            Kembali ke Beranda
          </Button>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-5">
        <div className="max-w-md rounded-3xl border border-line bg-white p-10 text-center shadow-sm">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-accent">
            <Construction className="h-8 w-8" />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold text-ink">
            Dashboard segera hadir
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Akun Anda berhasil dibuat. Halaman overview bisnis, AI Agent,
            customer, deal, dan follow-up sedang dikembangkan.
          </p>
          <Button href="/" variant="primary" size="md" className="mt-6">
            Kembali ke Beranda
          </Button>
        </div>
      </main>
    </div>
  );
}