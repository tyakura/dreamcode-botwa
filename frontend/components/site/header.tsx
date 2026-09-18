"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogIn, Menu, UserPlus, X } from "lucide-react";
import { Logo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { mainNav } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { homePathFor, isAdminRole } from "@/components/auth/guards";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const homePath = user ? homePathFor(user.role) : "/login";
  const roleLabel = user
    ? isAdminRole(user.role)
      ? "Admin"
      : "Dashboard"
    : "Masuk";

  useEffect(() => {
    router.prefetch("/login");
    router.prefetch("/register");
  }, [router]);

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-primary">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo dark />

        <nav className="hidden items-center gap-1 md:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          {user ? (
            <>
              <Button
                href={homePath}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 hover:text-white"
              >
                <LayoutDashboard className="h-4 w-4" />
                {roleLabel}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleLogout}
              >
                Keluar
              </Button>
            </>
          ) : (
            <>
              <Button
                href="/login"
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 hover:text-white"
              >
                <LogIn className="h-4 w-4" />
                Masuk
              </Button>
              <Button href="/register" variant="primary" size="sm">
                <UserPlus className="h-4 w-4" />
                Coba Sekarang
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-white/10 transition-all duration-200 md:hidden",
          open ? "max-h-80" : "max-h-0 border-t-0",
        )}
      >
        <nav className="container-x flex flex-col gap-1 py-4">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-white hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-4">
            {user ? (
              <>
                <Button
                  href={homePath}
                  variant="outline"
                  size="sm"
                  className="border-white/25 text-white hover:border-white hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {roleLabel}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                >
                  Keluar
                </Button>
              </>
            ) : (
              <>
                <Button
                  href="/login"
                  variant="outline"
                  size="sm"
                  className="border-white/25 text-white hover:border-white hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  <LogIn className="h-4 w-4" />
                  Masuk
                </Button>
                <Button
                  href="/register"
                  variant="primary"
                  size="sm"
                  onClick={() => setOpen(false)}
                >
                  <UserPlus className="h-4 w-4" />
                  Coba Sekarang
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}