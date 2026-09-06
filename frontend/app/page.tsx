import type { Metadata } from "next";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Database,
  Handshake,
  MessageSquareText,
  Repeat2,
  Rocket,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Ubah chat WhatsApp jadi peluang bisnis",
  description:
    "AI Agent menjawab pelanggan 24 jam, mengubah percakapan jadi data, prospek, dan deal.",
};

const problems = [
  {
    title: "CS tidak online 24 jam",
    desc: "Pelanggan menghubungi malam hari dan libur, belum ada yang membalas.",
  },
  {
    title: "Chat pelanggan tidak terdata",
    desc: "Percakapan penting hilang begitu saja tanpa jejak data pelanggan.",
  },
  {
    title: "Calon pelanggan lupa di-follow-up",
    desc: "Prospek hangat dingin karena dihubungi terlambat atau tidak sama sekali.",
  },
  {
    title: "Data dicatat manual",
    desc: "Nama, kebutuhan, dan minat pelanggan diketik ulang dengan tangan.",
  },
  {
    title: "Data deal dipindah manual",
    desc: "Dari chatbot ke Excel, lalu ke CRM — banyak kopi-paste membuang waktu.",
  },
  {
    title: "CS lelah menjawab pertanyaan berulang",
    desc: "Pertanyaan FAQ yang sama dijawab ratusan kali setiap minggunya.",
  },
];

const pillars = [
  {
    icon: Bot,
    title: "AI Customer Service",
    desc: "AI menjawab FAQ, menjelaskan produk & harga, dan menggali kebutuhan pelanggan otomatis. Eskalasi hanya saat benar-benar perlu.",
  },
  {
    icon: Database,
    title: "Auto Customer Data",
    desc: "Setiap percakapan diubah menjadi data pelanggan terstruktur: nama, WhatsApp, produk diminati, dan kebutuhan.",
  },
  {
    icon: Handshake,
    title: "Deal Detection",
    desc: "Deteksi potensi deal dari percakapan otomatis. Dikonfirmasi manusia sebelum menjadi deal final.",
  },
  {
    icon: Repeat2,
    title: "Auto Follow Up",
    desc: "Follow-up terjadwal via WhatsApp & Email berdasarkan rule: jeda waktu, jam kirim, dan kondisi berhenti otomatis.",
  },
  {
    icon: ShieldCheck,
    title: "Data Protection",
    desc: "Mekanisme forbidden data: deteksi NIK, nomor kartu, dan data sensitif dengan action mask atau block.",
  },
  {
    icon: Zap,
    title: "HubSpot Integration",
    desc: "Sinkronisasi customer, deal, dan follow-up ke HubSpot secara otomatis atau manual dengan status sync.",
  },
];

