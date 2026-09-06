import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CalendarClock,
  Database,
  FileSpreadsheet,
  Handshake,
  MessageSquareText,
  Plug,
  ShieldCheck,
  Users,
} from "lucide-react";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Fitur",
  description:
    "Semua fitur WhatsApp Business Agent: AI CS, auto customer data, deal detection, follow-up, data protection, dan integrasi HubSpot.",
};

const featureGroups = [
  {
    id: "ai-agent",
    icon: Bot,
    title: "AI Customer Service",
    desc: "AI Agent yang memahami bisnis Anda dan menjawab pelanggan kapan saja.",
    items: [
      "Jawab FAQ, jelaskan produk & harga otomatis",
      "Gali kebutuhan pelanggan dengan percakapan natural",
      "Ekstraksi data otomatis dari setiap percakapan",
      "Deteksi intent, prospek, dan potensi deal",
      "Human handoff otomatis saat AI tidak yakin",
      "Konfigurasi personaliti, tone, dan jam operasional",
    ],
  },
  {
    id: "customer-data",
    icon: Database,
    title: "Auto Customer Data",
    desc: "Percakapan berubah menjadi data pelanggan terstruktur secara otomatis.",
    items: [
      "Identifikasi nama, WhatsApp, email, dan perusahaan",
      "Catat produk diminati & kebutuhan pelanggan",
      "Pipeline status: NEW → CONTACTED → INTERESTED → QUALIFIED → NEGOTIATION → DEAL",
      "Riwayat perubahan status per pelanggan",
      "Sumber lead & last contact tercatat jelas",
      "Tandai data terpilih untuk prioritas follow-up",
    ],
  },
  {
    id: "deal-follow-up",
    icon: Handshake,
    title: "Deal & Follow Up",
    desc: "Potensi deal terdeteksi, dikonfirmasi manusia, lalu difollow-up otomatis.",
    items: [
      "Deteksi potential deal dari percakapan",
      "Konfirmasi manusia sebelum deal final",
      "Pipeline deal: PENDING → CONFIRMED → PAID → COMPLETED",
      "Follow-up manual oleh tim CS",
      "Follow-up otomatis berdasarkan rule (24 jam, 48 jam, 7 hari)",
      "Channel WhatsApp & Email, lengkap dengan stop condition",
    ],
  },
  {
    id: "export",
    icon: FileSpreadsheet,
    title: "Export Excel",
    desc: "Keluar data kapan pun dengan filter yang fleksibel dan status export.",
    items: [
      "Filter: per status, tanggal, produk, dan sumber",
      "Termasuk data terpilih untuk prioritas",
      "File Excel siap unduh",
      "Status export: PENDING → PROCESSING → DONE / FAILED",
      "Export customer sekaligus data deal",
      "Audit jejak setiap proses export",
    ],
  },
  {
    id: "data-protection",
    icon: ShieldCheck,
    title: "Forbidden Data Protection",
    desc: "Lindungi data sensitif pelanggan dari kesalahan pemrosesan.",
    items: [
      "Atur field, keyword, dan pola data terlarang",
      "Deteksi otomatis NIK, nomor kartu, password",
      "Aksi mask atau block sesuai kebijakan",
      "Log event setiap deteksi data terlarang",
      "Retention policy & hak akses bisa diatur",
      "Kepatuhan privasi untuk audit",
    ],
  },
  {
    id: "integrations",
    icon: Plug,
    title: "Integrasi & WhatsApp",
    desc: "Sinkronisasi ke HubSpot dan koneksi WhatsApp yang mudah.",
    items: [
      "Koneksi WhatsApp Business via API/QR",
      "Webhook masuk & pesan keluar terkelola",
      "Status koneksi dan auto reply bisa dipantau",
      "Integrasi HubSpot via OAuth",
      "Sync customer, deal, follow-up, conversation",
      "Status sync: SYNCED / PENDING / FAILED + field mapping",
    ],
  },
];

const stats = [
  { icon: Users, label: "Tim bisa fokus ke kasus kompleks", value: "50%" },
  { icon: CalendarClock, label: "Follow-up tepat waktu & teratur", value: "3×" },
  { icon: MessageSquareText, label: "Pertanyaan rutin ditangani AI", value: "80%" },
];

export default function FeaturesPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-primary py-16 text-white">
          <div className="container-x mx-auto max-w-3xl text-center">
            <Badge tone="accent" className="bg-accent/15 text-accent">
              Fitur Lengkap
            </Badge>
            <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">
              Satu platform untuk seluruh{" "}
              <span className="text-accent">perjalanan pelanggan</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
              Dari pesan WhatsApp pertama hingga deal terkonfirmasi — semuanya
              terotomasi dan terdata dalam satu dasbor.
            </p>
          </div>
        </section>

        <section className="bg-cream py-16">
          <div className="container-x grid gap-5 sm:grid-cols-3">
            {stats.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-2xl font-extrabold text-ink">{value}</p>
                  <p className="text-xs text-muted">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="container-x flex flex-col gap-16">
            {featureGroups.map(({ id, icon: Icon, title, desc, items }, i) => (
              <div
                key={id}
                id={id}
                className="grid items-start gap-8 lg:grid-cols-2"
              >
                <div className={i % 2 === 1 ? "lg:order-2" : undefined}>
                  <Badge tone="accent">
                    <Icon className="h-3.5 w-3.5" />
                    {title}
                  </Badge>
                  <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl">
                    {title}
                  </h2>
                  <p className="mt-3 text-lg text-muted">{desc}</p>
                  <Button
                    href="/register"
                    variant="dark"
                    size="md"
                    className="mt-6"
                  >
                    Coba Fitur Ini
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <ul
                  className={
                    i % 2 === 1
                      ? "grid gap-3 sm:grid-cols-2 lg:order-1"
                      : "grid gap-3 sm:grid-cols-2"
                  }
                >
                  {items.map((item) => (
                    <li
                      key={item}
                      className="rounded-xl border border-line bg-cream p-4 text-sm font-medium text-ink"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-primary py-16 text-center text-white">
          <div className="container-x">
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              Semua fitur ini bisa dipakai mulai hari ini.
            </h2>
            <Button href="/register" variant="primary" size="lg" className="mt-6">
              Daftar Gratis
            </Button>
            <p className="mt-4 text-sm text-white/75">
              Lihat juga{" "}
              <Link href="/pricing" className="text-accent underline-offset-4 hover:underline">
                halaman harga
              </Link>{" "}
              atau{" "}
              <Link href="/documentation" className="text-accent underline-offset-4 hover:underline">
                dokumentasi
              </Link>{" "}
              untuk detail integrasi & API.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}