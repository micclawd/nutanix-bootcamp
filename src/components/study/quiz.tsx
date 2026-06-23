"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useProgressStore } from "@/lib/store";
import {
  modules,
  quizQuestions,
  type QuizQuestion,
  type ModuleId,
} from "@/lib/nutanix-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Target,
  Check,
  X,
  ArrowRight,
  RotateCcw,
  Trophy,
  Clock,
  Server,
  Database,
  Network,
  LayoutDashboard,
  Shield,
  HardDrive,
  Workflow,
  Cloud,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Server,
  Database,
  Network,
  LayoutDashboard,
  Shield,
  HardDrive,
  Workflow,
  Cloud,
};

const colorMap: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-500/30", dot: "bg-emerald-500" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-700 dark:text-sky-300", border: "border-sky-500/30", dot: "bg-sky-500" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-700 dark:text-violet-300", border: "border-violet-500/30", dot: "bg-violet-500" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-700 dark:text-amber-300", border: "border-amber-500/30", dot: "bg-amber-500" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-700 dark:text-rose-300", border: "border-rose-500/30", dot: "bg-rose-500" },
  teal: { bg: "bg-teal-500/10", text: "text-teal-700 dark:text-teal-300", border: "border-teal-500/30", dot: "bg-teal-500" },
  indigo: { bg: "bg-indigo-500/10", text: "text-indigo-700 dark:text-indigo-300", border: "border-indigo-500/30", dot: "bg-indigo-500" },
  orange: { bg: "bg-orange-500/10", text: "text-orange-700 dark:text-orange-300", border: "border-orange-500/30", dot: "bg-orange-500" },
};

type QuizScope = ModuleId | "mixed";
type QuizPhase = "select" | "active" | "results";

