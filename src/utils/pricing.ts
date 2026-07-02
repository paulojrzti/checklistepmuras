import { AnimalEvaluation } from "../types/checklist";
import { calculateFinalScore, hasAutomaticVeto } from "./calculations";

/**
 * Extrai um número de strings livres como "450 kg", "R$ 3.500" ou "3.500,50".
 * Retorna null quando não há número reconhecível.
 */
export const parseNumberBR = (s?: string): number | null => {
  if (!s) return null;
  const match = s.replace(/\s/g, "").match(/-?[\d.,]+/);
  if (!match) return null;

  let raw = match[0];
  const lastComma = raw.lastIndexOf(",");
  const lastDot = raw.lastIndexOf(".");

  if (lastComma > lastDot) {
    // Formato brasileiro: pontos são milhar, vírgula é decimal
    raw = raw.replace(/\./g, "").replace(",", ".");
  } else if (lastDot > -1 && lastComma > -1) {
    // Formato americano: vírgulas são milhar
    raw = raw.replace(/,/g, "");
  } else if (lastDot > -1) {
    // Só ponto: "3.500" é milhar em pt-BR, "3.5" é decimal
    const decimals = raw.length - lastDot - 1;
    if (decimals === 3) raw = raw.replace(/\./g, "");
  } else {
    raw = raw.replace(",", ".");
  }

  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : null;
};

export const formatBRL = (n: number): string =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(n);

export type DiscountReason = { label: string; percent: number };

export type TechnicalDiscount = {
  percent: number;
  reasons: DiscountReason[];
  blocked: boolean;
  score: number;
};

const criticalItemPenalties: { key: keyof AnimalEvaluation["answers"]; label: string; percent: number }[] = [
  { key: "umbigo", label: "Umbigo/prepúcio com risco funcional", percent: 2 },
  { key: "aprumos", label: "Aprumos comprometidos", percent: 2 },
  { key: "sanidade", label: "Sanidade aparente preocupante", percent: 3 },
  { key: "procedencia", label: "Procedência sem confiança", percent: 1 },
];

/**
 * Metodologia do desconto técnico EPMURAS:
 * - Base pela pontuação final (0–50): clamp((45 − nota) × 0,75%, 0–15%).
 *   Nota 45+ = animal vale mercado cheio; cada ponto abaixo de 45 pesa 0,75%.
 * - Acréscimos por itens críticos avaliados como "ruim" (custo/risco real de manejo).
 * - Veto marcado => blocked: a recomendação do método é NÃO COMPRAR.
 */
export const getTechnicalDiscount = (evaluation: AnimalEvaluation): TechnicalDiscount => {
  const score = calculateFinalScore(evaluation);
  const basePercent = Math.min(15, Math.max(0, (45 - score) * 0.75));

  const reasons: DiscountReason[] = [];
  if (basePercent > 0) {
    reasons.push({
      label: `Pontuação final ${score}/50 (base: 0,75% por ponto abaixo de 45)`,
      percent: Math.round(basePercent * 10) / 10,
    });
  }

  for (const item of criticalItemPenalties) {
    if (evaluation.answers[item.key] === "ruim") {
      reasons.push({ label: item.label, percent: item.percent });
    }
  }

  const percent = Math.round(reasons.reduce((sum, r) => sum + r.percent, 0) * 10) / 10;

  return {
    percent,
    reasons,
    blocked: hasAutomaticVeto(evaluation),
    score,
  };
};

export type MaxPriceInput = {
  pesoKg: number;
  rendimentoPct: number;
  precoArroba: number;
  descontoTecnicoPct: number;
  margemPct: number;
};

export type MaxPriceResult = {
  arrobas: number;
  valorMercado: number;
  descontoTecnicoValor: number;
  margemValor: number;
  precoMaximo: number;
};

export const computeMaxPrice = ({ pesoKg, rendimentoPct, precoArroba, descontoTecnicoPct, margemPct }: MaxPriceInput): MaxPriceResult => {
  const arrobas = (pesoKg * (rendimentoPct / 100)) / 15;
  const valorMercado = arrobas * precoArroba;
  const aposDesconto = valorMercado * (1 - descontoTecnicoPct / 100);
  const precoMaximo = aposDesconto * (1 - margemPct / 100);

  return {
    arrobas,
    valorMercado,
    descontoTecnicoValor: valorMercado - aposDesconto,
    margemValor: aposDesconto - precoMaximo,
    precoMaximo,
  };
};
