"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Check,
  X,
  ChevronDown,
  Lightbulb,
  Terminal,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  CornerDownLeft,
  Layers,
  Boxes,
  Edit3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  MCQExercise,
  FillBlankExercise,
  FlashcardExercise,
  ScenarioExercise,
  CommandSimExercise,
  DiagramExercise,
  Exercise,
} from "@/lib/curriculum";
import { useBootcampStore } from "@/lib/bootcamp-store";

// ============================================================
// Shared exercise wrapper
// ============================================================

interface ExerciseWrapperProps {
  exercise: Exercise;
  index: number;
  total: number;
  isCompleted: boolean;
  wasCorrect: boolean;
  children: React.ReactNode;
}

function ExerciseWrapper({
  exercise,
  index,
  total,
  isCompleted,
  wasCorrect,
  children,
}: ExerciseWrapperProps) {
  const typeLabels: Record<Exercise["type"], string> = {
    mcq: "Multiple Choice",
    "fill-blank": "Fill in the Blank",
    flashcard: "Flashcard",
    scenario: "Scenario",
    "command-sim": "Command Simulator",
    diagram: "Diagram Builder",
  };
  const typeIcons: Record<Exercise["type"], React.ElementType> = {
    mcq: CheckCircle2,
    "fill-blank": Edit3,
    flashcard: Layers,
    scenario: AlertCircle,
    "command-sim": Terminal,
    diagram: Boxes,
  };
  const Icon = typeIcons[exercise.type];

  return (
    <Card className="overflow-hidden border-border/60">
      <div className="px-4 py-3 border-b border-border/60 bg-muted/30 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-md bg-primary/10 text-primary shrink-0">
            <Icon className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">
              Exercise {index + 1} of {total} · {typeLabels[exercise.type]}
            </div>
          </div>
        </div>
        {isCompleted && (
          <Badge
            variant="outline"
            className={cn(
              "text-xs shrink-0",
              wasCorrect
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-amber-500/30 bg-amber-500/10 text-amber-400"
            )}
          >
            {wasCorrect ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                Correct
              </>
            ) : (
              "Completed"
            )}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );
}

// ============================================================
// MCQ
// ============================================================

export function MCQExerciseView({
  exercise,
  onComplete,
  isCompleted,
  wasCorrect,
  index,
  total,
}: {
  exercise: MCQExercise;
  onComplete: (correct: boolean) => void;
  isCompleted: boolean;
  wasCorrect: boolean;
  index: number;
  total: number;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [localRevealed, setLocalRevealed] = useState(false);
  const revealed = isCompleted || localRevealed;
  const recordAttempt = useBootcampStore((s) => s.recordExerciseAttempt);

  const handleSelect = (idx: number) => {
    if (revealed) return;
    setSelected(idx);
    setLocalRevealed(true);
    const correct = idx === exercise.correctIndex;
    recordAttempt(
      {
        exerciseId: exercise.id,
        lessonId: exercise.id.split("-ex-")[0],
        correct,
        firstTry: !isCompleted,
        timestamp: Date.now(),
      },
      2
    );
    onComplete(correct);
  };

  return (
    <ExerciseWrapper
      exercise={exercise}
      index={index}
      total={total}
      isCompleted={isCompleted}
      wasCorrect={wasCorrect}
    >
      <div className="space-y-4">
        <p className="text-sm font-medium leading-relaxed">{exercise.prompt}</p>
        <RadioGroup
          value={selected !== null ? String(selected) : undefined}
          onValueChange={(v) => handleSelect(Number(v))}
          className="space-y-2"
        >
          {exercise.options.map((opt, i) => {
            const isCorrect = i === exercise.correctIndex;
            const isSelected = selected === i;
            const showCorrect = revealed && isCorrect;
            const showWrong = revealed && isSelected && !isCorrect;
            return (
              <Label
                key={i}
                htmlFor={`mcq-${exercise.id}-${i}`}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors font-normal",
                  !revealed && "hover:bg-muted/50",
                  showCorrect && "border-emerald-500/60 bg-emerald-500/10",
                  showWrong && "border-rose-500/60 bg-rose-500/10",
                  revealed && !showCorrect && !showWrong && "opacity-50 cursor-default"
                )}
              >
                <RadioGroupItem
                  value={String(i)}
                  id={`mcq-${exercise.id}-${i}`}
                  className="mt-1"
                  disabled={revealed}
                />
                <span className="flex-1 text-sm leading-relaxed">{opt}</span>
                {showCorrect && <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />}
                {showWrong && <X className="h-4 w-4 text-rose-400 mt-0.5 shrink-0" />}
              </Label>
            );
          })}
        </RadioGroup>

        {revealed && (
          <div
            className={cn(
              "p-3 rounded-md border text-sm leading-relaxed",
              selected === exercise.correctIndex
                ? "border-emerald-500/30 bg-emerald-500/5"
                : "border-amber-500/30 bg-amber-500/5"
            )}
          >
            <div className="flex items-center gap-2 font-medium mb-1">
              {selected === exercise.correctIndex ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400">Correct!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-400" />
                  <span className="text-amber-400">Not quite — review the explanation</span>
                </>
              )}
            </div>
            <p className="text-muted-foreground">{exercise.explanation}</p>
          </div>
        )}
      </div>
    </ExerciseWrapper>
  );
}

