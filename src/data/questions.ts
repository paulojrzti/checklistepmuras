export type QuestionItem = {
  key: string;
  question: string;
  /** Imagem comparativa Bom/Médio/Ruim (opcional), em /public. */
  image?: string;
  answers: {
    bom: { points: number; text: string };
    medio: { points: number; text: string };
    ruim: { points: number; text: string };
  };
};

export const epmurasQuestions: QuestionItem[] = [
  {
    key: "estrutura",
    question: "O animal tem tamanho, comprimento e estrutura compatíveis com idade, raça e objetivo?",
    image: "/images/epmuras/estrutura.png",
    answers: {
      bom: { points: 6, text: "Estrutura equilibrada, bom comprimento, bom volume corporal e sem exagero de tamanho." },
      medio: { points: 4, text: "Um pouco pequeno ou um pouco grande, mas ainda funcional para o objetivo." },
      ruim: { points: 2, text: "Muito pequeno, fraco, estreito, desproporcional ou grande demais e tardio." },
    }
  },
  {
    key: "precocidade",
    question: "O animal demonstra precocidade e tendência a terminar bem?",
    image: "/images/epmuras/precocidade.png",
    answers: {
      bom: { points: 6, text: "Costelas profundas, virilha baixa, bom volume e aparência de animal que termina mais cedo." },
      medio: { points: 4, text: "Profundidade e acabamento aceitáveis, mas ainda falta corpo ou expressão." },
      ruim: { points: 2, text: "Pernalta, costela rasa, corpo estreito ou aparência de animal tardio." },
    }
  },
  {
    key: "musculosidade",
    question: "O animal apresenta musculatura bem distribuída?",
    image: "/images/epmuras/musculosidade.png",
    answers: {
      bom: { points: 6, text: "Boa musculatura em posterior, lombo, paleta e garupa, com distribuição equilibrada." },
      medio: { points: 4, text: "Musculatura aceitável, mas sem grande expressão ou com pequenas falhas." },
      ruim: { points: 2, text: "Animal estreito, vazio de posterior, lombo fraco ou pouca carne aparente." },
    }
  },
  {
    key: "umbigo",
    question: "O umbigo, bainha ou prepúcio é funcional e sem risco para o animal?",
    image: "/images/epmuras/umbigo.png",
    answers: {
      bom: { points: 4, text: "Funcional, bem posicionado, sem excesso, sem lesão e sem risco aparente." },
      medio: { points: 2, text: "Levemente maior ou menor que o ideal, mas ainda funcional." },
      ruim: { points: 0, text: "Muito penduloso, lesionado, com prolapso, ferida ou risco de trauma." },
    }
  },
  {
    key: "racial",
    question: "O animal está adequado ao padrão racial ou ao tipo comercial esperado?",
    answers: {
      bom: { points: 4, text: "Muito bem caracterizado para a raça ou cruzamento, uniforme e valorizado comercialmente." },
      medio: { points: 2, text: "Tem pequenas falhas, mas ainda atende ao objetivo de compra." },
      ruim: { points: 1, text: "Descaracterizado, fora do tipo desejado ou com baixa aceitação comercial." },
    }
  },
  {
    key: "aprumos",
    question: "O animal anda bem e tem aprumos funcionais?",
    answers: {
      bom: { points: 4, text: "Anda solto, cascos bons, membros firmes, boas angulações e sem desvios relevantes." },
      medio: { points: 2, text: "Possui pequenos desvios, mas ainda parece funcional." },
      ruim: { points: 1, text: "Manco, casco ruim, jarrete muito fechado ou aberto, quartela caída ou dificuldade de locomoção." },
    }
  },
  {
    key: "sexualidade",
    question: "O animal apresenta características sexuais compatíveis com sexo, idade e objetivo?",
    answers: {
      bom: { points: 4, text: "Macho masculino, testículos adequados; ou fêmea feminina, funcional e compatível com idade." },
      medio: { points: 2, text: "Pequenos detalhes, mas sem comprometimento evidente." },
      ruim: { points: 1, text: "Pouca expressão sexual, genitais anormais, macho afeminado, fêmea masculinizada ou sinal reprodutivo preocupante." },
    }
  }
];

export const commercialQuestions: QuestionItem[] = [
  {
    key: "sanidade",
    question: "O animal aparenta estar saudável?",
    answers: {
      bom: { points: 5, text: "Olho vivo, respiração normal, sem diarreia, sem feridas, casco bom e pelagem aceitável." },
      medio: { points: 3, text: "Pequenos sinais de estresse, parasitas leves ou condição apenas razoável." },
      ruim: { points: 0, text: "Doente, debilitado, tossindo, com diarreia, feridas, casco ruim ou muito parasitado." },
    }
  },
  {
    key: "idadePesoObjetivo",
    question: "O desenvolvimento do animal é coerente com idade, peso e objetivo?",
    answers: {
      bom: { points: 4, text: "Peso e desenvolvimento condizentes com idade e finalidade." },
      medio: { points: 2, text: "Um pouco abaixo do ideal, mas recuperável." },
      ruim: { points: 0, text: "Muito atrasado, idade incompatível, desenvolvimento ruim ou baixa perspectiva." },
    }
  },
  {
    key: "temperamento",
    question: "O animal é manejável?",
    answers: {
      bom: { points: 3, text: "Dócil, atento, mas controlável e seguro no manejo." },
      medio: { points: 1, text: "Agitado, mas ainda controlável." },
      ruim: { points: 0, text: "Muito bravo, agressivo, se joga contra cerca ou oferece risco." },
    }
  },
  {
    key: "procedencia",
    question: "A origem e a documentação são confiáveis?",
    answers: {
      bom: { points: 2, text: "Origem clara, informações confiáveis, vacinação e documentação em ordem." },
      medio: { points: 1, text: "Informações incompletas, mas sem alerta grave." },
      ruim: { points: 0, text: "Sem procedência, sem informação sanitária ou risco documental." },
    }
  },
  {
    key: "precoMargem",
    question: "O preço deixa margem para o objetivo da compra?",
    answers: {
      bom: { points: 2, text: "Preço compatível com qualidade, risco, frete, trato e margem esperada." },
      medio: { points: 1, text: "Preço apertado, mas ainda possível dependendo da estratégia." },
      ruim: { points: 0, text: "Caro demais para o risco ou sem margem comercial." },
    }
  }
];
