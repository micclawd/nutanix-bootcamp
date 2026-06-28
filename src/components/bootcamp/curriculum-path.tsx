"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useBootcampStore } from "@/lib/bootcamp-store";
import {
  modules,
  lessonsByModule,
  lessons,
  moduleById,
  allLessonIds,
  type ModuleId,
} from "@/lib/curriculum";
import {
  Network,
  Server,
  Database,
  LayoutDashboard,
  Shield,
  HardDrive,
  Workflow,
  Cloud,
  Lock,
  CheckCircle2,
  Play,
  Zap,
  Trophy,
  Clock,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Network,
  Server,
  Database,
  LayoutDashboard,
  Shield,
  HardDrive,
  Workflow,
  Cloud,
};

interface CurriculumPathProps {
  onSelectLesson: (lessonId: string) => void;
}

export function CurriculumPath({ onSelectLesson }: CurriculumPathProps) {
  const {
    completedLessons,
    exerciseAttempts,
    xp,
    isLessonUnlocked,
    resetProgress,
  } = useBootcampStore();

  const totalLessons = lessons.length;
  const completedCount = completedLessons.length;
  const overallPct = Math.round((completedCount / totalLessons) * 100);
  const totalExercises = lessons.reduce((sum, l) => sum + l.exercises.length, 0);
  const completedExercises = Object.keys(exerciseAttempts).length;

  // Find the next lesson to study (first unlocked, not completed)
  const nextLesson = allLessonIds
    .map((id) => lessons.find((l) => l.id === id)!)
    .find((l) => isLessonUnlocked(l.id, allLessonIds) && !completedLessons.includes(l.id));

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card className="overflow-hidden border-none bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white grid-bg">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary text-sm font-medium">
                <Zap className="h-4 w-4" />
                Interactive Bootcamp
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Nutanix from Zero
              </h1>
              <p className="text-slate-300 max-w-2xl text-sm md:text-base">
                Start with networking fundamentals (IPs, VLANs, routing) and
                progress all the way through Nutanix HCI operations. Learn by
                doing — every lesson mixes theory with hands-on exercises:
                MCQs, flashcards, command sims, and diagram builders.
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
                <span className="flex items-center gap-1">
                  <BookIcon className="h-3.5 w-3.5" />
                  {totalLessons} lessons
                </span>
                <span className="flex items-center gap-1">
                  <ListIcon className="h-3.5 w-3.5" />
                  {totalExercises} exercises
                </span>
                <span className="flex items-center gap-1">
                  <Trophy className="h-3.5 w-3.5" />
                  {totalLessons * 10} XP max
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              <div className="text-5xl font-bold tabular-nums text-glow-cyan text-primary">
                {xp}
                <span className="text-2xl text-slate-400 ml-1">XP</span>
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">
                {completedCount} of {totalLessons} lessons done
              </div>
              <div className="w-full md:w-48">
                <Progress value={overallPct} className="h-1.5" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resume / Start button */}
      {nextLesson && (
        <Card
          className="cursor-pointer hover:shadow-lg hover:border-primary/40 transition-all pulse-glow"
          onClick={() => onSelectLesson(nextLesson.id)}
        >
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/20 text-primary shrink-0">
              <Play className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-primary uppercase tracking-wide font-medium">
                {completedCount === 0 ? "Start here" : "Continue learning"}
              </div>
              <div className="font-semibold text-base truncate">
                {nextLesson.title}
              </div>
              <div className="text-xs text-muted-foreground">
                {moduleById(nextLesson.module)?.title} · {nextLesson.duration} · +{nextLesson.xp} XP
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
          </CardContent>
        </Card>
      )}

      {/* Modules */}
      <div className="space-y-6">
        {modules.map((m) => {
          const moduleLessons = lessonsByModule(m.id);
          const moduleCompleted = moduleLessons.filter((l) =>
            completedLessons.includes(l.id)
          ).length;
          const modulePct =
            moduleLessons.length > 0
              ? Math.round((moduleCompleted / moduleLessons.length) * 100)
              : 0;
          const Icon = iconMap[m.icon] ?? BookOpenIcon;

          return (
            <div key={m.id} className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-semibold">{m.title}</h2>
                    <Badge variant="outline" className="text-xs">
                      {moduleCompleted}/{moduleLessons.length}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {m.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Progress value={modulePct} className="h-1 max-w-xs" />
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {modulePct}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                {moduleLessons.map((lesson, idx) => {
                  const unlocked = isLessonUnlocked(lesson.id, allLessonIds);
                  const completed = completedLessons.includes(lesson.id);
                  const globalIdx = allLessonIds.indexOf(lesson.id);
                  return (
                    <Card
                      key={lesson.id}
                      className={cn(
                        "transition-all",
                        unlocked
                          ? "cursor-pointer hover:border-primary/40 hover:bg-muted/30"
                          : "opacity-60",
                        completed && "border-emerald-500/30"
                      )}
                      onClick={() => unlocked && onSelectLesson(lesson.id)}
                    >
                      <CardContent className="p-3 flex items-center gap-3">
                        <div
                          className={cn(
                            "shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold",
                            completed
                              ? "bg-emerald-500/20 text-emerald-400"
                              : unlocked
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {completed ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : unlocked ? (
                            globalIdx + 1
                          ) : (
                            <Lock className="h-3.5 w-3.5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {lesson.title}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {lesson.duration}
                            <span>·</span>
                            <Zap className="h-3 w-3" />
                            {lesson.xp} XP
                          </div>
                        </div>
                        {unlocked && (
                          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reset */}
      {completedCount > 0 && (
        <Card>
          <CardContent className="p-4 flex items-center justify-between gap-3">
            <div>
              <div className="font-medium text-sm">Reset all progress</div>
              <div className="text-xs text-muted-foreground">
                Wipe XP, lesson completion, and exercise attempts. Cannot be undone.
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/20"
              onClick={() => {
                if (confirm("Reset all bootcamp progress? This cannot be undone.")) {
                  resetProgress();
                }
              }}
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Reset
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Inline simple icons
function BookIcon(props: React.ComponentProps<typeof Network>) {
  return <Network {...props} />;
}
function ListIcon(props: React.ComponentProps<typeof Network>) {
  return <Network {...props} />;
}
function BookOpenIcon(props: React.ComponentProps<typeof Network>) {
  return <Network {...props} />;
}
