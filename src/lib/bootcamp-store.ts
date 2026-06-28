// Bootcamp progress store — Zustand + localStorage persistence
// Tracks: lesson completion, exercise attempts, XP, current lesson

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ExerciseAttempt {
  exerciseId: string;
  lessonId: string;
  correct: boolean;
  firstTry: boolean;
  timestamp: number;
}

interface BootcampState {
  // Set of lesson IDs the user has completed (all exercises done correctly)
  completedLessons: string[];
  // Exercise attempts (per exercise, last attempt only)
  exerciseAttempts: Record<string, ExerciseAttempt>;
  // Total XP earned
  xp: number;
  // Currently active lesson
  currentLessonId: string | null;

  // Actions
  isLessonUnlocked: (lessonId: string, allLessonIds: string[]) => boolean;
  completeLesson: (lessonId: string, xpEarned: number) => void;
  recordExerciseAttempt: (attempt: ExerciseAttempt, xpReward: number) => void;
  setCurrentLesson: (lessonId: string | null) => void;
  resetProgress: () => void;

  // Internal setters
  _setCompletedLessons: (ids: string[]) => void;
  _setExerciseAttempts: (attempts: Record<string, ExerciseAttempt>) => void;
  _setXp: (xp: number) => void;
}

export const useBootcampStore = create<BootcampState>()(
  persist(
    (set, get) => ({
      completedLessons: [],
      exerciseAttempts: {},
      xp: 0,
      currentLessonId: null,

      isLessonUnlocked: (lessonId, allLessonIds) => {
        // All lessons are always unlocked — free exploration mode.
        // (lessonId and allLessonIds params kept for API compatibility.)
        void lessonId;
        void allLessonIds;
        return true;
      },

      completeLesson: (lessonId, xpEarned) =>
        set((s) => {
          if (s.completedLessons.includes(lessonId)) return s;
          return {
            completedLessons: [...s.completedLessons, lessonId],
            xp: s.xp + xpEarned,
          };
        }),

      recordExerciseAttempt: (attempt, xpReward) =>
        set((s) => {
          const existing = s.exerciseAttempts[attempt.exerciseId];
          // Only award XP on first try
          const isFirstTry = !existing;
          const newAttempts = {
            ...s.exerciseAttempts,
            [attempt.exerciseId]: { ...attempt, firstTry: isFirstTry && attempt.correct },
          };
          const xpDelta = isFirstTry && attempt.correct ? xpReward : 0;
          return {
            exerciseAttempts: newAttempts,
            xp: s.xp + xpDelta,
          };
        }),

      setCurrentLesson: (lessonId) => set({ currentLessonId: lessonId }),

      resetProgress: () =>
        set({
          completedLessons: [],
          exerciseAttempts: {},
          xp: 0,
          currentLessonId: null,
        }),

      _setCompletedLessons: (ids) => set({ completedLessons: ids }),
      _setExerciseAttempts: (attempts) => set({ exerciseAttempts: attempts }),
      _setXp: (xp) => set({ xp }),
    }),
    {
      name: "nutanix-bootcamp-v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