export function Quiz() {
  const [phase, setPhase] = useState<QuizPhase>("select");
  const [scope, setScope] = useState<QuizScope | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);

  const { recordQuizAttempt, recordQuizSession } = useProgressStore();

  const startQuiz = useCallback((scope: QuizScope) => {
    const pool = scope === "mixed"
      ? quizQuestions
      : quizQuestions.filter((q) => q.module === scope);
    // Shuffle and limit to 10
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(10, pool.length));
    setScope(scope);
    setQuestions(shuffled);
    setAnswers({});
    setRevealed(new Set());
    setCurrentIdx(0);
    setStartTime(Date.now());
    setPhase("active");
  }, []);

  const selectAnswer = (qId: string, idx: number) => {
    if (revealed.has(qId)) return;
    setAnswers((a) => ({ ...a, [qId]: idx }));
    setRevealed((prev) => new Set([...prev, qId]));
    // Record attempt
    const q = questions.find((qq) => qq.id === qId);
    if (q) {
      recordQuizAttempt({
        questionId: qId,
        selectedIndex: idx,
        correct: idx === q.correctIndex,
        timestamp: Date.now(),
      });
    }
  };

  const finishQuiz = useCallback(() => {
    const correct = questions.filter((q) => answers[q.id] === q.correctIndex).length;
    setEndTime(Date.now());
    recordQuizSession({
      id: `session-${Date.now()}`,
      scope: scope === "mixed" ? "mixed" : "module",
      scopeId: scope ?? "mixed",
      total: questions.length,
      correct,
      timestamp: Date.now(),
      durationMs: Date.now() - startTime,
    });
    setPhase("results");
  }, [questions, answers, scope, startTime, recordQuizSession]);

  if (phase === "select") {
    return <QuizSelect onStart={startQuiz} />;
  }

  if (phase === "results") {
    return (
      <QuizResults
        questions={questions}
        answers={answers}
        scope={scope!}
        durationMs={endTime - startTime}
        onRetry={() => startQuiz(scope!)}
        onBackToSelect={() => setPhase("select")}
      />
    );
  }

  // Active phase
  const current = questions[currentIdx];
  const isAnswered = revealed.has(current.id);
  const selectedAnswer = answers[current.id];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Target className="h-6 w-6" />
          {scope === "mixed" ? "Mixed Quiz" : modules.find((m) => m.id === scope)?.title}
        </h2>
        <Button variant="ghost" size="sm" onClick={() => setPhase("select")}>
          Exit
        </Button>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground tabular-nums shrink-0">
          Question {currentIdx + 1} / {questions.length}
        </span>
        <Progress
          value={((currentIdx + 1) / questions.length) * 100}
          className="h-1.5"
        />
        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
          <Clock className="h-3 w-3" />
          <Timer startTime={startTime} />
        </div>
      </div>

      {/* Question card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Badge variant="outline" className="text-xs">
              {current.difficulty}
            </Badge>
            {current.module !== "mixed" && (
              <span className={cn("inline-flex items-center gap-1 text-xs", colorMap[modules.find((m) => m.id === current.module)!.color].text)}>
                <span className={cn("h-1.5 w-1.5 rounded-full", colorMap[modules.find((m) => m.id === current.module)!.color].dot)} />
                {modules.find((m) => m.id === current.module)!.title}
              </span>
            )}
            {current.module === "mixed" && (
              <Badge variant="secondary" className="text-xs">Mixed</Badge>
            )}
          </div>
          <CardTitle className="text-lg leading-snug">{current.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <RadioGroup
            value={selectedAnswer !== undefined ? String(selectedAnswer) : undefined}
            onValueChange={(v) => selectAnswer(current.id, Number(v))}
            className="space-y-2"
          >
            {current.options.map((opt, i) => {
              const isCorrect = i === current.correctIndex;
              const isSelected = selectedAnswer === i;
              const showCorrect = isAnswered && isCorrect;
              const showWrong = isAnswered && isSelected && !isCorrect;
              return (
                <Label
                  key={i}
                  htmlFor={`opt-${i}`}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors",
                    !isAnswered && "hover:bg-muted",
                    showCorrect && "border-emerald-500 bg-emerald-500/10",
                    showWrong && "border-rose-500 bg-rose-500/10",
                    isAnswered && !showCorrect && !showWrong && "opacity-60",
                    isAnswered && "cursor-default"
                  )}
                >
                  <RadioGroupItem
                    value={String(i)}
                    id={`opt-${i}`}
                    className="mt-1"
                    disabled={isAnswered}
                  />
                  <span className="flex-1 text-sm leading-relaxed">{opt}</span>
                  {showCorrect && <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />}
                  {showWrong && <X className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />}
                </Label>
              );
            })}
          </RadioGroup>

          {/* Explanation after answer */}
          {isAnswered && (
            <div
              className={cn(
                "p-3 rounded-md border text-sm leading-relaxed",
                selectedAnswer === current.correctIndex
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-amber-500/30 bg-amber-500/5"
              )}
            >
              <div className="flex items-center gap-2 font-medium mb-1">
                {selectedAnswer === current.correctIndex ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span className="text-emerald-700 dark:text-emerald-300">Correct</span>
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 text-rose-600" />
                    <span className="text-rose-700 dark:text-rose-300">Not quite</span>
                  </>
                )}
              </div>
              <p className="text-muted-foreground">{current.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
        >
          Previous
        </Button>
        <div className="flex items-center gap-1">
          {questions.map((q, i) => {
            const isAnsweredQ = revealed.has(q.id);
            const isCorrect = answers[q.id] === q.correctIndex;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIdx(i)}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  i === currentIdx && "ring-2 ring-offset-1 ring-primary",
                  isAnsweredQ
                    ? isCorrect
                      ? "bg-emerald-500"
                      : "bg-rose-500"
                    : "bg-muted-foreground/30"
                )}
                title={`Question ${i + 1}`}
              />
            );
          })}
        </div>
        {currentIdx === questions.length - 1 ? (
          <Button onClick={finishQuiz} disabled={!isAnswered}>
            Finish
            <Trophy className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
            disabled={!isAnswered}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>

      {/* Skip-to-finish hint */}
      {Object.keys(answers).length > 0 && currentIdx < questions.length - 1 && (
        <div className="text-center">
          <Button variant="link" size="sm" className="text-muted-foreground" onClick={finishQuiz}>
            End quiz early ({Object.keys(answers).length} answered)
          </Button>
        </div>
      )}
    </div>
  );
}

