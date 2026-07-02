import { AnimalEvaluation } from "../types/checklist";

type AnswerKey = keyof AnimalEvaluation["answers"];
type VetoKey = keyof AnimalEvaluation["vetos"];

export type NegotiationArgument = {
  title: string;
  argument: string;
};

/**
 * Frases de argumento técnico por item avaliado, para níveis "medio" e "ruim".
 * Usadas pelo Kit de Negociação para montar o roteiro a partir da avaliação.
 */
export const answerArguments: Partial<Record<AnswerKey, { medio: NegotiationArgument; ruim: NegotiationArgument }>> = {
  estrutura: {
    medio: {
      title: "Estrutura apenas razoável",
      argument: "A estrutura está funcional, mas não é destaque. Animal assim não pode ser pago como animal de ponta.",
    },
    ruim: {
      title: "Estrutura comprometida",
      argument: "Animal desproporcional ou fraco de estrutura rende menos carcaça e vale menos por arroba no acerto final.",
    },
  },
  precocidade: {
    medio: {
      title: "Precocidade mediana",
      argument: "Falta acabamento e expressão. Vai precisar de mais tempo de cocho ou pasto, e tempo é custo.",
    },
    ruim: {
      title: "Animal tardio",
      argument: "Animal pernalta e de costela rasa termina tarde. Cada mês a mais de engorda come a margem do negócio.",
    },
  },
  musculosidade: {
    medio: {
      title: "Musculatura sem expressão",
      argument: "A musculatura é aceitável, mas sem expressão. O rendimento de carcaça tende a ficar abaixo da média.",
    },
    ruim: {
      title: "Pouca carne aparente",
      argument: "Animal vazio de posterior e fraco de lombo rende pouca carne. O frigorífico paga por carcaça, não por volume.",
    },
  },
  umbigo: {
    medio: {
      title: "Umbigo fora do ideal",
      argument: "O umbigo está fora do ideal. Em pasto sujo ou manejo intenso isso vira risco de lesão e custo veterinário.",
    },
    ruim: {
      title: "Umbigo/prepúcio de risco",
      argument: "Umbigo penduloso ou lesionado é porta aberta para trauma e infecção. Esse risco precisa vir descontado no preço.",
    },
  },
  racial: {
    medio: {
      title: "Padrão racial com falhas",
      argument: "O animal atende o objetivo, mas tem falhas de padrão. Na revenda, animal descaracterizado sofre deságio.",
    },
    ruim: {
      title: "Fora do tipo comercial",
      argument: "Animal fora do tipo desejado tem baixa aceitação comercial. Quem compra assume o deságio da revenda.",
    },
  },
  aprumos: {
    medio: {
      title: "Aprumos com ressalvas",
      argument: "Os aprumos têm ressalvas. Qualquer agravamento vira animal manco, e animal manco não caminha para o cocho.",
    },
    ruim: {
      title: "Aprumos comprometidos",
      argument: "Aprumos ruins encurtam a vida útil e aumentam o custo de manejo. Isso precisa refletir no valor, e forte.",
    },
  },
  sexualidade: {
    medio: {
      title: "Expressão sexual mediana",
      argument: "A expressão sexual é apenas mediana para a categoria. Para reprodução, isso reduz o valor do animal.",
    },
    ruim: {
      title: "Expressão sexual comprometida",
      argument: "Expressão sexual comprometida coloca em dúvida a função do animal. O preço não pode ser de animal apto.",
    },
  },
  sanidade: {
    medio: {
      title: "Sanidade com dúvidas",
      argument: "Há sinais que pedem atenção sanitária. Vacina, vermífugo e quarentena são custos que entram na conta.",
    },
    ruim: {
      title: "Sanidade preocupante",
      argument: "A condição sanitária aparente é ruim. Tratamento, quarentena e risco de perda derrubam o valor real do lote.",
    },
  },
  idadePesoObjetivo: {
    medio: {
      title: "Idade/peso fora do ponto",
      argument: "A relação idade × peso está fora do ponto ideal para o objetivo. Isso significa mais tempo até o resultado.",
    },
    ruim: {
      title: "Atrasado para o objetivo",
      argument: "O animal está atrasado para a idade. Ganho composto perdido não se recupera — o preço precisa compensar.",
    },
  },
  temperamento: {
    medio: {
      title: "Temperamento agitado",
      argument: "Animal agitado estressa o lote, perde peso no manejo e danifica instalação. Isso tem custo mensurável.",
    },
    ruim: {
      title: "Temperamento difícil",
      argument: "Animal de manejo difícil é risco para peão, cerca e balança. Ninguém paga preço cheio por dor de cabeça.",
    },
  },
  procedencia: {
    medio: {
      title: "Procedência com lacunas",
      argument: "Sem histórico completo de procedência, quem compra assume o risco sanitário e de manejo — e risco tem preço.",
    },
    ruim: {
      title: "Procedência desconhecida",
      argument: "Procedência desconhecida é risco total: sanidade, manejo e até questão de documentação. O desconto é obrigatório.",
    },
  },
  precoMargem: {
    medio: {
      title: "Margem apertada",
      argument: "No preço pedido, a margem da operação fica apertada demais. O negócio só fecha com ajuste de valor.",
    },
    ruim: {
      title: "Preço sem margem",
      argument: "No preço atual, a conta simplesmente não fecha. Sem reajuste, não há negócio possível.",
    },
  },
};

