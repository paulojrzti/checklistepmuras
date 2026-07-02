import Link from 'next/link';
import { Gift, GraduationCap, Calculator, Handshake, Briefcase, ChevronRight } from 'lucide-react';
import { BonusBadge } from '../../components/bonus/BonusComponents';

const bonuses = [
  {
    href: '/bonus/treinamento',
    icon: GraduationCap,
    iconBg: 'bg-green-100 text-brand-dark-green',
    accent: 'border-l-brand-green',
    title: 'Mini Treinamento de Uso do Sistema EPMURAS de Decisão de Compra',
    text: 'Um treinamento rápido e direto para você entender como usar o sistema na prática, etapa por etapa, sem ficar perdido na hora da avaliação.',
  },
  {
    href: '/bonus/calculadora',
    icon: Calculator,
    iconBg: 'bg-amber-100 text-brand-brown',
    accent: 'border-l-brand-gold',
    title: 'Calculadora de Preço Máximo de Compra',
    text: 'Uma ferramenta para ajudar você a chegar em um limite de compra mais racional antes de fechar negócio.',
  },
  {
    href: '/bonus/negociacao',
    icon: Handshake,
    iconBg: 'bg-red-100 text-brand-red',
    accent: 'border-l-brand-red',
    title: 'Kit de Negociação com Desconto Técnico',
    text: 'Um kit para ajudar você a negociar com mais argumento quando a avaliação aponta pontos que reduzem o valor do animal.',
  },
  {
    href: '/bonus/consultor',
    icon: Briefcase,
    iconBg: 'bg-emerald-100 text-brand-green',
    accent: 'border-l-brand-green',
    title: 'Kit Consultor: Como Cobrar por Avaliação de Gado',
    text: 'Um material para técnicos, zootecnistas, agrônomos, veterinários e consultores que querem transformar avaliação de bovinos em um serviço mais organizado e valorizado.',
  },
];

export default function BonusPage() {
  return (
    <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 page-wash">
      <div className="flex items-center gap-4">
        <div className="bg-brand-gold text-white p-3 rounded-xl shadow-md">
          <Gift className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-dark-green">Bônus</h1>
          <p className="text-brand-gray mt-0.5">Ferramentas e materiais exclusivos para elevar suas compras</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {bonuses.map(({ href, icon: Icon, iconBg, accent, title, text }) => (
          <Link
            key={href}
            href={href}
            className={`group relative rounded-xl border border-gray-200 border-l-4 ${accent} bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col gap-3`}
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBg}`}>
                <Icon className="h-6 w-6" />
              </div>
              <BonusBadge />
            </div>
            <h3 className="text-lg font-bold text-brand-dark-green leading-snug">{title}</h3>
            <p className="text-sm text-brand-gray/90 leading-relaxed flex-1">{text}</p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-green group-hover:gap-2 transition-all">
              Acessar
              <ChevronRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
