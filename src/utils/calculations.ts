import { AnimalEvaluation, BreedGroup, PurchaseObjective, Decision, AnswerLevel } from "../types/checklist";
import { epmurasQuestions, commercialQuestions } from "../data/questions";
import { breedGroupsInfo } from "../data/breeds";
import { objectiveInfo } from "../data/objectives";
import { vetosList } from "../data/vetos";

const getAnswerPoints = (questionKey: string, answer: AnswerLevel, type: "epmuras" | "commercial"): number => {
  if (answer === "nao_informado") return 0;
  
  const questions = type === "epmuras" ? epmurasQuestions : commercialQuestions;
  const q = questions.find(q => q.key === questionKey);
  
  if (!q) return 0;
  return q.answers[answer].points;
};

export const calculateEpmurasScore = (evaluation: AnimalEvaluation): number => {
  const ans = evaluation.answers;
  
  const estBase = getAnswerPoints("estrutura", ans.estrutura, "epmuras");
  const precocidade = getAnswerPoints("precocidade", ans.precocidade, "epmuras");
  
  let ef = estBase;
  if (estBase > precocidade) {
    ef = estBase - 1;
  }
  if (estBase < precocidade) {
    ef = estBase + 1;
  }
  ef = Math.max(0, Math.min(6, ef));
  
  const musculosidade = getAnswerPoints("musculosidade", ans.musculosidade, "epmuras");
  const umbigo = getAnswerPoints("umbigo", ans.umbigo, "epmuras");
  const racial = getAnswerPoints("racial", ans.racial, "epmuras");
  const aprumos = getAnswerPoints("aprumos", ans.aprumos, "epmuras");
  const sexualidade = getAnswerPoints("sexualidade", ans.sexualidade, "epmuras");
  
  return ef + precocidade + musculosidade + umbigo + racial + aprumos + sexualidade;
};

export const calculateCommercialScore = (evaluation: AnimalEvaluation): number => {
  const ans = evaluation.answers;
  
  const sanidade = getAnswerPoints("sanidade", ans.sanidade, "commercial");
  const idadePeso = getAnswerPoints("idadePesoObjetivo", ans.idadePesoObjetivo, "commercial");
  const temperamento = getAnswerPoints("temperamento", ans.temperamento, "commercial");
  const procedencia = getAnswerPoints("procedencia", ans.procedencia, "commercial");
  const precoMargem = getAnswerPoints("precoMargem", ans.precoMargem, "commercial");
  
  return sanidade + idadePeso + temperamento + procedencia + precoMargem;
};

export const calculateFinalScore = (evaluation: AnimalEvaluation): number => {
  return calculateEpmurasScore(evaluation) + calculateCommercialScore(evaluation);
};

export const hasAutomaticVeto = (evaluation: AnimalEvaluation): boolean => {
  return Object.values(evaluation.vetos).some(v => v === true);
};

export const getDecision = (evaluation: AnimalEvaluation): Decision => {
  if (hasAutomaticVeto(evaluation)) {
    return "nao_comprar";
  }
  
  const score = calculateFinalScore(evaluation);
  
  if (score >= 43) return "boa_compra";
  if (score >= 36) return "comprar_com_cautela";
  if (score >= 28) return "comprar_com_desconto";
  return "nao_comprar";
};

export const getDecisionText = (decision: Decision, hasVeto: boolean): string => {
  if (hasVeto) {
    return "Não comprar. Um ou mais vetos críticos foram marcados. A pontuação visual não deve superar risco grave de sanidade, funcionalidade, reprodução, manejo ou margem.";
  }
  switch (decision) {
    case "boa_compra":
      return "Boa compra. Animal bem avaliado visualmente, funcional e comercialmente interessante.";
    case "comprar_com_cautela":
      return "Compra possível, mas exige cautela. Negocie preço, confirme informações e avalie o risco.";
    case "comprar_com_desconto":
      return "Compra arriscada. Só faz sentido com desconto forte ou objetivo muito específico.";
    case "nao_comprar":
      return "Não comprar. O risco visual, funcional ou comercial está alto demais.";
  }
};

