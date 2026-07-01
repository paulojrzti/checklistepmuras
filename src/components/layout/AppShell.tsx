import React from 'react';
import { Header } from './Header';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-beige">
      <Header />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="border-t py-6 bg-white print:hidden">
        <div className="container mx-auto px-4 text-center text-sm text-brand-gray">
          <p>© {new Date().getFullYear()} Checklist EPMURAS — Compra de Gado.</p>
          <p className="mt-1">Uma ferramenta prática para produtores rurais.</p>
        </div>
      </footer>
    </div>
  );
};
