"use client";

import { useMemo, useState } from "react";
import {
  Briefcase,
  Printer,
  Wallet,
  CircleDollarSign,
  FileText,
  BadgePercent,
  Receipt,
  UserCheck,
} from "lucide-react";
import { BonusBadge, VideoEmbed } from "../../../components/bonus/BonusComponents";
import { MaskedNumberInput } from "../../../components/ui/MaskedNumberInput";
import { parseNumberBR, formatBRL } from "../../../utils/pricing";

const fieldClass = "w-full p-2.5 border border-gray-300 rounded-lg bg-white text-brand-gray placeholder:text-gray-400 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors shadow-sm";
const labelClass = "text-sm font-semibold text-brand-dark-green";

type PricingModel = "por_cabeca" | "por_dia" | "percentual" | "laudo";

const pricingModels: Record<PricingModel, {
  icon: typeof Wallet;
  title: string;
  description: string;
  quando: string;
  faixa: string;
}> = {
  por_cabeca: {
    icon: Wallet,
    title: "Por cabeça avaliada",
    description: "Valor fixo por animal avaliado com o checklist completo. Simples de explicar e de cobrar.",
    quando: "Compras avulsas ou lotes pequenos (até ~30 animais).",
    faixa: "R$ 15 a R$ 50 por cabeça, conforme região e complexidade.",
  },
  por_dia: {
    icon: Receipt,
    title: "Por diária de serviço",
    description: "Diária técnica fechada, independente do número de animais. Boa para leilões e feiras.",
    quando: "Dias inteiros de trabalho: leilões, feiras, visitas a fazendas.",
    faixa: "R$ 400 a R$ 1.200 por diária + deslocamento.",
  },
  percentual: {
    icon: BadgePercent,
    title: "Percentual do valor negociado",
    description: "Percentual sobre o valor total da compra assessorada. Alinha seu ganho ao resultado do cliente.",
    quando: "Compras grandes em que sua avaliação evita prejuízo relevante.",
    faixa: "0,5% a 2% do valor total negociado.",
  },
  laudo: {
    icon: FileText,
    title: "Avaliação avulsa + laudo",
    description: "Avaliação pontual com emissão de laudo técnico impresso (use o resultado do app como base).",
    quando: "Cliente quer documento formal: reprodutores, matrizes, seguro, disputa.",
    faixa: "R$ 150 a R$ 500 por laudo emitido.",
  },
};

