"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardList, History, Home, Gift, LogOut } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';

const navItems = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/avaliar', label: 'Nova Avaliação', icon: ClipboardList },
  { href: '/bonus', label: 'Bônus', icon: Gift, badge: 'Hoje!' },
  { href: '/historico', label: 'Histórico', icon: History },
];

export const Header = () => {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-dark-green/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 print:hidden">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-brand-dark-green text-brand-beige p-2 rounded-lg ring-1 ring-brand-gold/40 shadow-sm group-hover:bg-brand-deep-green transition-colors">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <span className="block font-bold text-brand-dark-green tracking-tight">
              Checklist EPMURAS
            </span>
            <span className="block text-[11px] font-semibold text-brand-gold uppercase tracking-wider">
              Compra de Gado
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          {navItems.map(({ href, label, icon: Icon, badge }) => {
            const active = href === '/bonus' ? pathname.startsWith('/bonus') : pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-full transition-colors ${
                  active
                    ? 'bg-brand-dark-green/10 text-brand-dark-green font-semibold'
                    : 'text-brand-gray hover:text-brand-dark-green hover:bg-brand-beige'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
                {badge && (
                  <span className="absolute -top-1 -right-1 rounded-full bg-brand-gold text-white text-[9px] font-bold px-1.5 py-px leading-tight shadow-sm">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
          {user && (
            <button
              type="button"
              onClick={() => signOut()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-brand-gray/70 hover:text-brand-red hover:bg-red-50 transition-colors"
              aria-label="Sair da conta"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </button>
          )}
        </nav>

        {/* Mobile: quick access to bonus hub + sair; bottom nav handles the rest */}
        <div className="lg:hidden flex items-center gap-2">
          <Link
            href="/bonus"
            className="relative flex items-center justify-center h-9 w-9 rounded-full bg-brand-beige text-brand-dark-green"
            aria-label="Bônus de hoje"
          >
            <Gift className="h-4.5 w-4.5" />
            <span className="absolute -top-1 -right-1.5 rounded-full bg-brand-gold text-white text-[8px] font-bold px-1 py-px leading-tight shadow-sm">
              Hoje!
            </span>
          </Link>
          {user && (
            <button
              type="button"
              onClick={() => signOut()}
              className="flex items-center justify-center h-9 w-9 rounded-full bg-brand-beige text-brand-gray/70 hover:text-brand-red transition-colors"
              aria-label="Sair da conta"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
