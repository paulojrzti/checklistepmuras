import { PurchaseObjective } from "../types/checklist";

export const objectiveInfo: Record<PurchaseObjective, { label: string; guidance: string }> = {
  engorda: {
    label: "Engorda",
    guidance: "Para engorda, o animal precisa ter potencial de ganho, sanidade, bom tipo de carcaça e preço que deixe margem.",
  },
  recria: {
    label: "Recria",
    guidance: "Para recria, procure animais saudáveis, funcionais, com estrutura equilibrada e potencial de desenvolvimento.",
  },
  matriz: {
    label: "Matriz",
    guidance: "Para matriz, não basta ser bonita. Ela precisa ser funcional, feminina, fértil, dócil e adaptada ao sistema.",
  },
  reprodutor: {
    label: "Reprodutor",
    guidance: "Para reprodutor, seja mais rigoroso. Visual não substitui exame andrológico, avaliação sanitária e procedência.",
  },
  lote_comercial: {
    label: "Lote Comercial",
    guidance: "Para lote comercial, o mais importante é padronização, sanidade, potencial de desempenho e viabilidade econômica.",
  },
  leilao: {
    label: "Leilão",
    guidance: "Em leilão, defina o preço máximo antes. Não deixe a disputa fazer você pagar mais do que o animal vale para o seu objetivo.",
  },
  nao_informado: {
    label: "Não informado",
    guidance: "Objetivo não informado. A avaliação pode continuar, mas considere os objetivos genéricos de funcionalidade e comercialização.",
  }
};
