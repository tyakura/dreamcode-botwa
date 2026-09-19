import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",   // halaman langsung render pakai fallback font, bukan nunggu font load
  preload: true,     // Next.js inject <link rel="preload"> di <head> agar font fetch lebih awal
});

export const metadata: Metadata = {
  title: {
    default: "AI WhatsApp Business Agent — CS Otomatis 24 Jam",
    template: "%s · AI WhatsApp Business Agent",
  },
  description:
    "Ubah chat WhatsApp menjadi data pelanggan, prospek, dan deal. Jawab pelanggan 24 jam dengan AI Agent, auto follow-up, dan sinkronisasi HubSpot.",
  keywords: [
    "AI WhatsApp",
    "Customer Service otomatis",
    "Mini CRM",
    "lead management",
    "HubSpot",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${plusJakarta.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}