const flow = [
  { icon: MessageSquareText, step: "01", title: "Customer Chat", desc: "Pelanggan mengirim pesan WhatsApp kapan saja." },
  { icon: Bot, step: "02", title: "AI Agent Merespon", desc: "AI menjawab dari knowledge base bisnis Anda, 24 jam." },
  { icon: Database, step: "03", title: "Data Terbentuk", desc: "Info pelanggan diekstrak & status prospek diperbarui." },
  { icon: Handshake, step: "04", title: "Follow Up → Deal", desc: "Follow-up otomatis berjalan sampai deal terkonfirmasi." },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden bg-primary text-white">
          <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
          <div className="container-x relative grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
            <div className="flex flex-col items-start gap-6">
              <Badge tone="accent" className="bg-accent/15 text-accent">
                <Sparkles className="h-3.5 w-3.5" />
                AI-powered WhatsApp CS
              </Badge>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-[3.4rem]">
                Setiap chat pelanggan jadi{" "}
                <span className="text-accent">peluang bisnis</span>, bukan cuma
                percakapan.
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-white/75">
                AI Agent menjawab pelanggan 24 jam, mengubah percakapan WhatsApp
                menjadi data pelanggan terstruktur — dipantau dari pipeline
                prospek hingga deal, difollow-up otomatis, dan siap
                disinkronkan ke HubSpot.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button href="/register" variant="primary" size="lg">
                  Coba Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  href="/features"
                  variant="outline"
                  size="lg"
                  className="border-white/25 text-white hover:border-white hover:bg-white/10 hover:text-white"
                >
                  Lihat Demo
                </Button>
              </div>
              <dl className="mt-4 grid w-full max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-6 text-white">
                {[
                  ["24/7", "Selalu menjawab"],
                  ["6×", "Lebih cepat follow-up"],
                  ["100%", "Chat terdata"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt className="order-2 mt-1 block text-xs text-white/75">
                      {label}
                    </dt>
                    <dd className="text-2xl font-extrabold text-accent">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Chat mock */}
            <div className="relative mx-auto w-full max-w-md">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="mb-3 flex items-center gap-3 border-b border-white/10 pb-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent">
                    <Bot className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">AI Agent Bisnis</p>
                    <p className="flex items-center gap-1.5 text-xs text-accent">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      Online — membalas otomatis
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 text-sm">
                  <div className="max-w-[85%] self-start rounded-2xl rounded-bl-sm bg-white/10 px-4 py-2.5 text-white/85">
                    Halo, saya mau tanya soal paket produk Anda
                  </div>
                  <div className="max-w-[90%] self-end rounded-2xl rounded-br-sm bg-accent px-4 py-2.5 text-primary">
                    Hai! Tentu. Boleh tahu kebutuhan Anda seperti apa? Saya bisa
                    bantu pilihkan paket yang paling sesuai. 😊
                  </div>
                  <div className="max-w-[85%] self-start rounded-2xl rounded-bl-sm bg-white/10 px-4 py-2.5 text-white/85">
                    Saya cari untuk bisnis laundry kecil, kira-kira ada paket
                    mulai dari mana ya?
                  </div>
                  <div className="max-w-[70%] self-end rounded-2xl rounded-br-sm bg-accent px-4 py-2.5 text-primary">
                    Kami punya paket Starter mulai Rp150rb/bulan. Mau saya
                    kirimkan pricelist lengkapnya?
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs text-white/75">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                  AI mengekstrak data: nama, kebutuhan, produk diminati →
                  status prospek diperbarui
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section className="bg-cream py-20">
          <div className="container-x">
            <div className="mx-auto max-w-2xl text-center">
              <Badge tone="danger">Masalah</Badge>
              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                Chat masuk, tapi omzet tidak ikut naik?
              </h2>
              <p className="mt-4 text-lg text-muted">
                WhatsApp adalah kanal penjualan terbesar bisnis Anda — tetapi
                tanpa data, peluang menumpuk begitu saja.
              </p>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {problems.map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl border border-line bg-white p-6 shadow-sm"
                >
                  <h3 className="text-base font-bold text-ink">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SOLUTION */}
        <section className="bg-white py-20" id="solusi">
          <div className="container-x">
            <div className="mx-auto max-w-2xl text-center">
              <Badge tone="accent">Solusi</Badge>
              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                6 pilar untuk mengubah chat jadi mesin penjualan
              </h2>
              <p className="mt-4 text-lg text-muted">
                Satu platform: jawab otomatis, data lengkap, follow-up presisi,
                dan integrasi yang fleksibel.
              </p>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pillars.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="group rounded-2xl border border-line bg-white p-6 transition-all hover:-translate-y-1 hover:border-accent/60 hover:shadow-lg"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-accent transition-colors group-hover:bg-accent group-hover:text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FLOW */}
        <section className="bg-primary py-20 text-white">
          <div className="container-x">
            <div className="mx-auto max-w-2xl text-center">
              <Badge tone="accent" className="bg-accent/15 text-accent">
                Cara Kerja
              </Badge>
              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                Dari chat mentah menuju deal dalam 4 langkah
              </h2>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {flow.map(({ icon: Icon, step, title, desc }) => (
                <div
                  key={step}
                  className="relative rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-accent">
                    Langkah {step}
                  </span>
                  <Icon className="mt-3 h-7 w-7 text-accent" />
                  <h3 className="mt-3 text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm text-white/80">{desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <Button href="/register" variant="primary" size="lg">
                Mulai Sekarang — Gratis
                <Rocket className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-cream py-20">
          <div className="container-x">
            <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-white sm:px-12">
              <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
              <div className="relative mx-auto max-w-2xl">
                <h2 className="text-3xl font-extrabold sm:text-4xl">
                  Siap mengubah chat jadi{" "}
                  <span className="text-accent">pendapatan</span>?
                </h2>
                <p className="mt-4 text-lg text-white/80">
                  Daftar dalam 2 menit, hubungkan WhatsApp, dan biarkan AI mulai
                  bekerja untuk bisnis Anda.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button href="/register" variant="primary" size="lg">
                    Coba Sekarang — Gratis
                  </Button>
                  <Button
                    href="/pricing"
                    variant="outline"
                    size="lg"
                    className="border-white/25 text-white hover:border-white hover:bg-white/10 hover:text-white"
                  >
                    Lihat Harga
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}