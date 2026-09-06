import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand";

export function AuthShell({
  children,
  title,
  subtitle,
  footer,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
  footer: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-3xl border border-line bg-white p-7 shadow-sm sm:p-9">
          <h1 className="text-2xl font-extrabold text-ink">{title}</h1>
          <p className="mt-1.5 text-sm text-muted">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
        <div className="mt-5 text-center text-sm text-muted">{footer}</div>
      </div>
    </div>
  );
}

export function AuthAlternate({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  return (
    <span className="text-sm">
      {label}{" "}
      <Link
        href={href}
        className="font-bold text-primary underline-offset-4 hover:underline"
      >
        di sini
      </Link>
    </span>
  );
}