export default function ConsultorPage() {
  const [modelo, setModelo] = useState<PricingModel>("por_cabeca");
  const [quantidade, setQuantidade] = useState("50");
  const [valorBase, setValorBase] = useState("");

  const simulation = useMemo(() => {
    const qtd = parseNumberBR(quantidade);
    const base = parseNumberBR(valorBase);
    if (!qtd || qtd <= 0) return null;

    switch (modelo) {
      case "por_cabeca": {
        const b = base ?? 25;
        return { label: `${qtd} cabeças × ${formatBRL(b)}`, min: qtd * b * 0.8, max: qtd * b * 1.2 };
      }
      case "por_dia": {
        const b = base ?? 700;
        const dias = Math.max(1, Math.ceil(qtd / 60)); // ~60 animais avaliados por dia
        return { label: `${dias} diária(s) estimada(s) para ${qtd} cabeças`, min: dias * b * 0.8, max: dias * b * 1.2 };
      }
      case "percentual": {
        if (!base) return null;
        return { label: `0,5% a 2% sobre ${formatBRL(base)} negociados`, min: base * 0.005, max: base * 0.02 };
      }
      case "laudo": {
        const b = base ?? 300;
        return { label: `${qtd} laudo(s) × ${formatBRL(b)}`, min: qtd * b * 0.7, max: qtd * b * 1.3 };
      }
    }
  }, [modelo, quantidade, valorBase]);

  const baseLabel = modelo === "percentual"
    ? "Valor total da negociação"
    : modelo === "por_dia"
      ? "Valor da sua diária"
      : modelo === "laudo"
        ? "Valor por laudo"
        : "Valor por cabeça";

  const qtdLabel = modelo === "laudo" ? "Número de laudos" : "Número de animais";

  return (
    <div className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 page-wash">
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="bg-brand-green text-white p-3 rounded-xl shadow-md print:hidden">
          <Briefcase className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-dark-green">Kit Consultor</h1>
          <p className="text-brand-gray text-sm mt-0.5">Como cobrar por avaliação de gado</p>
        </div>
        <BonusBadge className="print:hidden" />
      </div>

      {/* Video */}
      <div className="print:hidden">
        <VideoEmbed youtubeId={null} title="Kit Consultor: como transformar avaliação de bovinos em serviço" />
      </div>

      {/* Why charge */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-bold text-brand-dark-green flex items-center gap-2 mb-3">
          <UserCheck className="h-5 w-5 text-brand-green" />
          Por que cobrar pela avaliação
        </h2>
        <p className="text-sm text-brand-gray leading-relaxed mb-2">
          Uma avaliação técnica bem feita evita prejuízos que facilmente passam de milhares de reais por animal:
          boi tardio, matriz vazia, reprodutor sem exame, lote doente. Quem evita prejuízo gera valor — e valor se cobra.
        </p>
        <p className="text-sm text-brand-gray leading-relaxed">
          O erro mais comum do técnico é embutir a avaliação "de graça" em outros serviços. Separe o serviço,
          dê nome a ele (ex.: <em>Parecer Técnico de Compra</em>), entregue algo tangível (o laudo impresso deste app)
          e apresente o preço com naturalidade.
        </p>
      </div>

      {/* Pricing models */}
      <div className="space-y-3">
        <h2 className="font-display text-xl font-bold text-brand-dark-green">4 modelos de precificação</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(Object.entries(pricingModels) as [PricingModel, typeof pricingModels[PricingModel]][]).map(([key, model]) => {
            const Icon = model.icon;
            return (
              <div key={key} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-brand-green shrink-0">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <h3 className="font-bold text-brand-dark-green text-sm leading-tight">{model.title}</h3>
                </div>
                <p className="text-xs text-brand-gray leading-relaxed">{model.description}</p>
                <p className="text-xs text-brand-gray"><strong className="text-brand-dark-green">Quando usar:</strong> {model.quando}</p>
                <p className="text-xs rounded-md bg-brand-cream border border-brand-gold/30 px-2 py-1.5 text-brand-brown font-semibold mt-auto">
                  Faixa de referência: {model.faixa}
                </p>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-brand-gray/60">
          Faixas de referência genéricas — ajuste à sua região, experiência e responsabilidade técnica envolvida.
        </p>
      </div>

      {/* Fee simulator */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 print:hidden">
        <h2 className="font-bold text-brand-dark-green flex items-center gap-2 mb-4">
          <CircleDollarSign className="h-5 w-5 text-brand-gold" />
          Simulador de honorários
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className={labelClass}>Modelo de cobrança</label>
            <select className={fieldClass} value={modelo} onChange={e => setModelo(e.target.value as PricingModel)}>
              <option value="por_cabeca">Por cabeça</option>
              <option value="por_dia">Por diária</option>
              <option value="percentual">% do valor negociado</option>
              <option value="laudo">Avulsa + laudo</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>{qtdLabel}</label>
            <MaskedNumberInput value={quantidade} onChange={setQuantidade} />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>{baseLabel}</label>
            <MaskedNumberInput
              prefix="R$"
              placeholder={modelo === "percentual" ? "Ex: 150.000" : "Opcional — usa referência"}
              value={valorBase}
              onChange={setValorBase}
            />
          </div>
        </div>

        {simulation ? (
          <div className="mt-5 rounded-xl bg-brand-dark-green text-white p-5 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">Faixa sugerida de honorários</p>
            <p className="font-display text-3xl font-bold mt-1">
              {formatBRL(simulation.min)} <span className="text-lg font-normal opacity-70">a</span> {formatBRL(simulation.max)}
            </p>
            <p className="text-xs opacity-80 mt-1.5">{simulation.label}</p>
          </div>
        ) : (
          <p className="mt-4 text-sm text-brand-gray/70 text-center">
            {modelo === "percentual" ? "Informe o valor total da negociação para simular." : "Informe a quantidade para simular."}
          </p>
        )}
      </div>

      {/* Proposal template (printable) */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-bold text-brand-dark-green flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-brand-dark-green" />
          Modelo de proposta de serviço
        </h2>
        <div className="rounded-lg border border-dashed border-gray-300 p-4 sm:p-5 text-sm text-brand-gray space-y-3 leading-relaxed">
          <p className="font-bold text-brand-dark-green text-center uppercase tracking-wide">Proposta — Parecer Técnico de Compra de Bovinos</p>
          <p><strong>Profissional:</strong> ________________________________ &nbsp; <strong>Registro:</strong> ______________</p>
          <p><strong>Cliente:</strong> ________________________________ &nbsp; <strong>Propriedade:</strong> ______________</p>
          <p><strong>Escopo:</strong> avaliação visual estruturada (método EPMURAS adaptado) de ______ animais, incluindo
            estrutura, precocidade, musculosidade, umbigo, padrão racial, aprumos, sexualidade, filtro comercial e vetos
            sanitários/funcionais, com parecer de compra individual.</p>
          <p><strong>Entregáveis:</strong> checklist preenchido por animal, pontuação final, parecer de compra
            (Boa Compra / Cautela / Desconto / Não Comprar) e recomendação de negociação com desconto técnico.</p>
          <p><strong>Modelo de cobrança:</strong> (&nbsp;&nbsp;) por cabeça — R$ ______ &nbsp; (&nbsp;&nbsp;) diária — R$ ______ &nbsp; (&nbsp;&nbsp;) % do valor — ______% &nbsp; (&nbsp;&nbsp;) laudo — R$ ______</p>
          <p><strong>Condições:</strong> deslocamento e estadia por conta do contratante. Este parecer é ferramenta de apoio
            à decisão e não substitui exames laboratoriais, andrológicos ou sanitários específicos.</p>
          <p className="pt-2">Data: ____/____/______ &nbsp;&nbsp;&nbsp; Assinatura: ________________________________</p>
        </div>
      </div>

      {/* How to present */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-bold text-brand-dark-green mb-3">Como apresentar o serviço (resumo)</h2>
        <ul className="space-y-2 text-sm text-brand-gray">
          <li className="flex items-start gap-2"><span className="text-brand-green mt-0.5">1.</span>Mostre um exemplo real de avaliação feita no app — o cliente precisa ver o entregável.</li>
          <li className="flex items-start gap-2"><span className="text-brand-green mt-0.5">2.</span>Quantifique o risco: "um boi tardio no lote custa R$ ____ a mais de pasto e tempo".</li>
          <li className="flex items-start gap-2"><span className="text-brand-green mt-0.5">3.</span>Compare o honorário com o prejuízo evitado — a conta se paga com um único animal descartado.</li>
          <li className="flex items-start gap-2"><span className="text-brand-green mt-0.5">4.</span>Formalize com a proposta acima e entregue o laudo impresso ao final. Serviço com documento vale mais.</li>
        </ul>
      </div>

      {/* Print */}
      <div className="flex justify-center print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-dark-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-deep-green transition-colors shadow-sm"
        >
          <Printer className="h-4 w-4" />
          Imprimir kit e proposta
        </button>
      </div>
    </div>
  );
}
