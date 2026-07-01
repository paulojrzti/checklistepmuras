import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AnimalEvaluation } from '../types/checklist';

interface HistoryState {
  evaluations: AnimalEvaluation[];
  addEvaluation: (evaluation: AnimalEvaluation) => void;
  removeEvaluation: (id: string) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      evaluations: [],
      addEvaluation: (evaluation) => set((state) => {
        // If an evaluation with the same ID already exists, replace it. Otherwise add new.
        const exists = state.evaluations.some(e => e.id === evaluation.id);
        if (exists) {
          return { evaluations: state.evaluations.map(e => e.id === evaluation.id ? evaluation : e) };
        }
        return { evaluations: [evaluation, ...state.evaluations] };
      }),
      removeEvaluation: (id) => set((state) => ({
        evaluations: state.evaluations.filter((e) => e.id !== id)
      })),
      clearHistory: () => set({ evaluations: [] }),
    }),
    {
      name: 'epmuras-history',
    }
  )
);
