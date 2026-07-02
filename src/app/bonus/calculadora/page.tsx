"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Calculator,
  Printer,
  ChevronDown,
  ChevronUp,
  XCircle,
  CircleCheck,
  TrendingDown,
} from "lucide-react";
import { useHistoryStore } from "../../../store/useHistoryStore";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import { BonusBadge } from "../../../components/bonus/BonusComponents";
import { parseNumberBR, formatBRL, getTechnicalDiscount, computeMaxPrice, TechnicalDiscount } from "../../../utils/pricing";
import { calculateFinalScore } from "../../../utils/calculations";
import { AnimalEvaluation } from "../../../types/checklist";

const fieldClass = "w-full p-2.5 border border-gray-300 rounded-lg bg-white text-brand-gray placeholder:text-gray-400 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors shadow-sm";
const labelClass = "text-sm font-semibold text-brand-dark-green";

const MANUAL = "manual";
const ATUAL = "atual";

function CalculadoraContent() {
  const searchParams = useSearchParams();
  const { evaluations } = useHistoryStore();
  const { evaluation: currentEvaluation } = useEvaluationStore();
  const [mounted, setMounted] = useState(false);

  const [source, setSource] = useState<string>(MANUAL);
  const [peso, setPeso] = useState("");
  const [rendimento, setRendimento] = useState("52");
  const [precoArroba, setPrecoArroba] = useState("");
  const [desconto, setDesconto] = useState("0");
  const [margem, setMargem] = useState("5");
  const [precoPedido, setPrecoPedido] = useState("");
  const [discountInfo, setDiscountInfo] = useState<TechnicalDiscount | null>(null);
  const [showMemory, setShowMemory] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const applyEvaluation = (evalItem: AnimalEvaluation) => {
    const pesoNum = parseNumberBR(evalItem.weight);
    const pedidoNum = parseNumberBR(evalItem.price);
    const technical = getTechnicalDiscount(evalItem);

    if (pesoNum) setPeso(String(pesoNum));
    if (pedidoNum) setPrecoPedido(String(pedidoNum));
    setDesconto(String(technical.percent));
    setDiscountInfo(technical);
  };

  const handleSourceChange = (value: string) => {
    setSource(value);
    if (value === MANUAL) {
      setDiscountInfo(null);
      setDesconto("0");
      return;
    }
    const evalItem = value === ATUAL
      ? currentEvaluation
      : evaluations.find(e => e.id === value);
    if (evalItem) applyEvaluation(evalItem);
  };

  // Pre-select evaluation from ?avaliacao=<id> after mount
  useEffect(() => {
    if (!mounted) return;
    const id = searchParams.get("avaliacao");
    if (id && evaluations.some(e => e.id === id)) {
      handleSourceChange(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const result = useMemo(() => {
    const pesoKg = parseNumberBR(peso);
    const rendimentoPct = parseNumberBR(rendimento);
    const arroba = parseNumberBR(precoArroba);
    if (!pesoKg || !rendimentoPct || !arroba) return null;

    return computeMaxPrice({
      pesoKg,
      rendimentoPct,
      precoArroba: arroba,
      descontoTecnicoPct: parseNumberBR(desconto) ?? 0,
      margemPct: parseNumberBR(margem) ?? 0,
    });
  }, [peso, rendimento, precoArroba, desconto, margem]);

  const pedidoNum = parseNumberBR(precoPedido);
  const diff = result && pedidoNum ? result.precoMaximo - pedidoNum : null;

  if (!mounted) return <div className="p-8 text-center text-brand-gray">Carregando calculadora...</div>;

  const currentHasData = calculateFinalScore(currentEvaluation) > 0 || !!currentEvaluation.animalName;

  return (
    <div className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 page-wash">
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="bg-brand-gold text-white p-3 rounded-xl shadow-md">
          <Calculator className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-dark-green">Calculadora de Preço Máximo</h1>
          <p className="text-brand-gray text-sm mt-0.5">Chegue em um limite de compra racional antes de fechar negócio</p>
        </div>
        <BonusBadge className="print:hidden" />
      </div>

      {/* Animal source */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 space-y-2 print:hidden">
        <label className={labelClass}>Boi avaliado (preenchimento semi-automático)</label>
        <select className={fieldClass} value={source} onChange={e => handleSourceChange(e.target.value)}>
          <option value={MANUAL}>Preencher manualmente</option>
          {currentHasData && <option value={ATUAL}>Avaliação atual (em andamento){currentEvaluation.animalName ? ` — ${currentEvaluation.animalName}` : ''}</option>}
          {evaluations.map(e => (
            <option key={e.id} value={e.id}>
              {e.animalName || 'Sem identificação'} — nota {calculateFinalScore(e)}/50
            </option>
          ))}
        </select>
        {discountInfo && (
          <p className="text-xs text-brand-gray/80">
            Peso, preço pedido e desconto técnico preenchidos pela avaliação (nota {discountInfo.score}/50). Todos os campos continuam editáveis.
          </p>
        )}
      </div>

      {/* Veto alert */}
      {discountInfo?.blocked && (
        <div className="rounded-xl border border-brand-red bg-red-50 p-4 flex gap-3 items-start">
          <XCircle className="h-5 w-5 text-brand-red shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">
            <strong>Esta avaliação tem veto marcado — a recomendação do método é NÃO COMPRAR.</strong>{' '}
            O cálculo abaixo é apenas referência caso você decida renegociar do zero.
          </p>
        </div>
      )}

      {/* Inputs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className={labelClass}>Peso vivo (kg) <span className="text-brand-red">*</span></label>
            <input type="text" inputMode="decimal" className={fieldClass} placeholder="Ex: 450" value={peso} onChange={e => setPeso(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Rendimento de carcaça (%) <span className="text-brand-red">*</span></label>
            <div className="flex gap-2">
              <input type="text" inputMode="decimal" className={fieldClass} placeholder="Ex: 52" value={rendimento} onChange={e => setRendimento(e.target.value)} />
              <div className="flex gap-1">
                {["50", "52", "54"].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setRendimento(p)}
                    className={`px-2.5 rounded-lg text-xs font-bold border transition-colors ${
                      rendimento === p ? 'bg-brand-dark-green text-white border-brand-dark-green' : 'bg-white text-brand-gray border-gray-300 hover:border-brand-gold'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Preço da arroba (R$) <span className="text-brand-red">*</span></label>
            <input type="text" inputMode="decimal" className={fieldClass} placeholder="Ex: 240" value={precoArroba} onChange={e => setPrecoArroba(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Desconto técnico (%)</label>
            <input type="text" inputMode="decimal" className={fieldClass} placeholder="Ex: 6" value={desconto} onChange={e => setDesconto(e.target.value)} />
            {discountInfo && discountInfo.reasons.length > 0 && (
              <button
                type="button"
                onClick={() => setShowMemory(!showMemory)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-brown hover:text-brand-gold transition-colors"
              >
                Memória de cálculo do desconto
                {showMemory ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            )}
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Margem de segurança desejada (%)</label>
            <input type="text" inputMode="decimal" className={fieldClass} placeholder="Ex: 5" value={margem} onChange={e => setMargem(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Preço pedido pelo vendedor (R$)</label>
            <input type="text" inputMode="decimal" className={fieldClass} placeholder="Opcional — Ex: 3.500" value={precoPedido} onChange={e => setPrecoPedido(e.target.value)} />
          </div>
        </div>

        {showMemory && discountInfo && (
          <div className="mt-5 rounded-lg bg-brand-cream border border-brand-gold/40 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-brown mb-2">Desconto técnico sugerido: {discountInfo.percent}%</p>
            <ul className="space-y-1.5 text-sm text-brand-gray">
              {discountInfo.reasons.map((r, i) => (
                <li key={i} className="flex justify-between gap-3">
                  <span>{r.label}</span>
                  <strong className="text-brand-brown shrink-0">+{r.percent}%</strong>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Result */}
      {result ? (
        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white">
          <div className="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-b border-gray-100">
            <div>
              <p className="text-xs text-brand-gray/70 uppercase tracking-wide font-semibold">Arrobas est.</p>
              <p className="text-lg font-bold text-brand-dark-green mt-0.5">{result.arrobas.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} @</p>
            </div>
            <div>
              <p className="text-xs text-brand-gray/70 uppercase tracking-wide font-semibold">Valor mercado</p>
              <p className="text-lg font-bold text-brand-dark-green mt-0.5">{formatBRL(result.valorMercado)}</p>
            </div>
            <div>
              <p className="text-xs text-brand-gray/70 uppercase tracking-wide font-semibold">Desc. técnico</p>
              <p className="text-lg font-bold text-brand-red mt-0.5">−{formatBRL(result.descontoTecnicoValor)}</p>
            </div>
            <div>
              <p className="text-xs text-brand-gray/70 uppercase tracking-wide font-semibold">Margem</p>
              <p className="text-lg font-bold text-brand-yellow mt-0.5">−{formatBRL(result.margemValor)}</p>
            </div>
          </div>

          <div className="bg-brand-dark-green text-white p-6 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">Preço máximo de compra</p>
            <p className="font-display text-4xl sm:text-5xl font-bold mt-2">{formatBRL(result.precoMaximo)}</p>

            {diff !== null && (
              <div
                className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                  diff >= 0 ? 'bg-emerald-500/25 text-emerald-100' : 'bg-red-500/25 text-red-100'
                }`}
              >
                {diff >= 0 ? <CircleCheck className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {diff >= 0
                  ? `Preço pedido está ${formatBRL(diff)} abaixo do seu limite — há espaço para negociar.`
                  : `Preço pedido está ${formatBRL(-diff)} acima do seu limite — negocie ou recuse.`}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white/60 p-8 text-center text-sm text-brand-gray/70">
          Preencha peso, rendimento e preço da arroba para ver o preço máximo.
        </div>
      )}

      {/* Actions */}
      {result && (
        <div className="flex flex-wrap justify-center gap-3 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-brand-gray hover:text-brand-dark-green hover:bg-brand-beige transition-colors"
          >
            <Printer className="h-4 w-4" />
            Imprimir cálculo
          </button>
          {source !== MANUAL && source !== ATUAL && (
            <Link
              href={`/bonus/negociacao?avaliacao=${source}`}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-dark-green px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-deep-green transition-colors shadow-sm"
            >
              Gerar Kit de Negociação
            </Link>
          )}
        </div>
      )}

      <p className="text-xs text-brand-gray/60 text-center max-w-lg mx-auto print:hidden">
        Metodologia: peso vivo × rendimento ÷ 15 = arrobas × preço da @ = valor de mercado, menos o desconto técnico
        sugerido pela avaliação EPMURAS e a sua margem de segurança. Ferramenta de apoio — não substitui análise financeira completa.
      </p>
    </div>
  );
}

export default function CalculadoraPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-brand-gray">Carregando calculadora...</div>}>
      <CalculadoraContent />
    </Suspense>
  );
}
