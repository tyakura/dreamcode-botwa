import { Search, ShieldCheck, UserX, Users } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardHeader } from "@/components/dashboard/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Table, TBody, Td, THead, Th, Tr } from "@/components/dashboard/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminUsers, userRoleCount } from "@/lib/dashboard-data";

export default function AdminUsersPage() {
  return (
    <>
      <PageHeader
        title="User Management"
        description="Kelola seluruh pengguna platform: suspend, aktifkan, dan pantau penggunaan AI."
        actions={
          <Button variant="primary" size="md">
            Tambah User
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total User" value={userRoleCount.total.toString()} icon={Users} sub="Semua role" />
        <StatCard label="Aktif" value={userRoleCount.active.toString()} icon={ShieldCheck} sub="98% dari total" up />
        <StatCard label="Suspended" value={userRoleCount.suspended.toString()} icon={UserX} sub="Perlu review" />
        <StatCard label="Inactive" value={userRoleCount.inactive.toString()} icon={Users} sub="Tidak aktif" />
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Daftar User"
          subtitle="6 user terdaftar sebagai contoh"
          action={
            <label className="flex items-center gap-2 rounded-full border border-line bg-cream px-3.5 py-2 text-sm">
              <Search className="h-4 w-4 text-muted/60" />
              <input placeholder="Cari user..." className="w-40 bg-transparent text-ink placeholder:text-muted/60 focus:outline-none" />
            </label>
          }
        />
        <Table>
          <THead>
            <Th>User</Th>
            <Th>Role</Th>
            <Th>Status</Th>
            <Th>Bisnis Aktif</Th>
            <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wide text-ink">
              Penggunaan AI
            </th>
            <Th>Bergabung</Th>
            <Th className="text-right">Aksi</Th>
          </THead>
          <TBody>
            {adminUsers.map((u) => (
              <Tr key={u.id}>
                <Td>
                  <p className="font-bold text-ink">{u.name}</p>
                  <p className="text-xs text-muted">{u.email}</p>
                </Td>
                <Td>
                  <Badge tone={u.role === "SUPER_ADMIN" ? "dark" : u.role === "ADMIN" ? "accent" : u.role === "BUSINESS_OWNER" ? "neutral" : "neutral"}>
                    {u.role.replace("_", " ")}
                  </Badge>
                </Td>
                <Td>
                  <StatusBadge status={u.status} />
                </Td>
                <Td className="text-muted">{u.activeBusinesses}</Td>
                <td className="px-5 py-3.5 text-right text-sm text-muted">{u.aiUsage}</td>
                <Td className="whitespace-nowrap text-muted">{u.joinedAt}</Td>
                <td className="px-5 py-3.5 text-right">
                  {u.role !== "SUPER_ADMIN" ? (
                    <Button variant="ghost" size="sm" className="text-danger hover:bg-danger/10">
                      {u.status === "SUSPENDED" ? "Aktifkan" : "Suspend"}
                    </Button>
                  ) : (
                    <span className="text-xs text-muted/50">—</span>
                  )}
                </td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </Card>
    </>
  );
}