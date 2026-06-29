"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ExerciseRenderer } from "./exercises";
import { PodcastPlayer } from "./podcast-player";
import { useBootcampStore } from "@/lib/bootcamp-store";
import {
  lessonById,
  moduleById,
  getNextLessonId,
  getPrevLessonId,
  allLessonIds,
  type Lesson,
} from "@/lib/curriculum";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Lock,
  Trophy,
  Clock,
  Zap,
  BookOpen,
  Info,
  AlertTriangle,
  Lightbulb,
  ListChecks,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonPlayerProps {
  lessonId: string;
  onNavigateToLesson: (lessonId: string) => void;
  onBackToPath: () => void;
}

export function LessonPlayer({
  lessonId,
  onNavigateToLesson,
  onBackToPath,
}: LessonPlayerProps) {
  const lesson = lessonById(lessonId);
  const {
    exerciseAttempts,
    completedLessons,
    completeLesson,
    isLessonUnlocked,
  } = useBootcampStore();

  const [forceRender, setForceRender] = useState(0);

  // Derive exercise results from store on each render (no setState in effect)
  const exerciseResults = useMemo(() => {
    if (!lesson) return {};
    const results: Record<string, boolean> = {};
    lesson.exercises.forEach((ex) => {
      const attempt = exerciseAttempts[ex.id];
      if (attempt) {
        results[ex.id] = attempt.correct;
      }
    });
    return results;
  }, [lesson, exerciseAttempts, forceRender]);

  if (!lesson) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">Lesson not found.</p>
          <Button onClick={onBackToPath} className="mt-4">
            Back to curriculum
          </Button>
        </CardContent>
      </Card>
    );
  }

  const lessonModule = moduleById(lesson.module)!;
  const isUnlocked = isLessonUnlocked(lesson.id, allLessonIds);
  const isCompleted = completedLessons.includes(lesson.id);

  if (!isUnlocked) {
    return (
      <Card className="border-amber-500/30">
        <CardContent className="p-12 text-center space-y-3">
          <Lock className="h-10 w-10 mx-auto text-amber-400" />
          <h3 className="text-lg font-semibold">Lesson locked</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Complete the previous lesson to unlock this one. The bootcamp is
            designed linearly — each lesson builds on the previous.
          </p>
          <Button onClick={onBackToPath} variant="outline" className="mt-2">
            Back to curriculum
          </Button>
        </CardContent>
      </Card>
    );
  }

  const completedExercises = lesson.exercises.filter(
    (ex) => exerciseResults[ex.id] !== undefined
  ).length;
  const correctExercises = lesson.exercises.filter(
    (ex) => exerciseResults[ex.id] === true
  ).length;
  const allExercisesDone =
    completedExercises === lesson.exercises.length &&
    correctExercises === lesson.exercises.length;

  const nextLessonId = getNextLessonId(lesson.id);
  const prevLessonId = getPrevLessonId(lesson.id);

  const handleExerciseComplete = (correct: boolean) => {
    // Bump forceRender to refresh exerciseResults (derived from store)
    setTimeout(() => {
      setForceRender((n) => n + 1);
      // Check if all correct now → complete lesson
      const attempt = useBootcampStore.getState().exerciseAttempts;
      const allCorrect = lesson.exercises.every((ex) => attempt[ex.id]?.correct === true);
      if (allCorrect && !completedLessons.includes(lesson.id)) {
        completeLesson(lesson.id, lesson.xp);
      }
    }, 50);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToPath}
          className="text-muted-foreground"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Curriculum
        </Button>

        <div className="flex items-start gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {lessonModule.title}
              </Badge>
              <Badge variant="outline" className="text-xs gap-1">
                <Clock className="h-3 w-3" />
                {lesson.duration}
              </Badge>
              <Badge variant="outline" className="text-xs gap-1 text-primary">
                <Zap className="h-3 w-3" />
                +{lesson.xp} XP
              </Badge>
              {isCompleted && (
                <Badge variant="outline" className="text-xs gap-1 border-emerald-500/30 text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Completed
                </Badge>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {lesson.title}
            </h1>
            <p className="text-muted-foreground mt-1">{lesson.subtitle}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground tabular-nums shrink-0">
            {completedExercises}/{lesson.exercises.length} exercises
          </span>
          <Progress
            value={(completedExercises / lesson.exercises.length) * 100}
            className="h-1.5 flex-1"
          />
          <span className="text-xs text-muted-foreground tabular-nums shrink-0">
            {Math.round((completedExercises / lesson.exercises.length) * 100)}%
          </span>
        </div>
      </div>

      <Separator />

      {/* Podcast player */}
      <PodcastPlayer lessonId={lesson.id} lessonTitle={lesson.title} />

      {/* Theory */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4 text-primary" />
            Theory
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {lesson.theory.map((section, i) => (
            <div key={i} className="space-y-2">
              {section.heading && (
                <h3 className="font-semibold text-sm text-primary/90 uppercase tracking-wide">
                  {section.heading}
                </h3>
              )}
              <p className="text-sm leading-relaxed text-foreground/90">
                {section.body}
              </p>
              {section.callout && (
                <Callout type={section.callout.type} text={section.callout.text} />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Key Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ListChecks className="h-4 w-4 text-primary" />
            Key Terms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {lesson.keyTerms.map((kt, i) => (
            <div key={i} className="border-l-2 border-primary/40 pl-3">
              <div className="font-mono text-sm font-semibold text-primary">
                {kt.term}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">
                {kt.definition}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Exercises */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Practice Exercises</h2>
          <span className="text-xs text-muted-foreground ml-auto">
            Complete all {lesson.exercises.length} to mark this lesson done
          </span>
        </div>

        <div className="space-y-4">
          {lesson.exercises.map((ex, idx) => (
            <ExerciseRenderer
              key={ex.id}
              exercise={ex}
              index={idx}
              total={lesson.exercises.length}
              onComplete={handleExerciseComplete}
              isCompleted={exerciseResults[ex.id] !== undefined}
              wasCorrect={exerciseResults[ex.id] === true}
            />
          ))}
        </div>
      </div>

      {/* Lesson complete banner */}
      {allExercisesDone && (
        <Card className="border-emerald-500/40 bg-emerald-500/5 pulse-glow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-emerald-400">Lesson complete!</h3>
              <p className="text-sm text-muted-foreground">
                You earned <span className="text-primary font-semibold">+{lesson.xp} XP</span>
                {nextLessonId
                  ? ". Keep going — onto the next lesson!"
                  : ". You've completed the entire bootcamp!"}
              </p>
            </div>
            {nextLessonId && (
              <Button
                onClick={() => onNavigateToLesson(nextLessonId)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Next lesson
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Bottom navigation */}
      <div className="flex items-center justify-between gap-2 pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => (prevLessonId ? onNavigateToLesson(prevLessonId) : onBackToPath())}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {prevLessonId ? "Previous" : "Curriculum"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToPath}
          className="text-muted-foreground"
        >
          All lessons
        </Button>
        {nextLessonId ? (
          <Button
            onClick={() => onNavigateToLesson(nextLessonId)}
          >
            Next lesson
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button variant="outline" onClick={onBackToPath}>
            Back to start
          </Button>
        )}
      </div>
    </div>
  );
}

function Callout({ type, text }: { type: "info" | "warning" | "tip"; text: string }) {
  const config = {
    info: { Icon: Info, color: "border-sky-500/30 bg-sky-500/5 text-sky-400", label: "Info" },
    warning: { Icon: AlertTriangle, color: "border-amber-500/30 bg-amber-500/5 text-amber-400", label: "Warning" },
    tip: { Icon: Lightbulb, color: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400", label: "Tip" },
  };
  const { Icon, color, label } = config[type];
  return (
    <div className={cn("p-3 rounded-md border flex items-start gap-2", color)}>
      <Icon className="h-4 w-4 mt-0.5 shrink-0" />
      <div className="flex-1">
        <div className="text-xs font-semibold uppercase tracking-wide mb-0.5">
          {label}
        </div>
        <p className="text-sm leading-relaxed text-foreground/90">{text}</p>
      </div>
    </div>
  );
}
