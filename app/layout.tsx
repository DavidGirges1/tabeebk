import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/footer";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "دليل الرعاية الطبية بالمحافظات 2026 | أ/ تامر صبحي عبدالله",
    template: "%s | دليل الرعاية الطبية 2026",
  },
  description:
    "الموقع الرسمي لشبكة التعاقدات الطبية لصندوق علاج العاملين بمصلحتي الجمارك والضرائب، إشراف وإهداء الأستاذ تامر صبحي عبدالله، عضو مجلس الإدارة عن القاهرة والوجه القبلي.",
  keywords: [
    "تامر صبحي عبدالله",
    "صندوق علاج العاملين",
    "الجمارك",
    "الضرائب",
    "دليل طبي",
    "مستشفيات",
    "أطباء",
    "معامل تحاليل",
    "مراكز أشعة",
    "لائحة العلاج 2026",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} font-sans`}>
      <body className="min-h-screen bg-background font-sans antialiased selection:bg-primary/20 flex flex-col justify-between">
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
