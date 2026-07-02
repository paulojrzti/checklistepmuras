import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TrainingState {
  watchedLessons: string[];
  toggleWatched: (lessonId: string) => void;
  markWatched: (lessonId: string) => void;
}

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set) => ({
      watchedLessons: [],
      toggleWatched: (lessonId) => set((state) => ({
        watchedLessons: state.watchedLessons.includes(lessonId)
          ? state.watchedLessons.filter(id => id !== lessonId)
          : [...state.watchedLessons, lessonId],
      })),
      markWatched: (lessonId) => set((state) => ({
        watchedLessons: state.watchedLessons.includes(lessonId)
          ? state.watchedLessons
          : [...state.watchedLessons, lessonId],
      })),
    }),
    {
      name: 'epmuras-training-progress',
    }
  )
);
