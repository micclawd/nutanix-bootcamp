"use client";

import { useState, useEffect } from "react";
import { CurriculumPath } from "@/components/bootcamp/curriculum-path";
import { LessonPlayer } from "@/components/bootcamp/lesson-player";
import { useBootcampStore } from "@/lib/bootcamp-store";
import { allLessonIds } from "@/lib/curriculum";
import { Zap, BookOpen, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type View = { kind: "path" } | { kind: "lesson"; lessonId: string };

export default function Home() {
  const [view, setView] = useState<View>({ kind: "path" });
  const { xp, completedLessons } = useBootcampStore();

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-5xl px-4 py-2.5 flex items-center justify-between gap-2">
          <button
            onClick={() => setView({ kind: "path" })}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 text-white glow-cyan">
              <Zap className="h-4 w-4" />
            </div>
            <div className="text-left">
              <h1 className="font-bold text-sm leading-none">
                Nutanix Bootcamp
              </h1>
              <p className="text-xs text-muted-foreground leading-none mt-0.5">
                Learn by doing · from zero
              </p>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="gap-1 text-primary border-primary/40 bg-primary/5"
            >
              <Zap className="h-3 w-3" />
              {xp} XP
            </Badge>
            <Badge variant="outline" className="gap-1">
              <BookOpen className="h-3 w-3" />
              {completedLessons.length}/{allLessonIds.length}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto max-w-5xl px-4 py-6">
        {view.kind === "path" && (
          <CurriculumPath
            onSelectLesson={(lessonId) => setView({ kind: "lesson", lessonId })}
          />
        )}
        {view.kind === "lesson" && (
          <LessonPlayer
            lessonId={view.lessonId}
            onNavigateToLesson={(lessonId) => setView({ kind: "lesson", lessonId })}
            onBackToPath={() => setView({ kind: "path" })}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 mt-auto">
        <div className="container mx-auto max-w-5xl px-4 py-4 text-center text-xs text-muted-foreground">
          Built for self-study · Content based on publicly available Nutanix
          documentation · Verify against the latest docs before any production
          deployment.
        </div>
      </footer>
    </div>
  );
}
