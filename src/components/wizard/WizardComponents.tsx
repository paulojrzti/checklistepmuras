import React from 'react';
import { Info, Check, Lightbulb } from 'lucide-react';

export const wizardSteps = [
  { step: 1, label: 'Identificação', sublabel: 'Dados básicos do animal' },
  { step: 2, label: 'Raça e Objetivo', sublabel: 'Grupo racial e finalidade' },
  { step: 3, label: 'E, P, M', sublabel: 'Estrutura, Precocidade e Musculosidade' },
  { step: 4, label: 'U, R, A, S', sublabel: 'Umbigo, Racial, Aprumos e Sexualidade' },
  { step: 5, label: 'Filtro Comercial', sublabel: 'Mercado, sanidade e temperamento' },
  { step: 6, label: 'Vetos Automáticos', sublabel: 'Condições críticas' },
  { step: 7, label: 'Resultado Final', sublabel: 'Parecer de compra' },
];

export const GuidanceCard = ({ title, text }: { title: string; text: string }) => {
  if (!text) return null;
  return (
    <div className="rounded-xl border border-brand-gold/40 bg-gradient-to-r from-amber-50 to-brand-cream p-4 flex gap-3 items-start mb-6 shadow-sm">
      <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full border border-brand-gold/50 bg-white text-brand-yellow">
        <Info className="h-4.5 w-4.5" />
      </div>
      <div>
        {title && <h4 className="font-bold text-brand-brown text-sm mb-1">{title}</h4>}
        <p className="text-sm text-brand-gray leading-relaxed">{text}</p>
      </div>
    </div>
  );
};

const answerLevelStyles: Record<string, { label: string; title: string; badge: string }> = {
  bom: {
    label: 'Bom',
    title: 'text-brand-green',
    badge: 'bg-green-100 text-brand-green',
  },
  medio: {
    label: 'Médio',
    title: 'text-brand-yellow',
    badge: 'bg-amber-100 text-brand-yellow',
  },
  ruim: {
    label: 'Ruim',
    title: 'text-brand-red',
    badge: 'bg-red-100 text-brand-red',
  },
};

export const AnswerCard = ({
  title,
  points,
  description,
  selected,
  onClick
}: {
  title: string;
  points: number;
  description: string;
  selected: boolean;
  onClick: () => void
}) => {
  const style = answerLevelStyles[title] ?? { label: title, title: 'text-brand-dark-green', badge: 'bg-gray-100 text-brand-gray' };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative text-left rounded-xl border p-4 flex flex-col h-full transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-green ${
        selected
          ? 'border-brand-green bg-green-50/70 ring-1 ring-brand-green shadow-md'
          : 'border-gray-200 bg-white shadow-sm hover:-translate-y-0.5 hover:border-brand-dark-green/40 hover:shadow-md'
      }`}
    >
      {selected && (
        <span className="absolute -top-2.5 -right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-brand-green text-white shadow-md">
          <Check className="h-4 w-4" strokeWidth={3} />
        </span>
      )}
      <div className="flex justify-between items-center mb-2">
        <h4 className={`font-bold text-lg ${style.title}`}>{style.label}</h4>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${style.badge}`}>
          {points} pts
        </span>
      </div>
      <p className="text-sm text-brand-gray leading-relaxed flex-grow">{description}</p>
    </button>
  );
};

