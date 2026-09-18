"use client";

import { useEffect } from "react";
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

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, hydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [hydrated, user, router]);

  if (!hydrated || !user) return <AuthLoader />;
  return <>{children}</>;
}

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

export function RequireGuest({ children }: { children: React.ReactNode }) {
  const { user, hydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && user) router.replace(homePathFor(user.role));
  }, [hydrated, user, router]);

  if (!hydrated) return <AuthLoader />;
  return <>{children}</>;
}