import { Save, Settings2, ShieldCheck, Zap } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardBody, CardHeader } from "@/components/dashboard/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/input";
import { platformSettings, userRoleCount } from "@/lib/dashboard-data";
import { Badge } from "@/components/ui/badge";

export default function AdminSettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Pengaturan global platform: mode operasional, keamanan, role, dan pemeliharaan."
        actions={
          <Button variant="primary" size="md">
            <Save className="h-4 w-4" />
            Simpan Perubahan
          </Button>
        }
      />

      <div className="grid gap-5 xl:grid-cols-2">
        {/* General */}
        <Card>
          <CardHeader title="Pengaturan Umum" subtitle="Konfigurasi dasar platform" />
          <CardBody className="space-y-4">
            {[
              { label: "Nama platform", value: platformSettings.name },
              { label: "Environment", value: platformSettings.environment },
              { label: "Timezone default", value: platformSettings.defaultTimezone },
            ].map((f) => (
              <label key={f.label} className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-ink">{f.label}</span>
                <input
                  defaultValue={f.value}
                  className="h-11 w-full rounded-lg border border-line bg-white px-3.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-accent/60"
                />
              </label>
            ))}
          </CardBody>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader title="Keamanan" subtitle="Aturan keamanan autentikasi & akses" action={<ShieldCheck className="h-5 w-5 text-success" />} />
          <CardBody className="space-y-4">
            {[
              { label: "JWT expiry", value: platformSettings.jwtExpiry },
              { label: "Rate limit", value: platformSettings.rateLimit },
              { label: "Mode pendaftaran", value: platformSettings.signupMode },
            ].map((f) => (
              <label key={f.label} className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-ink">{f.label}</span>
                <input
                  defaultValue={f.value}
                  className="h-11 w-full rounded-lg border border-line bg-white px-3.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-accent/60"
                />
              </label>
            ))}
          </CardBody>
        </Card>

        {/* Roles */}
        <Card>
          <CardHeader title="Role & Akses" subtitle="Role yang tersedia di platform" action={<Badge tone="accent">{userRoleCount.total} user terdaftar</Badge>} />
          <CardBody className="space-y-3">
            {[
              { name: "SUPER_ADMIN", desc: "Akses penuh ke seluruh sistem", count: 1 },
              { name: "ADMIN", desc: "Kelola user & business sesuai permission", count: 1 },
              { name: "BUSINESS_OWNER", desc: "Kelola bisnis & AI Agent miliknya", count: 3 },
              { name: "STAFF_CS", desc: "Kelola customer, conversation, deal, follow-up", count: 1 },
            ].map((r) => (
              <div key={r.name} className="flex items-center justify-between gap-3 border-b border-line/70 pb-3 last:border-b-0 last:pb-0">
                <div>
                  <p className="text-sm font-bold text-ink">{r.name.replace("_", " ")}</p>
                  <p className="text-xs text-muted">{r.desc}</p>
                </div>
                <Badge tone="neutral">{r.count} user</Badge>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Maintenance */}
        <Card>
          <CardHeader title="Pemeliharaan" subtitle="Mode pemeliharaan dan aksi sistem" />
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-line/70 pb-3">
              <div>
                <p className="text-sm font-bold text-ink">Mode Maintenance</p>
                <p className="text-xs text-muted">Ketika aktif, hanya Super Admin yang bisa mengakses platform.</p>
              </div>
              <Checkbox name="maintenance" defaultChecked={platformSettings.maintenanceMode} />
            </div>
            <Button variant="outline" size="md" className="w-full">
              <Zap className="h-4 w-4" />
              Bersihkan Cache & Restart Queue
            </Button>
            <Button variant="outline" size="md" className="w-full">
              <Settings2 className="h-4 w-4" />
              Lihat Konfigurasi .env
            </Button>
          </CardBody>
        </Card>
      </div>
    </>
  );
}