"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN"];

export function isAdminRole(role?: string): boolean {
  return !!role && ADMIN_ROLES.includes(role);
}

export function homePathFor(role?: string): string {
  return isAdminRole(role) ? "/admin" : "/dashboard/user";
}

function AuthLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <div className="flex flex-col items-center gap-3">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="text-sm font-semibold text-muted">Memuat…</p>
      </div>
    </div>
  );
}

// ─── RequireAuth ──────────────────────────────────────────────────────────────
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, hydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [hydrated, user, router]);

  if (!hydrated || !user) return <AuthLoader />;
  return <>{children}</>;
}

// ─── RequireAdmin ─────────────────────────────────────────────────────────────
export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, hydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (!user) router.replace("/login");
    else if (!isAdminRole(user.role)) router.replace("/dashboard/user");
  }, [hydrated, user, router]);

  if (!hydrated || !user || !isAdminRole(user.role)) return <AuthLoader />;
  return <>{children}</>;
}

// ─── RequireGuest ─────────────────────────────────────────────────────────────
// Untuk halaman login/register.
// Logika: kalau user sudah login saat halaman pertama kali dibuka → redirect.
// Kalau tidak, tampilkan form langsung. TIDAK pernah mem-block form setelah
// login/register berhasil — biar page component sendiri yang navigate.
export function RequireGuest({ children }: { children: React.ReactNode }) {
  const { user, hydrated } = useAuth();
  const router = useRouter();

  // Snapshot state login saat pertama kali render di client.
  // useState dengan lazy init: hanya dipanggil sekali.
  const [initiallyLoggedIn] = useState(() => {
    // Saat SSR ini selalu false (tidak ada window)
    if (typeof window === "undefined") return false;
    // Di client: cek apakah user sudah login SEBELUM halaman ini dibuka
    // (baca langsung dari localStorage, bukan dari context yang bisa berubah)
    try {
      return !!localStorage.getItem("user");
    } catch {
      return false;
    }
  });

  useEffect(() => {
    // Hanya redirect kalau memang sudah login dari awal
    if (hydrated && user && initiallyLoggedIn) {
      router.replace(homePathFor(user.role));
    }
  }, [hydrated, user, router, initiallyLoggedIn]);

  // Tampilkan loader hanya kalau sudah login sejak awal (sedang menunggu redirect)
  if (initiallyLoggedIn && hydrated && user) return <AuthLoader />;

  // Dalam semua kondisi lain: tampilkan form langsung
  return <>{children}</>;
}
