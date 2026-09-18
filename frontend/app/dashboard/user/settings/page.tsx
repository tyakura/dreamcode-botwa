import { Bell, Save, Settings2, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardBody, CardHeader } from "@/components/dashboard/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/input";
import { userSettings } from "@/lib/dashboard-data";

const notifLabels: Record<string, string> = {
  newCustomer: "Customer baru masuk",
  highIntent: "Customer dengan high intent",
  potentialDeal: "Potential deal terdeteksi",
  dealConfirmed: "Deal terkonfirmasi",
  aiNeedsHelp: "AI membutuhkan bantuan manusia",
  followUpFailed: "Follow-up gagal terkirim",
  whatsappDisconnected: "WhatsApp terputus",
  hubspotSyncFailed: "Sinkronisasi HubSpot gagal",
};

export default function UserSettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Pengaturan profil bisnis, notifikasi, dan preferensi umum."
        actions={
          <Button variant="primary" size="md">
            <Save className="h-4 w-4" />
            Simpan Perubahan
          </Button>
        }
      />

      <div className="grid gap-5 xl:grid-cols-2">
        {/* Profil bisnis */}
        <Card>
          <CardHeader title="Profil Bisnis" subtitle="Informasi dasar bisnis Anda" />
          <CardBody className="space-y-4">
            {[
              { label: "Nama bisnis", value: userSettings.business.name },
              { label: "Email bisnis", value: userSettings.business.email },
              { label: "Telepon", value: userSettings.business.phone },
            ].map((f) => (
              <label key={f.label} className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-ink">{f.label}</span>
                <input
                  defaultValue={f.value}
                  className="h-11 w-full rounded-lg border border-line bg-white px-3.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-accent/60"
                />
              </label>
            ))}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-ink">Deskripsi</span>
              <textarea
                defaultValue={userSettings.business.description}
                rows={3}
                className="w-full rounded-lg border border-line bg-white px-3.5 py-3 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-accent/60"
              />
            </label>
          </CardBody>
        </Card>

        {/* Notifikasi */}
        <Card>
          <CardHeader
            title="Preferensi Notifikasi"
            subtitle="Notifikasi dashboard"
            action={<Bell className="h-5 w-5 text-muted" />}
          />
          <CardBody className="space-y-3">
            {Object.entries(userSettings.notify).map(([key, val]) => (
              <div
                key={key}
                className="flex items-center justify-between gap-3 border-b border-line/70 pb-3 last:border-b-0 last:pb-0"
              >
                <span className="text-sm text-muted">
                  {notifLabels[key] ?? key}
                </span>
                <Checkbox
                  name={key}
                  defaultChecked={val}
                  className="ml-auto"
                />
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Zona bahaya */}
      <Card className="mt-6 border-danger/30">
        <CardHeader
          title="Zona Bahaya"
          subtitle="Aksi yang tidak dapat dibatalkan"
          action={
            <span className="flex items-center gap-1.5 rounded-md bg-danger/10 px-2.5 py-1 text-xs font-semibold text-danger">
              <ShieldAlert className="h-3.5 w-3.5" />
              Hati-hati
            </span>
          }
        />
        <CardBody className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-ink">Hapus Bisnis</p>
            <p className="mt-0.5 max-w-md text-xs text-muted">
              Seluruh data, percakapan, customer, deal, dan knowledge base akan
              dihapus secara permanen.
            </p>
          </div>
          <Button variant="ghost" size="md" className="border border-danger/40 text-danger hover:bg-danger/10">
            <Settings2 className="h-4 w-4" />
            Hapus Bisnis
          </Button>
        </CardBody>
      </Card>
    </>
  );
}