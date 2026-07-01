export type BreedGroup =
  | "zebuina"
  | "taurina_britanica"
  | "taurina_continental"
  | "sintetica_adaptada"
  | "cruzado_comercial"
  | "nao_informado";

export type PurchaseObjective =
  | "engorda"
  | "recria"
  | "matriz"
  | "reprodutor"
  | "lote_comercial"
  | "leilao"
  | "nao_informado";

export type AnswerLevel = "bom" | "medio" | "ruim" | "nao_informado";

export type Decision =
  | "nao_comprar"
  | "comprar_com_desconto"
  | "comprar_com_cautela"
  | "boa_compra";

export type AnimalEvaluation = {
  id: string;
  createdAt: string;

  animalName?: string;
  lot?: string;
  breedGroup: BreedGroup;
  sex: "macho" | "femea" | "nao_informado";
  approximateAge?: string;
  weight?: string;
  location?: string;
  objective: PurchaseObjective;
  price?: string;

  answers: {
    estrutura: AnswerLevel;
    precocidade: AnswerLevel;
    musculosidade: AnswerLevel;
    umbigo: AnswerLevel;
    racial: AnswerLevel;
    aprumos: AnswerLevel;
    sexualidade: AnswerLevel;
    sanidade: AnswerLevel;
    idadePesoObjetivo: AnswerLevel;
    temperamento: AnswerLevel;
    procedencia: AnswerLevel;
    precoMargem: AnswerLevel;
  };

  vetos: {
    mancoOuCascoGrave: boolean;
    prepucioUmbigoGrave: boolean;
    doenteOuDebilitado: boolean;
    temperamentoAgressivo: boolean;
    reprodutorSemExame: boolean;
    matrizComSuspeitaReprodutiva: boolean;
    precoSemMargem: boolean;
  };

  notes?: string;
};
