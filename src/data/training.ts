export type TrainingLesson = {
  id: string;
  title: string;
  description: string;
  duration?: string;
  /**
   * ID do vídeo no YouTube (o trecho após "watch?v=" na URL).
   * Ex.: para https://www.youtube.com/watch?v=dQw4w9WgXcQ use "dQw4w9WgXcQ".
   * Enquanto for null, a aula aparece como "Vídeo em breve".
   */
  youtubeId: string | null;
};

export const trainingLessons: TrainingLesson[] = [
  {
    id: "introducao",
    title: "Introdução ao Método EPMURAS",
    description: "O que é o método, por que ele funciona na compra de gado e como o sistema organiza a decisão.",
    youtubeId: null,
  },
  {
    id: "identificacao",
    title: "Etapa 1 — Identificação do Animal",
    description: "Como preencher nome, lote, sexo, idade, peso e preço para não se perder nas avaliações.",
    youtubeId: null,
  },
  {
    id: "raca-objetivo",
    title: "Etapa 2 — Raça e Objetivo",
    description: "Por que o grupo racial e o objetivo de compra mudam os critérios da avaliação.",
    youtubeId: null,
  },
  {
    id: "epm",
    title: "Etapa 3 — Estrutura, Precocidade e Musculosidade",
    description: "Como avaliar E, P e M no curral, com exemplos práticos de Bom, Médio e Ruim.",
    youtubeId: null,
  },
  {
    id: "uras",
    title: "Etapa 4 — Umbigo, Racial, Aprumos e Sexualidade",
    description: "Os itens que mais geram prejuízo silencioso e como identificá-los rapidamente.",
    youtubeId: null,
  },
  {
    id: "filtro-comercial",
    title: "Etapa 5 — Filtro Comercial",
    description: "Sanidade, temperamento, procedência e margem: o que o mercado cobra além do visual.",
    youtubeId: null,
  },
  {
    id: "vetos",
    title: "Etapa 6 — Vetos Automáticos",
    description: "Quando um único problema encerra a negociação, independente da pontuação.",
    youtubeId: null,
  },
  {
    id: "resultado",
    title: "Etapa 7 — Lendo o Resultado Final",
    description: "Como interpretar a nota, os pontos fortes e os alertas para tomar a decisão de compra.",
    youtubeId: null,
  },
];
