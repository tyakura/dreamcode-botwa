import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Harga",
  description:
    "Paket harga WhatsApp Business Agent: Starter, Growth, dan Enterprise.",
};

type Plan = {
  name: string;
  tagline: string;
  price: string;
  monthly: string;
  featured?: boolean;
  features: { label: string; included: boolean }[];
  cta: { label: string; href: string };
};

const plans: Plan[] = [
  {
    name: "Starter",
    tagline: "Untuk bisnis yang baru mulai otomatisasi CS.",
    price: "Rp150rb",
    monthly: "per bulan",
    features: [
      { label: "1 AI Agent aktif", included: true },
      { label: "500 percakapan / bln", included: true },
      { label: "Knowledge base dasar (FAQ & produk)", included: true },
      { label: "Auto customer data & pipeline prospek", included: true },
      { label: "Export Excel", included: true },
      { label: "Follow-up otomatis WhatsApp", included: true },
      { label: "Human handoff", included: false },
      { label: "Integrasi HubSpot", included: false },
    ],
    cta: { label: "Mulai Gratis", href: "/register" },
  },
  {
    name: "Growth",
    tagline: "Untuk tim CS & sales yang butuh kontrol penuh.",
    price: "Rp450rb",
    monthly: "per bulan",
    featured: true,
    features: [
      { label: "3 AI Agent aktif", included: true },
      { label: "5.000 percakapan / bln", included: true },
      { label: "Knowledge base lengkap + dokumen", included: true },
      { label: "Deal detection & konfirmasi", included: true },
      { label: "Follow-up WhatsApp & Email", included: true },
      { label: "Forbidden data protection", included: true },
      { label: "Human handoff", included: true },
      { label: "Integrasi HubSpot", included: true },
    ],
    cta: { label: "Pilih Growth", href: "/register" },
  },
  {
    name: "Enterprise",
    tagline: "Untuk multi-brand & kebutuhan kustom.",
    price: "Custom",
    monthly: "hubungi kami",
    features: [
      { label: "AI Agent tanpa batas", included: true },
      { label: "Volume percakapan tanpa batas", included: true },
      { label: "Multi-business & RBAC penuh", included: true },
      { label: "Onboarding & support khusus", included: true },
      { label: "SLA 99,9%", included: true },
      { label: "Integrasi kustom (API)", included: true },
      { label: "Audit log & compliance", included: true },
      { label: "Training tim", included: true },
    ],
    cta: { label: "Hubungi Kami", href: "/" },
  },
];

const faqs = [
  {
    q: "Apakah ada masa percobaan gratis?",
    a: "Ya. Semua paket Starter bisa dicoba gratis tanpa kartu kredit selama 14 hari, termasuk koneksi WhatsApp dan 1 AI Agent.",
  },
  {
    q: "Apakah saya perlu menyiapkan server atau API sendiri?",
    a: "Tidak perlu. Cukup daftar, hubungkan nomor WhatsApp Business ke platform, masukkan knowledge base, dan AI langsung aktif.",
  },
  {
    q: "Bagaimana cara koneksi ke WhatsApp?",
    a: "Anda menghubungkan Business Account WhatsApp Anda via QR atau API. Platform mengelola webhook, pesan masuk & keluar, dan sinkronisasi percakapan.",
  },
  {
    q: "Apakah data pelanggan saya aman?",
    a: "Data dilindungi enkripsi, RBAC, dan mekanisme forbidden data. Ada retensi data dan audit log untuk semua aksi penting.",
  },
];

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-primary py-16 text-white">
          <div className="container-x mx-auto max-w-2xl text-center">
            <Badge tone="accent" className="bg-accent/15 text-accent">
              Harga Sederhana
            </Badge>
            <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">
              Investasi kecil untuk{" "}
              <span className="text-accent">CS yang tidak pernah tidur</span>
            </h1>
            <p className="mt-4 text-lg text-white/70">
              Tidak ada biaya tersembunyi. Tingkatkan paket kapan saja sesuai
              volume percakapan bisnis Anda.
            </p>
          </div>
        </section>

        <section className="bg-cream py-16">
          <div className="container-x">
            <div className="grid gap-6 lg:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={cn(
                    "relative flex flex-col rounded-3xl border bg-white p-7 shadow-sm",
                    plan.featured
                      ? "border-accent ring-4 ring-accent/30"
                      : "border-line",
                  )}
                >
                  {plan.featured ? (
                    <Badge
                      tone="accent"
                      className="absolute -top-3 left-1/2 -translate-x-1/2"
                    >
                      Paling Populer
                    </Badge>
                  ) : null}
                  <h2 className="text-xl font-extrabold text-ink">{plan.name}</h2>
                  <p className="mt-1 text-sm text-muted">{plan.tagline}</p>
                  <div className="mt-5 flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold text-ink">
                      {plan.price}
                    </span>
                    <span className="text-sm text-muted">{plan.monthly}</span>
                  </div>
                  <Button
                    href={plan.cta.href}
                    variant={plan.featured ? "primary" : "dark"}
                    className="mt-6 w-full"
                  >
                    {plan.cta.label}
                  </Button>
                  <ul className="mt-7 flex flex-col gap-3">
                    {plan.features.map((f) => (
                      <li key={f.label} className="flex items-start gap-2.5">
                        {f.included ? (
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        ) : (
                          <Minus className="mt-0.5 h-4 w-4 shrink-0 text-line" />
                        )}
                        <span
                          className={cn(
                            "text-sm",
                            f.included ? "text-muted" : "text-muted/45 line-through",
                          )}
                        >
                          {f.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="container-x">
            <div className="mx-auto max-w-2xl text-center">
              <Badge tone="accent">FAQ</Badge>
              <h2 className="mt-4 text-3xl font-bold">Pertanyaan yang sering diajukan</h2>
            </div>
            <div className="mx-auto mt-10 grid max-w-3xl gap-4">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-2xl border border-line bg-white p-5"
                >
                  <summary className="cursor-pointer list-none text-base font-bold text-ink">
                    {f.q}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary py-16 text-center text-white">
          <div className="container-x">
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              Masih ragu? Coba 14 hari gratis.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/70">
              Tanpa kartu kredit, tanpa komitmen. Rasakan bedanya AI menjawab
              pelanggan Anda malam ini.
            </p>
            <Button href="/register" variant="primary" size="lg" className="mt-6">
              Mulai Gratis
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}