export const StepLayout = ({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex items-center gap-4">
      {icon && (
        <div className="shrink-0 flex h-14 w-14 items-center justify-center rounded-full bg-brand-dark-green text-brand-beige shadow-md print:hidden">
          {icon}
        </div>
      )}
      <div className={icon ? 'border-l border-brand-gold/40 pl-4' : undefined}>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-dark-green">{title}</h2>
        <span className="block h-0.5 w-12 bg-brand-gold rounded-full mt-1.5 mb-1" aria-hidden="true" />
        {subtitle && <p className="text-brand-gray/90">{subtitle}</p>}
      </div>
    </div>
    {children}
  </div>
);

export const WizardSidebar = ({
  currentStep,
  totalSteps = 7,
  onStepClick,
}: {
  currentStep: number;
  totalSteps?: number;
  onStepClick?: (step: number) => void;
}) => {
  const percent = Math.round((currentStep / totalSteps) * 100);

  return (
    <aside className="hidden lg:flex flex-col gap-4 w-72 shrink-0 print:hidden">
      {/* Progress card */}
      <div className="rounded-2xl bg-brand-dark-green text-white p-5 shadow-lg shadow-brand-dark-green/20">
        <h3 className="font-bold text-brand-beige">Progresso da Avaliação</h3>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-gold mt-2">
          Etapa {currentStep} de {totalSteps}
        </p>
        <p className="text-2xl font-bold mt-1">
          {percent}% <span className="text-sm font-normal opacity-80">concluído</span>
        </p>
        <div className="mt-3 h-2 w-full rounded-full bg-white/20">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-brand-green to-emerald-400 transition-all duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Vertical stepper */}
      <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-4">
        <ol className="relative">
          {wizardSteps.map(({ step, label, sublabel }, i) => {
            const done = step < currentStep;
            const current = step === currentStep;
            const clickable = done && onStepClick;
            return (
              <li key={step} className="relative flex gap-3 pb-1">
                {i < wizardSteps.length - 1 && (
                  <span
                    className={`absolute left-[15px] top-8 bottom-0 w-px ${done ? 'bg-brand-green/50' : 'bg-gray-200'}`}
                    aria-hidden="true"
                  />
                )}
                <button
                  type="button"
                  disabled={!clickable}
                  onClick={() => clickable && onStepClick(step)}
                  className={`flex items-start gap-3 w-full rounded-lg p-1.5 -m-1.5 mb-2 text-left transition-colors ${
                    clickable ? 'cursor-pointer hover:bg-brand-beige/70' : 'cursor-default'
                  }`}
                >
                  <span
                    className={`relative z-10 shrink-0 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors ${
                      done
                        ? 'border-brand-green bg-brand-green text-white'
                        : current
                          ? 'border-brand-dark-green bg-brand-dark-green text-white shadow-md'
                          : 'border-gray-300 bg-white text-gray-400'
                    }`}
                  >
                    {done ? <Check className="h-4 w-4" strokeWidth={3} /> : step}
                  </span>
                  <span className="pt-1 min-w-0">
                    <span
                      className={`block text-sm leading-tight ${
                        current ? 'font-bold text-brand-dark-green' : done ? 'font-semibold text-brand-green' : 'font-medium text-gray-400'
                      }`}
                    >
                      {label}
                    </span>
                    {current && (
                      <span className="block text-xs text-brand-gray/80 mt-0.5">{sublabel}</span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Tip card */}
      <div className="rounded-2xl border border-brand-gold/40 bg-brand-cream p-4 flex gap-3 items-start shadow-sm">
        <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-brand-yellow">
          <Lightbulb className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-brand-brown">Dica</h4>
          <p className="text-xs text-brand-gray leading-relaxed mt-1">
            Compare o animal com outros de mesma idade, raça, sexo e condição de manejo.
          </p>
        </div>
      </div>
    </aside>
  );
};

export const EvaluationStepper = ({ currentStep, totalSteps = 7 }: { currentStep: number, totalSteps?: number }) => {
  const current = wizardSteps.find(s => s.step === currentStep);
  return (
    <div className="w-full mb-6 lg:hidden print:hidden">
      <div className="flex justify-between items-end mb-2">
        <div>
          <span className="block text-xs font-bold text-brand-gold uppercase tracking-[0.15em]">
            Etapa {currentStep} de {totalSteps}
          </span>
          {current && <span className="block text-sm font-semibold text-brand-dark-green mt-0.5">{current.label}</span>}
        </div>
        <span className="text-xs text-brand-gray">{Math.round((currentStep / totalSteps) * 100)}% concluído</span>
      </div>
      <div className="w-full bg-white border border-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-brand-dark-green h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};
