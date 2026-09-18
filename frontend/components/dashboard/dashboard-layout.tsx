"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Bot,
  Building2,
  ChevronDown,
  FileDown,
  Handshake,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Plug,
  Repeat2,
  Search,
  Settings,
  ShieldCheck,
  Smartphone,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/brand";
import { useAuth } from "@/lib/auth-context";
import type { DashboardNavItem } from "@/lib/dashboard-nav";
import type { DashboardNotification } from "@/lib/dashboard-data";

const navIcons: Record<string, LucideIcon> = {
  overview: LayoutDashboard,
  bot: Bot,
  conversations: MessageSquareText,
  customers: Users,
  deals: Handshake,
  "follow-ups": Repeat2,
  forbidden: ShieldCheck,
  integrations: Plug,
  whatsapp: Smartphone,
  export: FileDown,
  settings: Settings,
  users: Users,
  businesses: Building2,
  logs: History,
};

type UserInfo = {
  name: string;
  email: string;
  role: string;
  initials: string;
};

const notificationTone: Record<DashboardNotification["type"], string> = {
  NEW_CUSTOMER: "bg-accent",
  NEW_DEAL: "bg-success",
  EXPORT_DONE: "bg-success",
  FORBIDDEN_DATA: "bg-danger",
  FOLLOW_UP: "bg-warning",
};

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  BUSINESS_OWNER: "Pemilik Bisnis",
  STAFF_CS: "Staff CS",
};

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  const initials = parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
  return initials || "U";
}

function SidebarContent({
  nav,
  brandHref,
  roleBadge,
  user,
  pathname,
  onNavigate,
  onLogout,
}: {
  nav: DashboardNavItem[];
  brandHref: string;
  roleBadge: string;
  user: UserInfo;
  pathname: string;
  onNavigate?: () => void;
  onLogout?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <Link
        href={brandHref}
        onClick={onNavigate}
        className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5"
      >
        <LogoMark />
        <span className="flex flex-col leading-none">
          <span className="text-sm font-bold text-white">WhatsApp Agent</span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-accent">
            {roleBadge}
          </span>
        </span>
      </Link>

      <p className="px-6 pb-2 pt-5 text-[11px] font-bold uppercase tracking-widest text-white/50">
        Menu
      </p>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {nav.map(({ label, href, icon }) => {
          const Icon = navIcons[icon] ?? LayoutDashboard;
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-primary"
                  : "text-white/80 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <span className="truncate">{label}</span>
              {isActive ? (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-extrabold text-primary">
            {user.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">{user.name}</p>
            <p className="truncate text-xs text-white/75">{user.role}</p>
          </div>
          <button
            type="button"
            className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Keluar"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function DashboardLayout({
  nav,
  brandHref,
  roleBadge,
  user,
  notifications,
  children,
}: {
  nav: DashboardNavItem[];
  brandHref: string;
  roleBadge: string;
  user: UserInfo;
  notifications: DashboardNotification[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user: authUser, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(notifications);
  const [search, setSearch] = useState("");
  const notifRef = useRef<HTMLDivElement>(null);

  const displayUser: UserInfo = authUser
    ? {
        name: authUser.name,
        email: authUser.email,
        role: authUser.role ? roleLabels[authUser.role] ?? authUser.role : roleBadge,
        initials: initialsOf(authUser.name),
      }
    : user;

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  const active = nav.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/"),
  );
  const unread = notifs.filter((n) => !n.isRead).length;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <div className="h-full bg-primary text-white shadow-2xl">
          <SidebarContent
            nav={nav}
            brandHref={brandHref}
            roleBadge={roleBadge}
            user={displayUser}
            pathname={pathname}
            onLogout={handleLogout}
          />
        </div>
      </aside>

      {/* Sidebar — mobile */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-primary text-white shadow-2xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
              aria-label="Tutup menu"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent
              nav={nav}
              brandHref={brandHref}
              roleBadge={roleBadge}
              user={displayUser}
              pathname={pathname}
              onNavigate={() => setMobileOpen(false)}
              onLogout={handleLogout}
            />
          </aside>
        </div>
      ) : null}

      {/* Content */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-white/95 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-primary hover:bg-cream lg:hidden"
            aria-label="Buka menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden min-w-0 items-center gap-1.5 text-sm text-muted sm:flex">
            <span className="text-muted/70">Dashboard</span>
            <span className="text-muted/40">/</span>
            <span className="truncate font-bold text-ink">
              {active?.label ?? ""}
            </span>
          </div>
          <div className="truncate text-sm font-bold text-ink sm:hidden">
            {active?.label ?? ""}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <label className="hidden items-center gap-2 rounded-full border border-line bg-cream px-3.5 py-2 md:flex">
              <Search className="h-4 w-4 text-muted/60" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari..."
                className="w-40 bg-transparent text-sm text-ink placeholder:text-muted/60 focus:outline-none"
              />
            </label>

            <div ref={notifRef} className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((v) => !v)}
                className="relative rounded-full border border-line bg-white p-2.5 text-primary transition-colors hover:bg-cream"
                aria-label="Notifikasi"
              >
                <Bell className="h-[18px] w-[18px]" />
                {unread > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                    {unread}
                  </span>
                ) : null}
              </button>
              {notifOpen ? (
                <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-line bg-white shadow-xl sm:w-96">
                  <div className="flex items-center justify-between border-b border-line px-4 py-3">
                    <p className="text-sm font-bold text-ink">Notifikasi</p>
                    <button
                      type="button"
                      onClick={() =>
                        setNotifs((prev) =>
                          prev.map((n) => ({ ...n, isRead: true })),
                        )
                      }
                      className="text-xs font-semibold text-accent-dark hover:underline"
                    >
                      Tandai dibaca
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifs.map((n) => (
                      <div
                        key={n.id}
                        className="flex items-start gap-3 border-b border-line/60 px-4 py-3 last:border-b-0"
                      >
                        <span
                          className={cn(
                            "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                            notificationTone[n.type],
                          )}
                        />
                        <div className="min-w-0">
                          <p className="text-sm leading-snug text-muted">
                            {n.message}
                          </p>
                          <p className="mt-0.5 text-xs text-muted/60">
                            {n.time}
                          </p>
                        </div>
                        {!n.isRead ? (
                          <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-accent" />
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="hidden items-center gap-2.5 sm:flex">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-accent">
                {displayUser.initials}
              </span>
              <div className="hidden text-left md:block">
                <p className="text-sm font-bold leading-tight text-ink">
                  {displayUser.name}
                </p>
                <p className="text-xs leading-tight text-muted/70">
                  {displayUser.role}
                </p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-muted/60 md:block" />
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}