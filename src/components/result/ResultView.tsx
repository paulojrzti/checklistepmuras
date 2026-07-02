"use client";

import React from 'react';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AnimalEvaluation, AnswerLevel, Decision } from '../../types/checklist';
import {
  getScoreBreakdown,
  ScoreBreakdownItem,
  calculateEpmurasScore,
  calculateCommercialScore,
  calculateFinalScore,
  hasAutomaticVeto,
  getDecision,
  getDecisionText,
  getEpmurasClassification,
  getStrengths,
  getWarnings,
} from '../../utils/calculations';
import { vetosList } from '../../data/vetos';
import { displayKg, displayBRL, displayMeses } from '../../utils/pricing';

/* Cores de status dos gráficos — validadas (contraste/CVD) sobre fundo branco */
const levelChartColor: Record<AnswerLevel, string> = {
  bom: '#1E8A5A',
  medio: '#B7791F',
  ruim: '#B42318',
  nao_informado: '#9CA3AF',
};

const levelLabel: Record<AnswerLevel, string> = {
  bom: 'Bom',
  medio: 'Médio',
  ruim: 'Ruim',
  nao_informado: '—',
};

const decisionRingColor: Record<Decision, string> = {
  boa_compra: '#1E8A5A',
  comprar_com_cautela: '#B7791F',
  comprar_com_desconto: '#7A4E22',
  nao_comprar: '#B42318',
};

const decisionBanner: Record<Decision, string> = {
  boa_compra: 'bg-brand-green text-white',
  comprar_com_cautela: 'bg-brand-yellow text-white',
  comprar_com_desconto: 'bg-brand-brown text-white',
  nao_comprar: 'bg-brand-red text-white',
};

export const ScoreRing = ({
  score,
  max,
  color,
  size = 52,
  strokeWidth = 6,
  children,
}: {
  score: number;
  max: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}) => {
  const radius = (size - strokeWidth) / 2 - 2;
  const circumference = 2 * Math.PI * radius;
  const filled = Math.max(0, Math.min(1, score / max)) * circumference;
  const center = size / 2;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <circle cx={center} cy={center} r={radius} fill="none" stroke="#E5E7EB" strokeWidth={strokeWidth} />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference - filled}`}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

/** Radar do perfil EPMURAS: 7 eixos, cada um normalizado pelo máximo do item. */
const EpmurasRadar = ({ items }: { items: ScoreBreakdownItem[] }) => {
  const size = 280;
  const c = size / 2;
  const r = 96;
  const n = items.length;

  const point = (i: number, frac: number): [number, number] => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
    return [c + Math.cos(angle) * r * frac, c + Math.sin(angle) * r * frac];
  };

  const ringPoints = (frac: number) =>
    items.map((_, i) => point(i, frac).join(',')).join(' ');

  const dataPoints = items.map((item, i) => point(i, item.max > 0 ? item.points / item.max : 0));

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[280px] mx-auto" role="img" aria-label="Perfil EPMURAS por característica">
      {/* Grade */}
      {[1 / 3, 2 / 3, 1].map(frac => (
        <polygon key={frac} points={ringPoints(frac)} fill="none" stroke="#E5E7EB" strokeWidth="1" />
      ))}
      {items.map((_, i) => {
        const [x, y] = point(i, 1);
        return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="#E5E7EB" strokeWidth="1" />;
      })}

      {/* Polígono de dados */}
      <polygon
        points={dataPoints.map(p => p.join(',')).join(' ')}
        fill="#1E8A5A"
        fillOpacity="0.16"
        stroke="#1E8A5A"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {dataPoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill={levelChartColor[items[i].level]} stroke="#FFFFFF" strokeWidth="2" />
      ))}

      {/* Rótulos dos eixos (iniciais EPMURAS) */}
      {items.map((item, i) => {
        const [x, y] = point(i, 1.16);
        return (
          <text
            key={item.key}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-brand-gray"
            fontSize="12"
            fontWeight="700"
          >
            {item.label.charAt(0)}
          </text>
        );
      })}
    </svg>
  );
};

/** Barra horizontal por característica: rótulo, barra pontos/máximo e nível. */
const BreakdownBars = ({ items }: { items: ScoreBreakdownItem[] }) => (
  <div className="space-y-2.5">
    {items.map(item => {
      const frac = item.max > 0 ? item.points / item.max : 0;
      const color = levelChartColor[item.level];
      return (
        <div key={item.key} className="grid grid-cols-[96px_1fr_88px] sm:grid-cols-[110px_1fr_96px] items-center gap-2">
          <span className="text-xs font-semibold text-brand-gray truncate">{item.label}</span>
          <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(frac * 100, 2)}%`, backgroundColor: color }}
            />
          </div>
          <span className="text-xs text-brand-gray/80 flex items-center gap-1.5 justify-end">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: color }} aria-hidden="true" />
            {levelLabel[item.level]}
            <strong className="text-brand-dark-green">{item.points}/{item.max}</strong>
          </span>
        </div>
      );
    })}
  </div>
);

