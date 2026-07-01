import { BreedGroup } from "../types/checklist";

export const breedGroupsInfo: Record<BreedGroup, { label: string; guidance: string }> = {
  zebuina: {
    label: "Zebuínas (Nelore, Brahman, Guzerá, etc.)",
    guidance: "Em zebuínos, dê atenção especial à funcionalidade do umbigo/prepúcio, aprumos, rusticidade, caracterização racial e equilíbrio entre estrutura e precocidade.",
  },
  taurina_britanica: {
    label: "Taurinas Britânicas (Angus, Hereford, etc.)",
    guidance: "Em taurinos britânicos, valorize precocidade, acabamento, profundidade corporal, docilidade e adaptação ao ambiente. Não penalize ausência de características zebuínas, como cupim.",
  },
  taurina_continental: {
    label: "Taurinas Continentais (Charolês, Simental, etc.)",
    guidance: "Em taurinos continentais, estrutura e musculosidade são importantes, mas evite confundir tamanho exagerado com eficiência. Penalize animais tardios, pernalta ou muito exigentes para o sistema.",
  },
  sintetica_adaptada: {
    label: "Sintéticas / Adaptadas (Brangus, Braford, Senepol, etc.)",
    guidance: "Em raças sintéticas ou adaptadas, procure equilíbrio: rusticidade, precocidade, fertilidade, musculatura e adaptação ao sistema de produção.",
  },
  cruzado_comercial: {
    label: "Cruzado Comercial / Sem Raça Definida",
    guidance: "Em cruzados comerciais, não cobre pureza racial. Avalie uniformidade, tipo comercial, adaptação, sanidade e potencial de desempenho.",
  },
  nao_informado: {
    label: "Não informado",
    guidance: "Raça ou grupo racial não informado. A avaliação pode continuar, mas o app não deve interpretar padrão racial específico. No item Racial, avalie apenas tipo comercial e funcionalidade.",
  },
};
