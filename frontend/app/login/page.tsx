"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthShell, AuthAlternate } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input, Checkbox } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Email dan password wajib diisi.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 800);
  }

  return (
    <AuthShell
      title="Masuk ke akun Anda"
      subtitle="Lanjutkan mengelola bisnis dan AI Agent Anda."
      footer={<AuthAlternate label="Belum punya akun? Daftar" href="/register" />}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {error ? (
          <p className="rounded-lg border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm font-medium text-danger">
            {error}
          </p>
        ) : null}
        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="nama@bisnis.com"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <div className="relative">
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="button"
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            className="absolute right-3.5 top-[38px] text-muted/80 hover:text-ink"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <Checkbox label="Ingat saya" name="remember" />
          <a
            href="/login"
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Lupa password?
          </a>
        </div>
        <Button type="submit" variant="primary" size="lg" className="mt-1 w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Memproses…
            </>
          ) : (
            "Masuk"
          )}
        </Button>
      </form>
    </AuthShell>
  );
}