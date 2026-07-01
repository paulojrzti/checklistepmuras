import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "../components/layout/AppShell";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Checklist EPMURAS | Compra de Gado",
  description: "Avalie estrutura, precocidade, musculatura, umbigo, raça, aprumos, sexualidade e fatores comerciais antes de decidir se vale a pena comprar um animal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.className} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-brand-beige text-brand-gray">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
