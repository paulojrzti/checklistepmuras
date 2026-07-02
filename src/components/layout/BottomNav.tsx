"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calculator, ClipboardList, Gift, History } from 'lucide-react';

export const BottomNav = () => {
  const pathname = usePathname();

  const isBonusHub = pathname.startsWith('/bonus') && pathname !== '/bonus/calculadora';

  const sideItem = (href: string, label: string, Icon: typeof Home, active: boolean) => (
    <Link
      key={href}
      href={href}
      className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 relative"
    >
      {href === '/bonus' && (
        <span className="absolute top-0 right-1/2 translate-x-4 -translate-y-0.5 rounded-full bg-brand-gold text-white text-[9px] font-bold px-1.5 py-px leading-tight shadow-sm">
          Hoje!
        </span>
      )}
      <Icon className={`h-5 w-5 ${active ? 'text-brand-dark-green' : 'text-gray-400'}`} strokeWidth={active ? 2.5 : 2} />
      <span className={`text-[10px] leading-tight ${active ? 'font-bold text-brand-dark-green' : 'font-medium text-gray-400'}`}>
        {label}
      </span>
    </Link>
  );

  return (
    <nav
      className="lg:hidden print:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch max-w-lg mx-auto px-1">
        {sideItem('/', 'Início', Home, pathname === '/')}
        {sideItem('/bonus/calculadora', 'Calculadora', Calculator, pathname === '/bonus/calculadora')}

        {/* Central highlighted action */}
        <Link href="/avaliar" className="relative flex-1 flex flex-col items-center justify-end pb-1.5">
          <span
            className={`absolute -top-5 flex h-14 w-14 items-center justify-center rounded-full text-brand-beige shadow-lg shadow-brand-dark-green/30 ring-4 ring-brand-beige transition-colors ${
              pathname === '/avaliar' ? 'bg-brand-deep-green' : 'bg-brand-dark-green'
            }`}
          >
            <ClipboardList className="h-6 w-6" />
          </span>
          <span className={`text-[10px] leading-tight mt-9 ${pathname === '/avaliar' ? 'font-bold text-brand-dark-green' : 'font-medium text-gray-500'}`}>
            Avaliar
          </span>
        </Link>

        {sideItem('/bonus', 'Bônus', Gift, isBonusHub)}
        {sideItem('/historico', 'Histórico', History, pathname === '/historico')}
      </div>
    </nav>
  );
};
