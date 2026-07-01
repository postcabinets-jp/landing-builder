import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "landing-builder — ノーコードビジュアルサイトビルダー",
  description: "Webflowのオープンソース代替。ビジュアルエディタ・CMS制限なし・セルフホスト対応。",
  openGraph: {
    title: "landing-builder",
    description: "ノーコードで作る。制限なしで運用する。Webflow代替OSSサイトビルダー。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
