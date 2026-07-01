import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AnimalEvaluation, AnswerLevel } from '../types/checklist';

// Simpler UUID generation without external dependency
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

interface EvaluationState {
  currentStep: number;
  evaluation: AnimalEvaluation;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateField: <K extends keyof AnimalEvaluation>(field: K, value: AnimalEvaluation[K]) => void;
  updateAnswer: (key: keyof AnimalEvaluation['answers'], value: AnswerLevel) => void;
  updateVeto: (key: keyof AnimalEvaluation['vetos'], value: boolean) => void;
  resetEvaluation: () => void;
}

const initialEvaluation: AnimalEvaluation = {
  id: '',
  createdAt: '',
  breedGroup: 'nao_informado',
  sex: 'nao_informado',
  objective: 'nao_informado',
  answers: {
    estrutura: 'nao_informado',
    precocidade: 'nao_informado',
    musculosidade: 'nao_informado',
    umbigo: 'nao_informado',
    racial: 'nao_informado',
    aprumos: 'nao_informado',
    sexualidade: 'nao_informado',
    sanidade: 'nao_informado',
    idadePesoObjetivo: 'nao_informado',
    temperamento: 'nao_informado',
    procedencia: 'nao_informado',
    precoMargem: 'nao_informado',
  },
  vetos: {
    mancoOuCascoGrave: false,
    prepucioUmbigoGrave: false,
    doenteOuDebilitado: false,
    temperamentoAgressivo: false,
    reprodutorSemExame: false,
    matrizComSuspeitaReprodutiva: false,
    precoSemMargem: false,
  }
};

export const useEvaluationStore = create<EvaluationState>()(
  persist(
    (set) => ({
      currentStep: 1,
      evaluation: { ...initialEvaluation, id: generateId(), createdAt: new Date().toISOString() },
      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 7) })),
      prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
      updateField: (field, value) => set((state) => ({
        evaluation: { ...state.evaluation, [field]: value }
      })),
      updateAnswer: (key, value) => set((state) => ({
        evaluation: {
          ...state.evaluation,
          answers: { ...state.evaluation.answers, [key]: value }
        }
      })),
      updateVeto: (key, value) => set((state) => ({
        evaluation: {
          ...state.evaluation,
          vetos: { ...state.evaluation.vetos, [key]: value }
        }
      })),
      resetEvaluation: () => set({
        currentStep: 1,
        evaluation: { ...initialEvaluation, id: generateId(), createdAt: new Date().toISOString() }
      })
    }),
    {
      name: 'epmuras-current-evaluation',
    }
  )
);
