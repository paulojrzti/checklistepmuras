"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Handshake,
  Printer,
  XCircle,
  CheckCircle2,
  ListChecks,
  Quote,
  FileText,
} from "lucide-react";
import { useHistoryStore } from "../../../store/useHistoryStore";
import { BonusBadge } from "../../../components/bonus/BonusComponents";
import { answerArguments, vetoArguments, negotiationScript, anchorPhrases, NegotiationArgument } from "../../../data/negotiation";
import { getTechnicalDiscount, parseNumberBR, formatBRL, displayKg } from "../../../utils/pricing";
import { calculateFinalScore, getDecision, getStrengths } from "../../../utils/calculations";
import { AnimalEvaluation, Decision } from "../../../types/checklist";

const decisionBadges: Record<Decision, { label: string; classes: string }> = {
  boa_compra: { label: "Boa Compra", classes: "bg-green-100 text-brand-green border-green-200" },
  comprar_com_cautela: { label: "Comprar com Cautela", classes: "bg-amber-100 text-brand-yellow border-amber-200" },
  comprar_com_desconto: { label: "Comprar com Desconto", classes: "bg-orange-100 text-brand-brown border-orange-200" },
  nao_comprar: { label: "Não Comprar", classes: "bg-red-100 text-brand-red border-red-200" },
};

const buildArguments = (evalItem: AnimalEvaluation): NegotiationArgument[] => {
  const args: NegotiationArgument[] = [];

  (Object.entries(evalItem.vetos) as [keyof AnimalEvaluation["vetos"], boolean][]).forEach(([key, marked]) => {
    if (marked) args.push(vetoArguments[key]);
  });

  (Object.entries(evalItem.answers) as [keyof AnimalEvaluation["answers"], string][]).forEach(([key, level]) => {
    const entry = answerArguments[key];
    if (!entry) return;
    if (level === "ruim") args.push(entry.ruim);
    else if (level === "medio") args.push(entry.medio);
  });

  return args;
};

