import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { AuthProvider } from '../auth/AuthProvider';
import { AuthGate } from '../auth/AuthGate';
import { InstallPrompt } from '../pwa/InstallPrompt';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
    <div className="min-h-screen flex flex-col bg-brand-beige">
      <Header />
      <main className="flex-1 flex flex-col pb-24 lg:pb-0">
        <AuthGate>{children}</AuthGate>
      </main>
      <footer className="hidden lg:block border-t border-brand-dark-green/10 py-6 bg-white print:hidden">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-brand-gray">
          <div className="text-center sm:text-left">
            <p>© {new Date().getFullYear()} Checklist EPMURAS — Compra de Gado.</p>
            <p className="mt-0.5 text-brand-gray/70">Uma ferramenta prática para produtores rurais.</p>
          </div>
          <p className="flex items-center gap-2 text-brand-dark-green font-medium">
            <ShieldCheck className="h-5 w-5 text-brand-green" />
            Avalie com critério, compre com segurança.
          </p>
        </div>
      </footer>
      <BottomNav />
      <InstallPrompt />
    </div>
    </AuthProvider>
  );
};
