import Link from 'next/link';
import { Button } from '../components/ui/Button';
import { ClipboardList, History, ShieldAlert, CheckCircle, BarChart3, ChevronRight, Info, Star, GraduationCap, Calculator, Handshake, Briefcase } from 'lucide-react';
import { BonusBadge } from '../components/bonus/BonusComponents';

const bonusShortcuts = [
  { href: '/bonus/treinamento', icon: GraduationCap, label: 'Mini Treinamento do Sistema' },
  { href: '/bonus/calculadora', icon: Calculator, label: 'Calculadora de Preço Máximo' },
  { href: '/bonus/negociacao', icon: Handshake, label: 'Kit de Negociação Técnica' },
  { href: '/bonus/consultor', icon: Briefcase, label: 'Kit Consultor: Como Cobrar' },
];

const features = [
  {
    icon: ClipboardList,
    title: 'Avaliação visual EPMURAS',
    text: 'Método consagrado adaptado para uma análise prática no curral. Sistema de pontuação objetivo com base no tipo comercial e funcionalidade.',
    accent: 'border-l-brand-green',
    iconBg: 'bg-green-100 text-brand-dark-green',
    chevron: 'bg-green-100 text-brand-green',
  },
  {
    icon: BarChart3,
    title: 'Ajuste por raça e objetivo',
    text: 'Não avalie um taurino como se fosse zebu. O app adapta os critérios visuais e orientações de acordo com o grupo racial e a sua finalidade.',
    accent: 'border-l-brand-gold',
    iconBg: 'bg-amber-100 text-brand-brown',
    chevron: 'bg-amber-100 text-brand-yellow',
  },
  {
    icon: ShieldAlert,
    title: 'Vetos automáticos',
    text: 'Identifique rapidamente características inaceitáveis. Um visual bom não paga o prejuízo de um animal doente, manco ou sem fertilidade.',
    accent: 'border-l-brand-red',
    iconBg: 'bg-red-100 text-brand-red',
    chevron: 'bg-red-100 text-brand-red',
  },
  {
    icon: CheckCircle,
    title: 'Resultado final de compra',
    text: 'Receba um parecer imediato, variando de "Não Comprar" a "Boa Compra", destacando os pontos fortes e os alertas para negociação.',
    accent: 'border-l-brand-green',
    iconBg: 'bg-emerald-100 text-brand-green',
    chevron: 'bg-emerald-100 text-brand-green',
  },
];

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 page-wash">
      <div className="max-w-4xl w-full text-center space-y-8">

        {/* Hero */}
        <div className="space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-gold/50 bg-brand-cream px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-brown shadow-sm">
            <Star className="h-3.5 w-3.5 text-brand-gold" />
            Método EPMURAS
          </span>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-brand-dark-green">
            Checklist EPMURAS
          </h1>

          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-10 sm:w-16 bg-brand-gold/60" aria-hidden="true" />
            <span className="font-display text-2xl sm:text-3xl text-brand-brown">
              para Compra de Gado
            </span>
            <span className="h-px w-10 sm:w-16 bg-brand-gold/60" aria-hidden="true" />
          </div>

          <p className="mt-2 max-w-2xl text-lg sm:text-xl text-brand-gray/90 mx-auto leading-relaxed">
            Avalie estrutura, precocidade, musculatura, umbigo, raça, aprumos, sexualidade e fatores comerciais antes de decidir se vale a pena comprar um animal.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/avaliar" className="w-full sm:w-auto">
            <Button size="lg" className="w-full text-base group shadow-md shadow-brand-dark-green/20">
              Começar Avaliação
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/historico" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full text-base bg-white">
              <History className="mr-2 h-5 w-5" />
              Ver Histórico
            </Button>
          </Link>
          <Link href="/referencias" className="w-full sm:w-auto">
            <Button variant="ghost" size="lg" className="w-full text-base">
              <Info className="mr-2 h-5 w-5" />
              Como Funciona
            </Button>
          </Link>
        </div>

        {/* Bonus shortcuts */}
        <div className="pt-10 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-brand-gold/60" aria-hidden="true" />
            <BonusBadge />
            <span className="h-px w-8 bg-brand-gold/60" aria-hidden="true" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-left">
            {bonusShortcuts.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-xl border border-brand-gold/40 bg-brand-cream p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md flex flex-col gap-2"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-brand-brown">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-bold text-brand-dark-green leading-snug">{label}</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-brown mt-auto group-hover:gap-1.5 transition-all">
                  Acessar <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left pt-10">
          {features.map(({ icon: Icon, title, text, accent, iconBg, chevron }) => (
            <div
              key={title}
              className={`group relative rounded-xl border border-gray-200 border-l-4 ${accent} bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className="flex items-start gap-4">
                <div className={`shrink-0 flex h-14 w-14 items-center justify-center rounded-full ${iconBg}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-brand-dark-green mb-1.5">{title}</h3>
                  <p className="text-sm text-brand-gray/90 leading-relaxed">{text}</p>
                </div>
                <div className={`shrink-0 flex h-7 w-7 items-center justify-center rounded-full ${chevron} opacity-80 group-hover:translate-x-0.5 transition-transform`}>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
