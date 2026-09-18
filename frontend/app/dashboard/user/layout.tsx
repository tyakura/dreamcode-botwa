import type { Metadata } from "next";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { RequireAuth } from "@/components/auth/guards";
import { userNav } from "@/lib/dashboard-nav";
import { dashboardUser, userNotifications } from "@/lib/dashboard-data";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Pusat kontrol bisnis — AI Agent, customer, deal, follow-up, dan integrasi.",
};

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <DashboardLayout
        nav={userNav}
        brandHref="/dashboard/user"
        roleBadge="User"
        user={dashboardUser}
        notifications={userNotifications}
      >
        {children}
      </DashboardLayout>
    </RequireAuth>
  );
}