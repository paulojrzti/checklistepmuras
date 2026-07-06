import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AppShell } from "../components/layout/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const viewport: Viewport = {
  themeColor: "#123C2F",
};

export const metadata: Metadata = {
  title: "Checklist EPMURAS | Compra de Gado",
  description: "Avalie estrutura, precocidade, musculatura, umbigo, raça, aprumos, sexualidade e fatores comerciais antes de decidir se vale a pena comprar um animal.",
  icons: {
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "EPMURAS",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-brand-beige text-brand-gray font-sans">
        {/* Captura o evento de instalação do PWA antes do React montar (senão ele se perde) */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__epmurasInstallEvent=e;window.dispatchEvent(new Event('epmuras-install-ready'));});",
          }}
        />
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
