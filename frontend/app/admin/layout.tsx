import type { Metadata } from "next";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { RequireAdmin } from "@/components/auth/guards";
import { adminNav } from "@/lib/dashboard-nav";
import { adminUser, adminNotifications } from "@/lib/dashboard-data";

export const metadata: Metadata = {
  title: "Admin",
  description: "Panel admin — pengelolaan platform seluruh bisnis, user, AI Agent, dan sistem.",
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAdmin>
      <DashboardLayout
        nav={adminNav}
        brandHref="/admin"
        roleBadge="Admin"
        user={adminUser}
        notifications={adminNotifications}
      >
        {children}
      </DashboardLayout>
    </RequireAdmin>
  );
}