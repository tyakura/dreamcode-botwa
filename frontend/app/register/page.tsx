"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MailCheck } from "lucide-react";
import { AuthShell, AuthAlternate } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input, Checkbox } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const steps = ["Buat Akun", "Verifikasi Email", "Workspace Siap"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    business: "",
    email: "",
    whatsapp: "",
    password: "",
    agree: false,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (
      !form.name ||
      !form.business ||
      !form.email ||
      !form.whatsapp ||
      !form.password
    ) {
      setError("Semua kolom wajib diisi.");
      return;
    }
    if (!form.agree) {
      setError("Anda perlu menyetujui syarat & ketentuan untuk melanjutkan.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 800);
  }

  return (
    <AuthShell
      title="Daftar akun baru"
      subtitle="Gratis 14 hari. Tanpa kartu kredit."
      footer={
        <AuthAlternate label="Sudah punya akun? Masuk" href="/login" />
      }
    >
      <ol className="mb-6 flex items-center gap-2">
        {steps.map((label, i) => {
          const n = i + 1;
          const active = n === step;
          const done = n < step;
          return (
            <li
              key={label}
              className="flex flex-1 flex-col items-center gap-1.5"
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  done
                    ? "bg-success text-white"
                    : active
                      ? "bg-accent text-primary"
                      : "bg-cream text-muted",
                )}
              >
                {done ? "✓" : n}
              </span>
              <span
                className={cn(
                  "text-center text-[11px] font-semibold leading-tight",
                  active ? "text-primary" : "text-muted/60",
                )}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>

      {step === 2 ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
            <MailCheck className="h-7 w-7" />
          </span>
          <h2 className="text-lg font-extrabold text-ink">Cek email Anda</h2>
          <p className="text-sm text-muted">
            Kami kirim link verifikasi ke{" "}
            <span className="font-semibold text-ink">{form.email}</span>. Setelah
            verifikasi, workspace bisnis Anda otomatis dibuat dan Anda masuk ke
            dashboard.
          </p>
          <Button
            variant="dark"
            size="md"
            className="mt-2"
            onClick={() => router.push("/dashboard")}
          >
            Lanjut ke Dashboard
          </Button>
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {error ? (
            <p className="rounded-lg border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm font-medium text-danger">
              {error}
            </p>
          ) : null}
          <Input
            name="name"
            label="Nama"
            placeholder="Nama Anda"
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            name="business"
            label="Nama Bisnis"
            placeholder="PT/UMKM Anda"
            autoComplete="organization"
            value={form.business}
            onChange={(e) => setForm({ ...form, business: e.target.value })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              name="email"
              type="email"
              label="Email"
              placeholder="nama@bisnis.com"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              name="whatsapp"
              type="tel"
              label="No. WhatsApp"
              placeholder="+62 812-3456-7890"
              autoComplete="tel"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            />
          </div>
          <Input
            name="password"
            type="password"
            label="Password"
            placeholder="Minimal 8 karakter"
            autoComplete="new-password"
            hint="Gunakan kombinasi huruf dan angka."
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Checkbox
            name="agree"
            label="Saya menyetujui syarat & ketentuan serta kebijakan privasi."
            checked={form.agree}
            onChange={(e) => setForm({ ...form, agree: e.target.checked })}
          />
          <Button type="submit" variant="primary" size="lg" className="mt-1 w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Membuat akun…
              </>
            ) : (
              "Daftar Sekarang"
            )}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}