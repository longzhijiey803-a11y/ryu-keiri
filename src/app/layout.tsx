import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
