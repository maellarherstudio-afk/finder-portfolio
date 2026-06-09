import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maël Larher Studio",
  description: "Portfolio — Maël Larher Studio",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