// ============================================================
// Fill in the Blank
// ============================================================

export function FillBlankExerciseView({
  exercise,
  onComplete,
  isCompleted,
  wasCorrect,
  index,
  total,
}: {
  exercise: FillBlankExercise;
  onComplete: (correct: boolean) => void;
  isCompleted: boolean;
  wasCorrect: boolean;
  index: number;
  total: number;
}) {
  const [answer, setAnswer] = useState("");
  const [localRevealed, setLocalRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const revealed = isCompleted || localRevealed;
  const recordAttempt = useBootcampStore((s) => s.recordExerciseAttempt);

  const handleSubmit = () => {
    if (revealed) return;
    const normalized = answer.trim().toLowerCase();
    const correct = exercise.acceptableAnswers.some(
      (a) => a.trim().toLowerCase() === normalized
    );
    setIsCorrect(correct);
    setLocalRevealed(true);
    recordAttempt(
      {
        exerciseId: exercise.id,
        lessonId: exercise.id.split("-ex-")[0],
        correct,
        firstTry: !isCompleted,
        timestamp: Date.now(),
      },
      2
    );
    onComplete(correct);
  };

  const handleRetry = () => {
    setAnswer("");
    setLocalRevealed(false);
    setIsCorrect(false);
  };

  const parts = exercise.prompt.split("___");

  return (
    <ExerciseWrapper
      exercise={exercise}
      index={index}
      total={total}
      isCompleted={isCompleted}
      wasCorrect={wasCorrect}
    >
      <div className="space-y-4">
        <p className="text-sm font-medium leading-relaxed">
          {parts[0]}
          <span
            className={cn(
              "inline-block min-w-[120px] mx-1 px-2 py-0.5 rounded border-b-2 text-center font-mono",
              revealed
                ? isCorrect
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                  : "border-rose-500 bg-rose-500/10 text-rose-400 line-through"
                : "border-primary bg-muted/50"
            )}
          >
            {revealed ? answer || "(empty)" : answer}
          </span>
          {parts[1]}
        </p>

        {!revealed && (
          <div className="flex items-center gap-2">
            <Input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Type your answer..."
              className="font-mono"
              autoFocus
            />
            <Button onClick={handleSubmit} disabled={!answer.trim()} size="default">
              Submit
              <CornerDownLeft className="h-3.5 w-3.5 ml-1" />
            </Button>
            {exercise.hint && (
              <Button
                variant="ghost"
                size="default"
                onClick={() => setShowHint(!showHint)}
                className="text-muted-foreground"
              >
                <Lightbulb className="h-3.5 w-3.5" />
                Hint
              </Button>
            )}
          </div>
        )}

        {!revealed && showHint && exercise.hint && (
          <div className="p-2 rounded-md border border-amber-500/30 bg-amber-500/5 text-xs">
            <Lightbulb className="h-3 w-3 inline mr-1 text-amber-400" />
            <span className="text-amber-400">Hint: </span>
            <span className="text-muted-foreground">{exercise.hint}</span>
          </div>
        )}

        {revealed && (
          <div
            className={cn(
              "p-3 rounded-md border text-sm leading-relaxed",
              isCorrect
                ? "border-emerald-500/30 bg-emerald-500/5"
                : "border-amber-500/30 bg-amber-500/5"
            )}
          >
            <div className="flex items-center gap-2 font-medium mb-1">
              {isCorrect ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400">Correct!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-400" />
                  <span className="text-amber-400">
                    Acceptable answers: {exercise.acceptableAnswers.join(", ")}
                  </span>
                </>
              )}
            </div>
            <p className="text-muted-foreground">{exercise.explanation}</p>
            {!isCorrect && !isCompleted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRetry}
                className="mt-2 text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Try again
              </Button>
            )}
          </div>
        )}
      </div>
    </ExerciseWrapper>
  );
}