export const ResultView = ({
  evaluation,
  compact = false,
}: {
  evaluation: AnimalEvaluation;
  /** Oculta o banner de decisão (quando já exibido fora, ex.: card do histórico). */
  compact?: boolean;
}) => {
  const epmurasScore = calculateEpmurasScore(evaluation);
  const commercialScore = calculateCommercialScore(evaluation);
  const finalScore = calculateFinalScore(evaluation);
  const hasVeto = hasAutomaticVeto(evaluation);
  const decision = getDecision(evaluation);
  const decisionText = getDecisionText(decision, hasVeto);
  const classification = getEpmurasClassification(epmurasScore);
  const strengths = getStrengths(evaluation);
  const warnings = getWarnings(evaluation);
  const breakdown = getScoreBreakdown(evaluation);
  const epmurasItems = breakdown.filter(i => i.group === 'epmuras');
  const commercialItems = breakdown.filter(i => i.group === 'comercial');
  const ringColor = decisionRingColor[decision];
  const initial = (evaluation.animalName || '?').charAt(0).toUpperCase();

  const infoChips = [
    evaluation.breedGroup !== 'nao_informado' && evaluation.breedGroup.replace(/_/g, ' '),
    evaluation.objective !== 'nao_informado' && evaluation.objective.replace(/_/g, ' '),
    evaluation.sex === 'macho' ? 'Macho' : evaluation.sex === 'femea' ? 'Fêmea' : null,
    evaluation.approximateAge && displayMeses(evaluation.approximateAge),
    evaluation.weight && displayKg(evaluation.weight),
    evaluation.price && displayBRL(evaluation.price),
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-6">

      {/* Identidade do animal */}
      <Card className="overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {evaluation.photo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={evaluation.photo}
              alt={`Foto de ${evaluation.animalName || 'animal'}`}
              className="w-full sm:w-56 aspect-video sm:aspect-square object-cover"
            />
          ) : (
            <div className="w-full sm:w-56 aspect-video sm:aspect-square bg-brand-dark-green flex items-center justify-center">
              <span className="font-display text-6xl font-bold text-brand-beige/90">{initial}</span>
            </div>
          )}
          <div className="flex-1 p-4 sm:p-5 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <h3 className="font-display text-2xl font-bold text-brand-dark-green truncate">
                  {evaluation.animalName || 'Animal sem identificação'}
                </h3>
                {evaluation.lot && <p className="text-sm text-brand-gray/80 mt-0.5">Lote: {evaluation.lot}</p>}
              </div>
              <ScoreRing score={finalScore} max={50} color={ringColor} size={84} strokeWidth={8}>
                <span className="text-xl font-bold text-brand-dark-green leading-none">{finalScore}</span>
                <span className="text-[10px] text-brand-gray/70">/50</span>
              </ScoreRing>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {infoChips.map(chip => (
                <span key={chip} className="rounded-full bg-brand-beige px-3 py-1 text-xs font-semibold text-brand-dark-green uppercase tracking-wide">
                  {chip}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4 max-w-xs">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-brand-gray">EPMURAS</span>
                  <span className="text-brand-gray/70">{epmurasScore}/34</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full bg-brand-dark-green" style={{ width: `${(epmurasScore / 34) * 100}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-brand-gray">Comercial</span>
                  <span className="text-brand-gray/70">{commercialScore}/16</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full bg-brand-gold" style={{ width: `${(commercialScore / 16) * 100}%` }} />
                </div>
              </div>
            </div>
            <div className="mt-3">
              <Badge variant={epmurasScore >= 25 ? 'success' : epmurasScore >= 20 ? 'warning' : 'danger'}>
                EPMURAS: {classification}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Banner de decisão */}
      {!compact && (
        <div className={`rounded-xl border shadow-sm p-6 text-center ${decisionBanner[decision]}`}>
          <h2 className="font-display text-3xl font-bold uppercase mb-2 tracking-wide">
            {decision.replace(/_/g, ' ')}
          </h2>
          <p className="text-lg opacity-90">{decisionText}</p>
        </div>
      )}

      {/* Vetos */}
      {hasVeto && (
        <div className="rounded-xl shadow-sm p-4 border border-brand-red bg-red-50">
          <h4 className="font-bold text-brand-red flex items-center gap-2 mb-2">
            <XCircle className="h-5 w-5" />
            Vetos Identificados
          </h4>
          <ul className="list-disc list-inside text-sm text-red-800 space-y-1">
            {vetosList.filter(v => evaluation.vetos[v.key as keyof typeof evaluation.vetos]).map(v => (
              <li key={v.key}>{v.text}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Perfil radar + barras EPMURAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 sm:p-5">
          <h4 className="font-bold text-brand-dark-green mb-1">Perfil EPMURAS</h4>
          <p className="text-xs text-brand-gray/70 mb-2">Cada eixo mostra a nota da característica em relação ao máximo.</p>
          <EpmurasRadar items={epmurasItems} />
        </Card>
        <Card className="p-4 sm:p-5">
          <h4 className="font-bold text-brand-dark-green mb-4">Pontuação por característica</h4>
          <BreakdownBars items={epmurasItems} />
        </Card>
      </div>

      {/* Barras do filtro comercial */}
      <Card className="p-4 sm:p-5">
        <h4 className="font-bold text-brand-dark-green mb-4">Filtro Comercial</h4>
        <BreakdownBars items={commercialItems} />
      </Card>

      {/* Pontos fortes e de atenção */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
        <Card className="p-4">
          <h4 className="font-bold text-brand-dark-green flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-5 w-5 text-brand-green" />
            Pontos Fortes
          </h4>
          {strengths.length > 0 ? (
            <ul className="space-y-2 text-sm text-brand-gray">
              {strengths.map((s, i) => <li key={i} className="flex items-start gap-2"><span className="text-brand-green mt-0.5">•</span>{s}</li>)}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 italic">Nenhum ponto forte destacado.</p>
          )}
        </Card>

        <Card className="p-4">
          <h4 className="font-bold text-brand-dark-green flex items-center gap-2 mb-3">
            <AlertCircle className="h-5 w-5 text-brand-yellow" />
            Pontos de Atenção
          </h4>
          {warnings.length > 0 ? (
            <ul className="space-y-2 text-sm text-brand-gray">
              {warnings.map((w, i) => <li key={i} className="flex items-start gap-2"><span className="text-brand-yellow mt-0.5">•</span>{w}</li>)}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 italic">Nenhum ponto crítico de atenção.</p>
          )}
        </Card>
      </div>
    </div>
  );
};
