// Progress store — Zustand + localStorage persistence
// Tracks: flashcards marked known, quiz attempts, completed modules

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ModuleId } from "./nutanix-data";

export interface QuizAttempt {
  questionId: string;
  selectedIndex: number;
  correct: boolean;
  timestamp: number;
}

export interface QuizSessionResult {
  id: string;
  scope: "module" | "mixed";
  scopeId: ModuleId | "mixed";
  total: number;
  correct: number;
  timestamp: number;
  durationMs: number;
}

interface ProgressState {
  // Flashcards — set of concept IDs the user has marked as "known"
  knownConcepts: string[];
  // Set of concept IDs the user has "starred" for review
  starredConcepts: string[];
  // Per-module "studied" — set of module IDs the user has clicked "mark module studied"
  studiedModules: ModuleId[];
  // Quiz attempts (per-question granularity)
  quizAttempts: QuizAttempt[];
  // Quiz session results (per quiz run)
  quizSessions: QuizSessionResult[];
  // Bridge guide entries marked as "reviewed"
  reviewedBridge: string[];

  // Actions
  markConceptKnown: (conceptId: string) => void;
  unmarkConceptKnown: (conceptId: string) => void;
  toggleKnown: (conceptId: string) => void;
  toggleStar: (conceptId: string) => void;
  markModuleStudied: (moduleId: ModuleId) => void;
  unmarkModuleStudied: (moduleId: ModuleId) => void;
  recordQuizAttempt: (attempt: QuizAttempt) => void;
  recordQuizSession: (session: QuizSessionResult) => void;
  markBridgeReviewed: (entryId: string) => void;
  unmarkBridgeReviewed: (entryId: string) => void;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      knownConcepts: [],
      starredConcepts: [],
      studiedModules: [],
      quizAttempts: [],
      quizSessions: [],
      reviewedBridge: [],

      markConceptKnown: (id) =>
        set((s) =>
          s.knownConcepts.includes(id)
            ? s
            : { knownConcepts: [...s.knownConcepts, id] }
        ),
      unmarkConceptKnown: (id) =>
        set((s) => ({
          knownConcepts: s.knownConcepts.filter((c) => c !== id),
        })),
      toggleKnown: (id) =>
        set((s) => ({
          knownConcepts: s.knownConcepts.includes(id)
            ? s.knownConcepts.filter((c) => c !== id)
            : [...s.knownConcepts, id],
        })),
      toggleStar: (id) =>
        set((s) => ({
          starredConcepts: s.starredConcepts.includes(id)
            ? s.starredConcepts.filter((c) => c !== id)
            : [...s.starredConcepts, id],
        })),
      markModuleStudied: (moduleId) =>
        set((s) =>
          s.studiedModules.includes(moduleId)
            ? s
            : { studiedModules: [...s.studiedModules, moduleId] }
        ),
      unmarkModuleStudied: (moduleId) =>
        set((s) => ({
          studiedModules: s.studiedModules.filter((m) => m !== moduleId),
        })),
      recordQuizAttempt: (attempt) =>
        set((s) => ({
          quizAttempts: [
            ...s.quizAttempts.filter((a) => a.questionId !== attempt.questionId),
            attempt,
          ],
        })),
      recordQuizSession: (session) =>
        set((s) => ({
          quizSessions: [...s.quizSessions, session].slice(-200),
        })),
      markBridgeReviewed: (id) =>
        set((s) =>
          s.reviewedBridge.includes(id)
            ? s
            : { reviewedBridge: [...s.reviewedBridge, id] }
        ),
      unmarkBridgeReviewed: (id) =>
        set((s) => ({
          reviewedBridge: s.reviewedBridge.filter((b) => b !== id),
        })),
      resetProgress: () =>
        set({
          knownConcepts: [],
          starredConcepts: [],
          studiedModules: [],
          quizAttempts: [],
          quizSessions: [],
          reviewedBridge: [],
        }),
    }),
    {
      name: "nutanix-study-progress-v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