function NegociacaoContent() {
  const searchParams = useSearchParams();
  const { evaluations } = useHistoryStore();
  const [mounted, setMounted] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const id = searchParams.get("avaliacao");
    if (id && evaluations.some(e => e.id === id)) {
      setSelectedId(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  if (!mounted) return <div className="p-8 text-center text-brand-gray">Carregando kit...</div>;

  const selected = evaluations.find(e => e.id === selectedId) ?? null;
  const args = selected ? buildArguments(selected) : [];
  const discount = selected ? getTechnicalDiscount(selected) : null;
  const strengths = selected ? getStrengths(selected) : [];
  const pedido = selected ? parseNumberBR(selected.price) : null;
  const decision = selected ? getDecision(selected) : null;

  return (
    <div className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 page-wash">
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="bg-brand-red text-white p-3 rounded-xl shadow-md print:hidden">
          <Handshake className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-dark-green">Kit de Negociação</h1>
          <p className="text-brand-gray text-sm mt-0.5">Argumentos técnicos gerados a partir da sua avaliação</p>
        </div>
        <BonusBadge className="print:hidden" />
      </div>

      {/* Evaluation selector */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 space-y-2 print:hidden">
        <label className="text-sm font-semibold text-brand-dark-green">Escolha uma avaliação salva</label>
        <select
          className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-brand-gray focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-colors shadow-sm"
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
        >
          <option value="">Selecione um animal avaliado...</option>
          {evaluations.map(e => (
            <option key={e.id} value={e.id}>
              {e.animalName || 'Sem identificação'} — nota {calculateFinalScore(e)}/50
            </option>
          ))}
        </select>
        {evaluations.length === 0 && (
          <p className="text-xs text-brand-gray/80">
            Você ainda não tem avaliações salvas.{' '}
            <Link href="/avaliar" className="font-semibold text-brand-green underline">Faça a primeira avaliação</Link>{' '}
            para gerar o kit.
          </p>
        )}
      </div>

      {/* Generated kit */}
      {selected && decision && discount && (
        <div className="space-y-5">
          {/* Animal header */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-3 min-w-0">
              {selected.photo && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={selected.photo}
                  alt={`Foto de ${selected.animalName || 'animal'}`}
                  className="shrink-0 h-14 w-14 rounded-full object-cover ring-2 ring-brand-dark-green/20"
                />
              )}
              <div className="min-w-0">
                <h2 className="font-display text-xl font-bold text-brand-dark-green truncate">
                  {selected.animalName || "Animal sem identificação"}
                </h2>
                <p className="text-xs font-semibold text-brand-gray/80 uppercase tracking-wide mt-1">
                  {selected.breedGroup.replace(/_/g, ' ')} • {selected.objective.replace(/_/g, ' ')}
                  {selected.weight ? ` • ${displayKg(selected.weight)}` : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`inline-block text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full border ${decisionBadges[decision].classes}`}>
                {decisionBadges[decision].label}
              </span>
              <p className="leading-none">
                <span className="text-2xl font-bold text-brand-dark-green">{discount.score}</span>
                <span className="text-sm text-gray-400"> /50</span>
              </p>
            </div>
          </div>

          {/* Suggested discount */}
          <div className="rounded-xl bg-brand-dark-green text-white p-5 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">Desconto técnico sugerido</p>
            <p className="font-display text-4xl font-bold mt-1">{discount.percent}%</p>
            {pedido !== null && discount.percent > 0 && (
              <p className="text-sm opacity-90 mt-2">
                Sobre o preço pedido de {formatBRL(pedido)}, isso significa negociar{' '}
                <strong>{formatBRL(pedido * (discount.percent / 100))}</strong> para baixo
                (alvo: {formatBRL(pedido * (1 - discount.percent / 100))}).
              </p>
            )}
            {discount.blocked && (
              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-red-500/25 text-red-100 px-4 py-2 text-sm font-semibold">
                <XCircle className="h-4 w-4" />
                Há veto marcado: a recomendação do método é NÃO COMPRAR.
              </p>
            )}
          </div>

          {/* Strengths (fair play) */}
          {strengths.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-brand-dark-green flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-brand-green" />
                Reconheça primeiro os pontos fortes
              </h3>
              <ul className="space-y-2 text-sm text-brand-gray">
                {strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand-green mt-0.5">•</span>{s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technical arguments */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-bold text-brand-dark-green flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-brand-red" />
              Argumentos técnicos para o desconto
            </h3>
            {args.length > 0 ? (
              <ol className="space-y-4">
                {args.map((arg, i) => (
                  <li key={i} className="flex gap-3">
                    <span className={`shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${arg.title.startsWith('VETO') ? 'bg-red-100 text-brand-red' : 'bg-amber-100 text-brand-yellow'}`}>
                      {i + 1}
                    </span>
                    <div>
                      <p className={`text-sm font-bold ${arg.title.startsWith('VETO') ? 'text-brand-red' : 'text-brand-dark-green'}`}>{arg.title}</p>
                      <p className="text-sm text-brand-gray leading-relaxed mt-0.5">“{arg.argument}”</p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-brand-gray">
                Esta avaliação não tem pontos médios, ruins ou vetos — o animal foi bem avaliado.
                Negocie pelo valor de mercado usando a <Link href={`/bonus/calculadora?avaliacao=${selected.id}`} className="font-semibold text-brand-green underline">Calculadora de Preço Máximo</Link>.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Static: negotiation script */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-bold text-brand-dark-green flex items-center gap-2 mb-4">
          <ListChecks className="h-5 w-5 text-brand-green" />
          Roteiro de negociação
        </h3>
        <ol className="space-y-4">
          {negotiationScript.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-brand-dark-green text-white text-xs font-bold">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-bold text-brand-dark-green">{item.step}</p>
                <p className="text-sm text-brand-gray leading-relaxed mt-0.5">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Static: anchor phrases */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-bold text-brand-dark-green flex items-center gap-2 mb-4">
          <Quote className="h-5 w-5 text-brand-gold" />
          Frases prontas para ancorar a conversa
        </h3>
        <ul className="space-y-3">
          {anchorPhrases.map((phrase, i) => (
            <li key={i} className="rounded-lg bg-brand-cream border border-brand-gold/30 p-3 text-sm text-brand-brown italic leading-relaxed">
              {phrase}
            </li>
          ))}
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
          Imprimir kit
        </button>
      </div>
    </div>
  );
}

export default function NegociacaoPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-brand-gray">Carregando kit...</div>}>
      <NegociacaoContent />
    </Suspense>
  );
}