// ============================================================
// Flashcard
// ============================================================

export function FlashcardExerciseView({
  exercise,
  onComplete,
  isCompleted,
  wasCorrect,
  index,
  total,
}: {
  exercise: FlashcardExercise;
  onComplete: (correct: boolean) => void;
  isCompleted: boolean;
  wasCorrect: boolean;
  index: number;
  total: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const [localRevealed, setLocalRevealed] = useState(false);
  const revealed = isCompleted || localRevealed;
  const recordAttempt = useBootcampStore((s) => s.recordExerciseAttempt);

  const handleGotIt = (correct: boolean) => {
    if (revealed) return;
    setLocalRevealed(true);
    recordAttempt(
      {
        exerciseId: exercise.id,
        lessonId: exercise.id.split("-ex-")[0],
        correct,
        firstTry: !isCompleted,
        timestamp: Date.now(),
      },
      2
    );
    onComplete(correct);
  };

  return (
    <ExerciseWrapper
      exercise={exercise}
      index={index}
      total={total}
      isCompleted={isCompleted}
      wasCorrect={wasCorrect}
    >
      <div className="space-y-4">
        <p className="text-sm font-medium leading-relaxed">{exercise.front}</p>

        <div
          className="relative min-h-[8rem] cursor-pointer select-none"
          style={{ perspective: "1500px" }}
          onClick={() => !revealed && setFlipped(!flipped)}
        >
          <div
            className="absolute inset-0 transition-transform duration-500"
            style={{
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            <Card
              className="absolute inset-0 flex items-center justify-center p-4 border-dashed"
              style={{ backfaceVisibility: "hidden" }}
            >
              <CardContent className="p-0 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  Click to flip
                </p>
                <ChevronDown className="h-4 w-4 mx-auto text-primary animate-pulse" />
              </CardContent>
            </Card>
            <Card
              className="absolute inset-0 flex items-center justify-center p-4 border-primary/30 bg-muted/30"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <CardContent className="p-0 text-center">
                <p className="text-sm leading-relaxed">{exercise.back}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {!revealed && flipped && (
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleGotIt(false)}>
              <X className="h-3.5 w-3.5 mr-1" />
              Didn&apos;t know it
            </Button>
            <Button size="sm" onClick={() => handleGotIt(true)}>
              <Check className="h-3.5 w-3.5 mr-1" />
              Got it right
            </Button>
          </div>
        )}

        {revealed && (
          <div className="p-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 text-sm">
            <div className="flex items-center gap-2 font-medium mb-1">
              <Check className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400">Reviewed</span>
            </div>
            <p className="text-muted-foreground">
              Flashcards work best with spaced repetition — revisit this card tomorrow, then in 3 days, then in a week.
            </p>
          </div>
        )}
      </div>
    </ExerciseWrapper>
  );
}

// ============================================================
// Scenario
// ============================================================

export function ScenarioExerciseView({
  exercise,
  onComplete,
  isCompleted,
  wasCorrect,
  index,
  total,
}: {
  exercise: ScenarioExercise;
  onComplete: (correct: boolean) => void;
  isCompleted: boolean;
  wasCorrect: boolean;
  index: number;
  total: number;
}) {
  const [currentStepId, setCurrentStepId] = useState(exercise.steps[0].id);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [localRevealed, setLocalRevealed] = useState(false);
  const revealed = isCompleted || localRevealed;
  const recordAttempt = useBootcampStore((s) => s.recordExerciseAttempt);

  const currentStep = exercise.steps.find((s) => s.id === currentStepId)!;

  const handleSelect = (optionId: string) => {
    if (feedback) return;
    const option = currentStep.options.find((o) => o.id === optionId)!;
    setSelectedOption(optionId);
    setFeedback(option.feedback);

    if (option.correct) {
      if (option.nextStepId) {
        setTimeout(() => {
          setCurrentStepId(option.nextStepId!);
          setSelectedOption(null);
          setFeedback(null);
        }, 1500);
      } else {
        setLocalRevealed(true);
        recordAttempt(
          {
            exerciseId: exercise.id,
            lessonId: exercise.id.split("-ex-")[0],
            correct: true,
            firstTry: !isCompleted,
            timestamp: Date.now(),
          },
          3
        );
        onComplete(true);
      }
    }
  };

  const handleRetry = () => {
    setCurrentStepId(exercise.steps[0].id);
    setSelectedOption(null);
    setFeedback(null);
    setLocalRevealed(false);
  };

  return (
    <ExerciseWrapper
      exercise={exercise}
      index={index}
      total={total}
      isCompleted={isCompleted}
      wasCorrect={wasCorrect}
    >
      <div className="space-y-4">
        <div className="p-3 rounded-md border border-primary/30 bg-primary/5">
          <p className="text-xs text-primary uppercase tracking-wide mb-1 font-medium">
            Scenario
          </p>
          <p className="text-sm leading-relaxed">{exercise.prompt}</p>
        </div>

        {!revealed && (
          <>
            <div className="p-3 rounded-md border bg-muted/30">
              <p className="text-sm font-medium mb-3">{currentStep.text}</p>
              <div className="space-y-2">
                {currentStep.options.map((opt) => {
                  const isSelected = selectedOption === opt.id;
                  const showCorrect = feedback && opt.correct;
                  const showWrong = feedback && isSelected && !opt.correct;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect(opt.id)}
                      disabled={!!feedback}
                      className={cn(
                        "w-full text-left p-3 rounded-md border text-sm transition-colors",
                        !feedback && "hover:bg-muted/50 cursor-pointer",
                        showCorrect && "border-emerald-500/60 bg-emerald-500/10",
                        showWrong && "border-rose-500/60 bg-rose-500/10",
                        feedback && !showCorrect && !showWrong && "opacity-50"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-mono text-xs text-muted-foreground mt-0.5">
                          {opt.id.toUpperCase()}.
                        </span>
                        <span className="flex-1">{opt.text}</span>
                        {showCorrect && <Check className="h-4 w-4 text-emerald-400 shrink-0" />}
                        {showWrong && <X className="h-4 w-4 text-rose-400 shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {feedback && (
              <div
                className={cn(
                  "p-3 rounded-md border text-sm leading-relaxed",
                  currentStep.options.find((o) => o.id === selectedOption)?.correct
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-rose-500/30 bg-rose-500/5"
                )}
              >
                <div className="flex items-center gap-2 font-medium mb-1">
                  {currentStep.options.find((o) => o.id === selectedOption)?.correct ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-400">Correct</span>
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 text-rose-400" />
                      <span className="text-rose-400">Try again — pick a different option</span>
                    </>
                  )}
                </div>
                <p className="text-muted-foreground">{feedback}</p>
                {currentStep.options.find((o) => o.id === selectedOption)?.correct && (
                  <p className="text-xs text-primary mt-1">→ Advancing to next step...</p>
                )}
              </div>
            )}
          </>
        )}

        {revealed && (
          <div className="p-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 text-sm leading-relaxed">
            <div className="flex items-center gap-2 font-medium mb-1">
              <Check className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400">Scenario complete!</span>
            </div>
            <p className="text-muted-foreground">
              Scenario exercises simulate real-world decision making. The more you practice, the faster you&apos;ll recognize patterns on the job.
            </p>
            {!isCompleted && (
              <Button variant="ghost" size="sm" onClick={handleRetry} className="mt-2 text-xs">
                <RotateCcw className="h-3 w-3 mr-1" />
                Run scenario again
              </Button>
            )}
          </div>
        )}
      </div>
    </ExerciseWrapper>
  );
}

// ============================================================
// Command Simulator
// ============================================================

export function CommandSimExerciseView({
  exercise,
  onComplete,
  isCompleted,
  wasCorrect,
  index,
  total,
}: {
  exercise: CommandSimExercise;
  onComplete: (correct: boolean) => void;
  isCompleted: boolean;
  wasCorrect: boolean;
  index: number;
  total: number;
}) {
  const [input, setInput] = useState("");
  const [localHistory, setLocalHistory] = useState<{ cmd: string; output: string }[]>([]);
  const [localRevealed, setLocalRevealed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const revealed = isCompleted || localRevealed;
  const terminalRef = useRef<HTMLDivElement>(null);
  const recordAttempt = useBootcampStore((s) => s.recordExerciseAttempt);

  // When isCompleted is true, show the pre-completed history
  const displayHistory = isCompleted
    ? [{ cmd: exercise.expectedCommands[0], output: exercise.expectedOutput }]
    : localHistory;

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [displayHistory]);

  const handleSubmit = () => {
    if (revealed) return;
    const normalized = input.trim().toLowerCase();
    const correct = exercise.expectedCommands.some(
      (c) => c.trim().toLowerCase() === normalized
    );

    if (correct) {
      setLocalHistory([...localHistory, { cmd: input, output: exercise.expectedOutput }]);
      setInput("");
      setLocalRevealed(true);
      recordAttempt(
        {
          exerciseId: exercise.id,
          lessonId: exercise.id.split("-ex-")[0],
          correct: true,
          firstTry: !isCompleted,
          timestamp: Date.now(),
        },
        3
      );
      onComplete(true);
    } else {
      setLocalHistory([
        ...localHistory,
        {
          cmd: input,
          output: `bash: ${input.split(" ")[0]}: command not found or invalid syntax\nTry again, or use the hint button.`,
        },
      ]);
      setInput("");
    }
  };

  return (
    <ExerciseWrapper
      exercise={exercise}
      index={index}
      total={total}
      isCompleted={isCompleted}
      wasCorrect={wasCorrect}
    >
      <div className="space-y-3">
        <p className="text-sm font-medium leading-relaxed">{exercise.prompt}</p>

        {exercise.context && (
          <div className="text-xs font-mono text-muted-foreground">
            Context: {exercise.context}
          </div>
        )}

        <div
          ref={terminalRef}
          className="terminal-block rounded-md p-3 h-64 overflow-y-auto custom-scroll text-xs"
        >
          {displayHistory.length === 0 && !revealed && (
            <div className="text-muted-foreground/60 italic mb-2">
              Type a command and press Enter...
            </div>
          )}
          {displayHistory.map((entry, i) => (
            <div key={i} className="mb-2">
              <div className="flex items-start">
                <span className="text-primary font-bold shrink-0">$</span>
                <span className="ml-2 font-mono break-all">{entry.cmd}</span>
              </div>
              <pre className="mt-1 ml-4 font-mono text-emerald-400/90 whitespace-pre-wrap text-xs">
                {entry.output}
              </pre>
            </div>
          ))}
          {!revealed && (
            <div className="flex items-center">
              <span className="text-primary font-bold shrink-0">$</span>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="type command..."
                className="ml-2 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 font-mono text-xs h-5"
                autoFocus
              />
            </div>
          )}
        </div>

        {!revealed && (
          <div className="flex items-center gap-2">
            <Button onClick={handleSubmit} disabled={!input.trim()} size="sm">
              Run
              <CornerDownLeft className="h-3 w-3 ml-1" />
            </Button>
            {exercise.hint && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHint(!showHint)}
                className="text-muted-foreground"
              >
                <Lightbulb className="h-3.5 w-3.5" />
                Hint
              </Button>
            )}
          </div>
        )}

        {!revealed && showHint && exercise.hint && (
          <div className="p-2 rounded-md border border-amber-500/30 bg-amber-500/5 text-xs">
            <Lightbulb className="h-3 w-3 inline mr-1 text-amber-400" />
            <span className="text-amber-400">Hint: </span>
            <span className="text-muted-foreground font-mono">{exercise.hint}</span>
          </div>
        )}

        {revealed && (
          <div className="p-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 text-sm leading-relaxed">
            <div className="flex items-center gap-2 font-medium mb-1">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400">Command executed successfully!</span>
            </div>
            <p className="text-muted-foreground">{exercise.explanation}</p>
          </div>
        )}
      </div>
    </ExerciseWrapper>
  );
}

// ============================================================
// Diagram Builder (drag-and-drop)
// ============================================================

export function DiagramExerciseView({
  exercise,
  onComplete,
  isCompleted,
  wasCorrect,
  index,
  total,
}: {
  exercise: DiagramExercise;
  onComplete: (correct: boolean) => void;
  isCompleted: boolean;
  wasCorrect: boolean;
  index: number;
  total: number;
}) {
  const [localAssignments, setLocalAssignments] = useState<Record<string, string>>({});
  const [draggedLabel, setDraggedLabel] = useState<string | null>(null);
  const [localRevealed, setLocalRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const revealed = isCompleted || localRevealed;
  const recordAttempt = useBootcampStore((s) => s.recordExerciseAttempt);

  // When isCompleted, show correct assignments (read-only)
  const assignments = isCompleted
    ? Object.fromEntries(exercise.slots.map((s) => [s.id, s.correctLabelId]))
    : localAssignments;
  const usedLabels = new Set(Object.values(assignments));

  const handleDrop = (slotId: string) => {
    if (!draggedLabel || revealed) return;
    const newAssignments = { ...localAssignments };
    Object.keys(newAssignments).forEach((sId) => {
      if (newAssignments[sId] === draggedLabel) {
        delete newAssignments[sId];
      }
    });
    newAssignments[slotId] = draggedLabel;
    setLocalAssignments(newAssignments);
    setDraggedLabel(null);
  };

  const handleClearSlot = (slotId: string) => {
    if (revealed) return;
    const newAssignments = { ...localAssignments };
    delete newAssignments[slotId];
    setLocalAssignments(newAssignments);
  };

  const handleSubmit = () => {
    if (revealed) return;
    const allFilled = exercise.slots.every((s) => assignments[s.id]);
    if (!allFilled) return;
    const correct = exercise.slots.every(
      (s) => assignments[s.id] === s.correctLabelId
    );
    setIsCorrect(correct);
    setLocalRevealed(true);
    recordAttempt(
      {
        exerciseId: exercise.id,
        lessonId: exercise.id.split("-ex-")[0],
        correct,
        firstTry: !isCompleted,
        timestamp: Date.now(),
      },
      3
    );
    onComplete(correct);
  };

  const handleRetry = () => {
    setLocalAssignments({});
    setLocalRevealed(false);
    setIsCorrect(false);
  };

  const allFilled = exercise.slots.every((s) => assignments[s.id]);

  return (
    <ExerciseWrapper
      exercise={exercise}
      index={index}
      total={total}
      isCompleted={isCompleted}
      wasCorrect={wasCorrect}
    >
      <div className="space-y-4">
        <p className="text-sm font-medium leading-relaxed">{exercise.prompt}</p>

        <div className="space-y-2">
          {exercise.slots.map((slot) => {
            const assignedLabelId = assignments[slot.id];
            const assignedLabel = exercise.labels.find((l) => l.id === assignedLabelId);
            const isCorrectSlot = revealed && assignedLabelId === slot.correctLabelId;
            const isWrongSlot = revealed && assignedLabelId && assignedLabelId !== slot.correctLabelId;
            return (
              <div
                key={slot.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(slot.id)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-md border-2 border-dashed transition-colors",
                  !assignedLabelId && !revealed && "border-border hover:border-primary/50 hover:bg-primary/5",
                  assignedLabelId && !revealed && "border-primary/40 bg-primary/5",
                  isCorrectSlot && "border-emerald-500/60 bg-emerald-500/10",
                  isWrongSlot && "border-rose-500/60 bg-rose-500/10",
                  revealed && !isCorrectSlot && !isWrongSlot && "border-border"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {slot.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {slot.description}
                    </span>
                  </div>
                  {assignedLabel ? (
                    <div className="mt-1.5 flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "font-mono",
                          isCorrectSlot && "bg-emerald-500/20 text-emerald-400",
                          isWrongSlot && "bg-rose-500/20 text-rose-400 line-through"
                        )}
                      >
                        {assignedLabel.text}
                      </Badge>
                      {!revealed && (
                        <button
                          onClick={() => handleClearSlot(slot.id)}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="mt-1.5 text-xs text-muted-foreground/60 italic">
                      Drop a label here
                    </div>
                  )}
                </div>
                {isCorrectSlot && <Check className="h-4 w-4 text-emerald-400 shrink-0" />}
                {isWrongSlot && <X className="h-4 w-4 text-rose-400 shrink-0" />}
              </div>
            );
          })}
        </div>

        {!revealed && (
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              Drag labels to slots:
            </div>
            <div className="flex flex-wrap gap-2">
              {exercise.labels.map((label) => {
                const isUsed = usedLabels.has(label.id);
                return (
                  <div
                    key={label.id}
                    draggable={!isUsed}
                    onDragStart={() => setDraggedLabel(label.id)}
                    onDragEnd={() => setDraggedLabel(null)}
                    className={cn(
                      "px-3 py-1.5 rounded-md border font-mono text-xs cursor-grab transition-colors",
                      isUsed
                        ? "opacity-30 cursor-not-allowed bg-muted/30"
                        : "bg-card hover:bg-primary/10 hover:border-primary/50 active:cursor-grabbing"
                    )}
                  >
                    {label.text}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!revealed && (
          <div className="flex items-center gap-2">
            <Button onClick={handleSubmit} disabled={!allFilled} size="sm">
              <Check className="h-3.5 w-3.5 mr-1" />
              Submit answers
            </Button>
            {!allFilled && (
              <span className="text-xs text-muted-foreground">
                Fill all {exercise.slots.length} slots to submit
              </span>
            )}
          </div>
        )}

        {revealed && (
          <div
            className={cn(
              "p-3 rounded-md border text-sm leading-relaxed",
              isCorrect
                ? "border-emerald-500/30 bg-emerald-500/5"
                : "border-amber-500/30 bg-amber-500/5"
            )}
          >
            <div className="flex items-center gap-2 font-medium mb-1">
              {isCorrect ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400">All correct!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-400" />
                  <span className="text-amber-400">Some labels were misplaced — see correct answers above</span>
                </>
              )}
            </div>
            <p className="text-muted-foreground">{exercise.explanation}</p>
            {!isCorrect && !isCompleted && (
              <Button variant="ghost" size="sm" onClick={handleRetry} className="mt-2 text-xs">
                <RotateCcw className="h-3 w-3 mr-1" />
                Try again
              </Button>
            )}
          </div>
        )}
      </div>
    </ExerciseWrapper>
  );
}

// ============================================================
// Dispatcher
// ============================================================

interface ExerciseRendererProps {
  exercise: Exercise;
  index: number;
  total: number;
  onComplete: (correct: boolean) => void;
  isCompleted: boolean;
  wasCorrect: boolean;
}

export function ExerciseRenderer({
  exercise,
  index,
  total,
  onComplete,
  isCompleted,
  wasCorrect,
}: ExerciseRendererProps) {
  const props = { onComplete, isCompleted, wasCorrect, index, total };
  switch (exercise.type) {
    case "mcq":
      return <MCQExerciseView {...props} exercise={exercise as MCQExercise} />;
    case "fill-blank":
      return <FillBlankExerciseView {...props} exercise={exercise as FillBlankExercise} />;
    case "flashcard":
      return <FlashcardExerciseView {...props} exercise={exercise as FlashcardExercise} />;
    case "scenario":
      return <ScenarioExerciseView {...props} exercise={exercise as ScenarioExercise} />;
    case "command-sim":
      return <CommandSimExerciseView {...props} exercise={exercise as CommandSimExercise} />;
    case "diagram":
      return <DiagramExerciseView {...props} exercise={exercise as DiagramExercise} />;
    default:
      return null;
  }
}
