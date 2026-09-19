"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, RefreshCw, Search, ShieldCheck, UserX, Users } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardHeader } from "@/components/dashboard/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Table, TBody, Td, THead, Th, Tr } from "@/components/dashboard/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usersApi, type AdminUser } from "@/lib/api";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function roleTone(name: string): "dark" | "accent" | "neutral" {
  if (name === "SUPER_ADMIN") return "dark";
  if (name === "ADMIN") return "accent";
  return "neutral";
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

const POLL_MS = 10_000; // polling tiap 10 detik agar user baru muncul otomatis

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [toggling, setToggling] = useState<number | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchUsers = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const data = await usersApi.list();
      setUsers(data);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || "Gagal memuat data user.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Initial load + polling
  useEffect(() => {
    fetchUsers();
    pollRef.current = setInterval(() => fetchUsers(true), POLL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchUsers]);

  async function handleToggleStatus(user: AdminUser) {
    setToggling(user.id);
    const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      const updated = await usersApi.update(user.id, { status: newStatus });
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (err: unknown) {
      const e = err as { message?: string };
      alert(e.message || "Gagal mengubah status user.");
    } finally {
      setToggling(null);
    }
  }

  // ─── Derived stats ────────────────────────────────────────────────────────────

  const total = users.length;
  const active = users.filter((u) => u.status === "ACTIVE").length;
  const suspended = users.filter((u) => u.status === "SUSPENDED").length;
  const inactive = users.filter((u) => u.status === "INACTIVE").length;

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.name.toLowerCase().includes(search.toLowerCase()),
  );

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      <PageHeader
        title="User Management"
        description="Kelola seluruh pengguna platform: suspend, aktifkan, dan pantau penggunaan AI."
        actions={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchUsers()}
            disabled={loading}
            aria-label="Refresh data user"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total User" value={total.toString()} icon={Users} sub="Semua role" />
        <StatCard
          label="Aktif"
          value={active.toString()}
          icon={ShieldCheck}
          sub={total > 0 ? `${Math.round((active / total) * 100)}% dari total` : "—"}
          up
        />
        <StatCard label="Suspended" value={suspended.toString()} icon={UserX} sub="Perlu review" />
        <StatCard label="Inactive" value={inactive.toString()} icon={Users} sub="Tidak aktif" />
      </div>

      {/* Error state */}
      {error ? (
        <div className="mt-6 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
          {error}{" "}
          <button
            onClick={() => fetchUsers()}
            className="underline underline-offset-2 hover:no-underline"
          >
            Coba lagi
          </button>
        </div>
      ) : null}

      {/* Table */}
      <Card className="mt-6">
        <CardHeader
          title="Daftar User"
          subtitle={
            loading
              ? "Memuat…"
              : `${filtered.length} user${search ? " ditemukan" : " terdaftar"}`
          }
          action={
            <label className="flex items-center gap-2 rounded-full border border-line bg-cream px-3.5 py-2 text-sm">
              <Search className="h-4 w-4 text-muted/60" />
              <input
                placeholder="Cari user..."
                className="w-40 bg-transparent text-ink placeholder:text-muted/60 focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          }
        />

        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Memuat data user…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted">
            {search ? `Tidak ada user dengan kata kunci "${search}".` : "Belum ada user terdaftar."}
          </div>
        ) : (
          <Table>
            <THead>
              <Th>User</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Bergabung</Th>
              <Th className="text-right">Aksi</Th>
            </THead>
            <TBody>
              {filtered.map((u) => (
                <Tr key={u.id}>
                  <Td>
                    <p className="font-bold text-ink">{u.name}</p>
                    <p className="text-xs text-muted">{u.email}</p>
                  </Td>
                  <Td>
                    <Badge tone={roleTone(u.role.name)}>
                      {u.role.name.replace(/_/g, " ")}
                    </Badge>
                  </Td>
                  <Td>
                    <StatusBadge status={u.status} />
                  </Td>
                  <Td className="whitespace-nowrap text-muted">
                    {formatDate(u.createdAt)}
                  </Td>
                  <td className="px-5 py-3.5 text-right">
                    {u.role.name !== "SUPER_ADMIN" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={
                          u.status === "SUSPENDED"
                            ? "text-success hover:bg-success/10"
                            : "text-danger hover:bg-danger/10"
                        }
                        disabled={toggling === u.id}
                        onClick={() => handleToggleStatus(u)}
                      >
                        {toggling === u.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : u.status === "SUSPENDED" ? (
                          "Aktifkan"
                        ) : (
                          "Suspend"
                        )}
                      </Button>
                    ) : (
                      <span className="text-xs text-muted/50">—</span>
                    )}
                  </td>
                </Tr>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
    </>
  );
}