/**
 * Argumentos para vetos marcados — nestes casos a recomendação do método
 * é não comprar; o argumento serve para encerrar ou renegociar do zero.
 */
export const vetoArguments: Record<VetoKey, NegotiationArgument> = {
  mancoOuCascoGrave: {
    title: "VETO: Animal manco ou casco grave",
    argument: "Animal manco ou com casco gravemente comprometido não sustenta engorda nem reprodução. Não há preço que pague esse risco.",
  },
  prepucioUmbigoGrave: {
    title: "VETO: Prepúcio/umbigo grave",
    argument: "Lesão ou prolapso de prepúcio/umbigo é problema veterinário instalado, não risco futuro. Compra descartada tecnicamente.",
  },
  doenteOuDebilitado: {
    title: "VETO: Animal doente ou debilitado",
    argument: "Animal visivelmente doente pode contaminar o lote inteiro. O prejuízo potencial supera qualquer desconto.",
  },
  temperamentoAgressivo: {
    title: "VETO: Temperamento agressivo",
    argument: "Animal perigoso para manejo é risco de acidente com gente e estrutura. Não entra na conta de compra.",
  },
  reprodutorSemExame: {
    title: "VETO: Reprodutor sem exame",
    argument: "Reprodutor sem andrológico é loteria. Ou o vendedor apresenta o exame, ou o animal vale preço de boi de corte.",
  },
  matrizComSuspeitaReprodutiva: {
    title: "VETO: Matriz com suspeita reprodutiva",
    argument: "Matriz com suspeita reprodutiva sem avaliação específica pode ser vazia permanente. Sem diagnóstico, não há negócio.",
  },
  precoSemMargem: {
    title: "VETO: Preço sem margem",
    argument: "O preço pedido não deixa margem nenhuma para o objetivo. Comprar assim é trabalhar para o vendedor.",
  },
};

/** Roteiro estático de condução da negociação. */
export const negotiationScript: { step: string; detail: string }[] = [
  {
    step: "Avalie antes de falar de preço",
    detail: "Complete o checklist com calma, na frente do animal. Quem avalia primeiro negocia com fatos, não com impressão.",
  },
  {
    step: "Apresente os pontos fortes primeiro",
    detail: "Reconheça o que o animal tem de bom. Isso mostra avaliação justa e desarma a defesa do vendedor.",
  },
  {
    step: "Liste os pontos técnicos, um a um",
    detail: "Use os argumentos deste kit. Fale de custo e risco, nunca de 'achar caro'. Fato técnico não se discute, preço sim.",
  },
  {
    step: "Ancore com o desconto sugerido",
    detail: "Apresente o percentual calculado pelo sistema como referência técnica, não como opinião pessoal.",
  },
  {
    step: "Dê uma saída honrosa",
    detail: "Proponha alternativas: desconto no lote, prazo, ou inclusão de outro animal. O vendedor precisa sair bem da conversa.",
  },
  {
    step: "Saiba ir embora",
    detail: "Se houver veto marcado ou a conta não fechar, agradeça e saia. O melhor negócio às vezes é o que não se faz.",
  },
];

/** Frases prontas para ancorar a conversa. */
export const anchorPhrases: string[] = [
  "“O animal é bom, mas esses pontos que te mostrei têm custo. Minha conta chega em R$ X — consegue trabalhar nesse valor?”",
  "“Não estou achando caro, estou somando o risco. Quem assume o risco sou eu, então ele entra no preço.”",
  "“Pelo padrão do lote, esse aqui está abaixo dos outros. Ou ajusta o valor dele, ou fazemos a média do lote.”",
  "“Fecho hoje se sair por R$ X. Acima disso, prefiro esperar outra oportunidade.”",
];
