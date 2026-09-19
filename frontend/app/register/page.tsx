"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AuthShell, AuthAlternate } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input, Checkbox } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { homePathFor, RequireGuest } from "@/components/auth/guards";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.business || !form.email || !form.password) {
      setError("Semua kolom wajib diisi (kecuali WhatsApp).");
      return;
    }
    if (form.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }
    if (!form.agree) {
      setError("Anda perlu menyetujui syarat & ketentuan untuk melanjutkan.");
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        businessName: form.business,
      });
      // Langsung redirect — BUSINESS_OWNER → /dashboard/user, ADMIN/SUPER_ADMIN → /admin
      // Pakai replace agar halaman register tidak bisa diakses kembali via tombol Back
      router.replace(homePathFor(res.user.role));
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || "Gagal membuat akun. Silakan coba lagi.");
      setLoading(false);
    }
  }

  return (
    <RequireGuest>
      <AuthShell
        title="Daftar akun baru"
        subtitle="Gratis 14 hari. Tanpa kartu kredit."
        footer={
          <AuthAlternate label="Sudah punya akun? Masuk" href="/login" />
        }
      >
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
            placeholder="Minimal 6 karakter"
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
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="mt-1 w-full"
            disabled={loading}
          >
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
      </AuthShell>
    </RequireGuest>
  );
}