function QuizSelect({ onStart }: { onStart: (scope: QuizScope) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Target className="h-6 w-6" />
          Quizzes
        </h2>
        <p className="text-muted-foreground mt-1">
          Test your knowledge. Each quiz pulls 10 random questions from the
          selected scope, with explanations after every answer.
        </p>
      </div>

      {/* Mixed quiz — featured */}
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white"
        onClick={() => onStart("mixed")}
      >
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white/10">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Mixed Practice Quiz</h3>
            <p className="text-sm text-slate-300">
              10 random questions across all {modules.length} modules. Best for
              end-of-week review or exam warm-up.
            </p>
          </div>
          <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-200">
            Start
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Per-module quizzes
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          {modules.map((m) => {
            const Icon = iconMap[m.icon] ?? Target;
            const c = colorMap[m.color];
            const count = quizQuestions.filter((q) => q.module === m.id).length;
            return (
              <Card
                key={m.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onStart(m.id)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg shrink-0", c.bg, c.text)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{m.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {count} questions · 10 random per attempt
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function QuizResults({
  questions,
  answers,
  scope,
  durationMs,
  onRetry,
  onBackToSelect,
}: {
  questions: QuizQuestion[];
  answers: Record<string, number>;
  scope: QuizScope;
  durationMs: number;
  onRetry: () => void;
  onBackToSelect: () => void;
}) {
  const correct = questions.filter((q) => answers[q.id] === q.correctIndex).length;
  const total = questions.length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const passed = pct >= 70;

  const grade = pct >= 90 ? "Excellent" : pct >= 70 ? "Passed" : pct >= 50 ? "Borderline" : "Needs Work";
  const gradeColor = pct >= 90 ? "text-emerald-600" : pct >= 70 ? "text-sky-600" : pct >= 50 ? "text-amber-600" : "text-rose-600";

  return (
    <div className="space-y-6">
      {/* Score card */}
      <Card className={cn("overflow-hidden", passed ? "border-emerald-500/30" : "border-rose-500/30")}>
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col items-center text-center gap-3">
            <div className={cn("p-3 rounded-full", passed ? "bg-emerald-500/10" : "bg-rose-500/10")}>
              {passed ? (
                <Trophy className={cn("h-8 w-8", gradeColor)} />
              ) : (
                <RotateCcw className={cn("h-8 w-8", gradeColor)} />
              )}
            </div>
            <div>
              <div className={cn("text-5xl font-bold tabular-nums", gradeColor)}>
                {pct}%
              </div>
              <div className={cn("font-medium mt-1", gradeColor)}>{grade}</div>
            </div>
            <div className="text-sm text-muted-foreground">
              {correct} of {total} correct ·{" "}
              {scope === "mixed" ? "Mixed Quiz" : modules.find((m) => m.id === scope)?.title} ·{" "}
              {Math.floor(durationMs / 60000)}m {Math.floor((durationMs % 60000) / 1000)}s
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Button onClick={onRetry} variant="default">
                <RotateCcw className="h-4 w-4 mr-1" />
                Try Again
              </Button>
              <Button onClick={onBackToSelect} variant="outline">
                Back to Quiz List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Review</h3>
        <div className="space-y-3">
          {questions.map((q, i) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correctIndex;
            const wasAnswered = userAnswer !== undefined;
            return (
              <Card key={q.id}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <div
                      className={cn(
                        "shrink-0 mt-0.5 p-1 rounded-full",
                        isCorrect
                          ? "bg-emerald-500/10 text-emerald-600"
                          : wasAnswered
                          ? "bg-rose-500/10 text-rose-600"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {isCorrect ? (
                        <Check className="h-3 w-3" />
                      ) : wasAnswered ? (
                        <X className="h-3 w-3" />
                      ) : (
                        <span className="text-xs">—</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground mb-1">
                        Question {i + 1} · {q.difficulty}
                      </div>
                      <div className="text-sm font-medium leading-snug">
                        {q.question}
                      </div>
                    </div>
                  </div>

                  {wasAnswered && !isCorrect && (
                    <div className="ml-6 text-xs space-y-1">
                      <div className="text-rose-700 dark:text-rose-300">
                        Your answer: {q.options[userAnswer]}
                      </div>
                      <div className="text-emerald-700 dark:text-emerald-300">
                        Correct: {q.options[q.correctIndex]}
                      </div>
                    </div>
                  )}

                  <div className="ml-6 p-2 rounded bg-muted/50 text-xs text-muted-foreground leading-relaxed">
                    {q.explanation}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Timer({ startTime }: { startTime: number }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const elapsed = Math.floor((now - startTime) / 1000);
  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  return (
    <span className="tabular-nums">
      {m}:{String(s).padStart(2, "0")}
    </span>
  );
}