export const getEpmurasClassification = (score: number): string => {
  if (score >= 32) return "Excelente";
  if (score >= 29) return "Muito bom";
  if (score >= 25) return "Bom";
  if (score >= 20) return "Regular";
  return "Inferior";
};

export type ScoreBreakdownItem = {
  key: string;
  label: string;
  group: "epmuras" | "comercial";
  level: AnswerLevel;
  points: number;
  max: number;
};

const breakdownLabels: Record<string, string> = {
  estrutura: "Estrutura",
  precocidade: "Precocidade",
  musculosidade: "Musculosidade",
  umbigo: "Umbigo",
  racial: "Racial",
  aprumos: "Aprumos",
  sexualidade: "Sexualidade",
  sanidade: "Sanidade",
  idadePesoObjetivo: "Idade/Peso",
  temperamento: "Temperamento",
  procedencia: "Procedência",
  precoMargem: "Preço/Margem",
};

/**
 * Pontuação bruta por característica (para gráficos). O máximo de cada item
 * é a pontuação da resposta "bom". Obs.: o total oficial usa o ajuste de
 * estrutura funcional, então pode diferir ±1 do somatório destes itens.
 */
export const getScoreBreakdown = (evaluation: AnimalEvaluation): ScoreBreakdownItem[] => {
  const build = (questions: typeof epmurasQuestions, group: "epmuras" | "comercial") =>
    questions.map((q) => {
      const level = evaluation.answers[q.key as keyof typeof evaluation.answers];
      return {
        key: q.key,
        label: breakdownLabels[q.key] ?? q.key,
        group,
        level,
        points: level === "nao_informado" ? 0 : q.answers[level].points,
        max: q.answers.bom.points,
      };
    });

  return [...build(epmurasQuestions, "epmuras"), ...build(commercialQuestions, "comercial")];
};

export const getBreedGuidance = (breedGroup: BreedGroup): string => {
  return breedGroupsInfo[breedGroup]?.guidance || breedGroupsInfo.nao_informado.guidance;
};

export const getObjectiveGuidance = (objective: PurchaseObjective): string => {
  return objectiveInfo[objective]?.guidance || objectiveInfo.nao_informado.guidance;
};

export const getStrengths = (evaluation: AnimalEvaluation): string[] => {
  const strengths: string[] = [];
  const ans = evaluation.answers;
  
  if (ans.estrutura === "bom") strengths.push("Estrutura equilibrada e funcional.");
  if (ans.precocidade === "bom") strengths.push("Boa precocidade visual.");
  if (ans.musculosidade === "bom") strengths.push("Excelente distribuição muscular.");
  if (ans.sanidade === "bom") strengths.push("Sanidade aparente muito boa.");
  if (ans.temperamento === "bom") strengths.push("Temperamento dócil e manejável.");
  
  return strengths;
};

export const getWarnings = (evaluation: AnimalEvaluation): string[] => {
  const warnings: string[] = [];
  const ans = evaluation.answers;
  
  if (ans.precocidade === "ruim") warnings.push("Animal parece ser muito tardio.");
  if (ans.musculosidade === "ruim") warnings.push("Musculosidade abaixo do ideal.");
  if (ans.umbigo === "ruim") warnings.push("Umbigo/prepúcio com risco funcional.");
  if (ans.aprumos === "ruim") warnings.push("Problemas de locomoção ou aprumos identificados.");
  if (ans.sexualidade === "ruim") warnings.push("Expressão sexual comprometida.");
  if (ans.sanidade === "ruim") warnings.push("Sanidade aparente preocupante.");
  if (ans.temperamento === "ruim") warnings.push("Animal agitado ou de difícil manejo.");
  if (ans.precoMargem === "ruim") warnings.push("Preço não parece compensar o risco.");
  
  return warnings;
};
