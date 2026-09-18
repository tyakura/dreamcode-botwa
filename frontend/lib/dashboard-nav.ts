export type DashboardNavItem = {
  label: string;
  href: string;
  icon: string;
};

export const userNav: DashboardNavItem[] = [
  { label: "Overview", href: "/dashboard/user", icon: "overview" },
  { label: "AI Agent", href: "/dashboard/user/ai-agent", icon: "bot" },
  {
    label: "Customer Service",
    href: "/dashboard/user/conversations",
    icon: "conversations",
  },
  {
    label: "Customer Data",
    href: "/dashboard/user/customers",
    icon: "customers",
  },
  { label: "Deal Data", href: "/dashboard/user/deals", icon: "deals" },
  { label: "Follow Up", href: "/dashboard/user/follow-ups", icon: "follow-ups" },
  {
    label: "Forbidden Data",
    href: "/dashboard/user/forbidden-data",
    icon: "forbidden",
  },
  { label: "Integrations", href: "/dashboard/user/integrations", icon: "integrations" },
  { label: "WhatsApp", href: "/dashboard/user/whatsapp", icon: "whatsapp" },
  { label: "Export", href: "/dashboard/user/export", icon: "export" },
  { label: "Settings", href: "/dashboard/user/settings", icon: "settings" },
];

export const adminNav: DashboardNavItem[] = [
  { label: "Overview", href: "/admin", icon: "overview" },
  { label: "Users", href: "/admin/users", icon: "users" },
  { label: "Businesses", href: "/admin/businesses", icon: "businesses" },
  { label: "AI Agents", href: "/admin/ai-agents", icon: "bot" },
  { label: "Customer Data", href: "/admin/customers", icon: "customers" },
  { label: "Deals", href: "/admin/deals", icon: "deals" },
  { label: "Follow Ups", href: "/admin/follow-ups", icon: "follow-ups" },
  { label: "Forbidden Data", href: "/admin/forbidden-data", icon: "forbidden" },
  { label: "Integrations", href: "/admin/integrations", icon: "integrations" },
  { label: "System Logs", href: "/admin/system-logs", icon: "logs" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];