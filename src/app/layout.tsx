import type { Metadata } from "next";
import "./globals.css";
import { NO_FLASH_SCRIPT } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Ryu Keiri（竜之介 経理）",
  description: "中小〜中堅企業向け 経理業務SaaS — UI基盤",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* テーマのちらつき防止：localStorage / OS 設定を読んで dark クラスを即時付与。 */}
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
