import React from 'react';
import Link from 'next/link';
import { ClipboardList, History, Home } from 'lucide-react';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 print:hidden">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-brand-dark-green text-brand-beige p-1.5 rounded-md">
            <ClipboardList className="h-5 w-5" />
          </div>
          <span className="font-bold text-brand-dark-green hidden sm:inline-block">
            Checklist EPMURAS
          </span>
        </Link>
        
        <nav className="flex items-center space-x-4 text-sm font-medium">
          <Link href="/" className="text-brand-gray hover:text-brand-dark-green transition-colors flex items-center gap-1">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Início</span>
          </Link>
          <Link href="/avaliar" className="text-brand-gray hover:text-brand-dark-green transition-colors flex items-center gap-1">
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">Nova Avaliação</span>
          </Link>
          <Link href="/historico" className="text-brand-gray hover:text-brand-dark-green transition-colors flex items-center gap-1">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Histórico</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};
