import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "宠瑾安 | 猫犬护理预约",
  description: "宠瑾安提供预约制猫犬护理，从皮毛检查、沐洗吹干到造型复核，按状态安排，不做流水线。",
  icons: {
    icon: "/assets/images/brand-chongjinan-dog-mark.png",
    shortcut: "/assets/images/brand-chongjinan-dog-mark.png",
    apple: "/assets/images/brand-chongjinan-dog-mark.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
