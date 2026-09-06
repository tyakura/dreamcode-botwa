import Link from "next/link";
import { Logo } from "@/components/brand";
import { footerNav } from "@/lib/site";

const year = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="bg-primary text-white">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-4">
          <Logo dark />
          <p className="max-w-xs text-sm leading-relaxed text-white/75">
            Ubah setiap chat WhatsApp menjadi data pelanggan, prospek, dan deal
            yang bisa ditindaklanjuti — otomatis, 24 jam.
          </p>
        </div>

        {Object.entries(footerNav).map(([group, items]) => (
          <div key={group}>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-accent/90">
              {group}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/85 transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="text-xs text-white/70">
            © {year} WhatsApp Business Agent. Semua hak cipta dilindungi.
          </p>
          <p className="text-xs text-white/70">
            24 jam · AI Customer Service · Mini CRM
          </p>
        </div>
      </div>
    </footer>
  );
}