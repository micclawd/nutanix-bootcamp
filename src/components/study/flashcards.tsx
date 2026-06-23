"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useProgressStore } from "@/lib/store";
import {
  modules,
  concepts,
  type Concept,
  type ModuleId,
} from "@/lib/nutanix-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  Check,
  RotateCcw,
  Shuffle,
  Star,
  Network,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

type Filter = "all" | ModuleId | "starred" | "unknown";

export function Flashcards() {
  const [filter, setFilter] = useState<Filter>("all");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  // shuffleNonce is bumped whenever the user (or filter change) wants a fresh shuffle
  const [shuffleNonce, setShuffleNonce] = useState(0);
  // Track previous deck length to reset index when filter changes
  const prevDeckRef = useRef<Concept[] | null>(null);

  const {
    knownConcepts,
    starredConcepts,
    toggleKnown,
    toggleStar,
  } = useProgressStore();

  const deck = useMemo(() => {
    let list: Concept[];
    if (filter === "all") list = concepts;
    else if (filter === "starred") list = concepts.filter((c) => starredConcepts.includes(c.id));
    else if (filter === "unknown") list = concepts.filter((c) => !knownConcepts.includes(c.id));
    else list = concepts.filter((c) => c.module === filter);
    return list;
  }, [filter, starredConcepts, knownConcepts]);

  // Compute shuffled deck from deck + nonce — pure derivation, no setState-in-effect
  const shuffled = useMemo(() => {
    return [...deck].sort(() => Math.random() - 0.5);
  }, [deck, shuffleNonce]);

  // When deck changes (filter change), reset index + flip state.
  // This is allowed because we're syncing to an external change (deck identity),
  // not cascading renders within the same render cycle.
  const deckIdentity = deck.map((d) => d.id).join(",");
  useEffect(() => {
    if (prevDeckRef.current !== null && prevDeckRef.current !== deckIdentity) {
      setIndex(0);
      setFlipped(false);
    }
    prevDeckRef.current = deckIdentity;
  }, [deckIdentity]);

  // Clamp index if it's out of bounds (after shuffle/filter)
  const safeIndex = shuffled.length === 0 ? 0 : Math.min(index, shuffled.length - 1);
  const current = shuffled[safeIndex];

  const reshuffle = useCallback(() => {
    setShuffleNonce((n) => n + 1);
    setIndex(0);
    setFlipped(false);
  }, []);

  const next = useCallback(() => {
    setFlipped(false);
    setIndex((i) => (i + 1) % Math.max(shuffled.length, 1));
  }, [shuffled.length]);

  const prev = useCallback(() => {
    setFlipped(false);
    setIndex((i) => (i - 1 + shuffled.length) % Math.max(shuffled.length, 1));
  }, [shuffled.length]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key.toLowerCase() === "k") {
        if (current) toggleKnown(current.id);
      } else if (e.key.toLowerCase() === "s") {
        if (current) toggleStar(current.id);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current, next, prev, toggleKnown, toggleStar]);

  // Filter options
  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "All", count: concepts.length },
    { id: "unknown", label: "Not Known", count: concepts.filter((c) => !knownConcepts.includes(c.id)).length },
    { id: "starred", label: "Starred", count: starredConcepts.length },
    ...modules.map((m) => ({
      id: m.id as Filter,
      label: m.title,
      count: concepts.filter((c) => c.module === m.id).length,
    })),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Layers className="h-6 w-6" />
          Flashcards
        </h2>
        <p className="text-muted-foreground mt-1">
          Click any card to flip. Use <kbd className="px-1 py-0.5 text-xs border rounded bg-muted">Space</kbd> to flip,{" "}
          <kbd className="px-1 py-0.5 text-xs border rounded bg-muted">←→</kbd> to navigate,{" "}
          <kbd className="px-1 py-0.5 text-xs border rounded bg-muted">K</kbd> to mark known,{" "}
          <kbd className="px-1 py-0.5 text-xs border rounded bg-muted">S</kbd> to star.
        </p>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            disabled={f.count === 0}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
              filter === f.id
                ? "bg-primary text-primary-foreground border-primary font-medium"
                : "bg-background hover:bg-muted"
            )}
          >
            {f.label}
            <span className="text-xs opacity-70">({f.count})</span>
          </button>
        ))}
      </div>

      {current ? (
        <>
          {/* Progress */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground tabular-nums shrink-0">
              {index + 1} / {shuffled.length}
            </span>
            <Progress
              value={((index + 1) / shuffled.length) * 100}
              className="h-1.5"
            />
            <Button
              size="sm"
              variant="ghost"
              className="shrink-0"
              onClick={reshuffle}
              title="Re-shuffle"
            >
              <Shuffle className="h-3.5 w-3.5 mr-1" />
              Shuffle
            </Button>
          </div>

          {/* Flashcard */}
          <Flashcard
            concept={current}
            flipped={flipped}
            onFlip={() => setFlipped(!flipped)}
            isKnown={knownConcepts.includes(current.id)}
            isStarred={starredConcepts.includes(current.id)}
            onToggleKnown={() => toggleKnown(current.id)}
            onToggleStar={() => toggleStar(current.id)}
          />

          {/* Controls */}
          <div className="flex items-center justify-between gap-2">
            <Button variant="outline" onClick={prev}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant={starredConcepts.includes(current.id) ? "default" : "outline"}
                onClick={() => toggleStar(current.id)}
                className="gap-1"
              >
                <Star className={cn("h-4 w-4", starredConcepts.includes(current.id) && "fill-current")} />
                {starredConcepts.includes(current.id) ? "Starred" : "Star"}
              </Button>
              <Button
                variant={knownConcepts.includes(current.id) ? "default" : "outline"}
                onClick={() => toggleKnown(current.id)}
                className="gap-1"
              >
                <Check className="h-4 w-4" />
                {knownConcepts.includes(current.id) ? "Known" : "Mark Known"}
              </Button>
            </div>
            <Button variant="outline" onClick={next}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Footer hint */}
          <div className="text-center text-xs text-muted-foreground">
            Tip: After flipping, mark known if you got it right — the Dashboard
            uses this to recommend your next study area.
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="p-12 text-center space-y-2">
            <Sparkles className="h-8 w-8 mx-auto opacity-50" />
            <p className="text-muted-foreground">
              No flashcards in this deck yet.
            </p>
            <p className="text-xs text-muted-foreground">
              Try a different filter or star concepts from the Learn tab.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              onClick={() => setFilter("all")}
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Show all concepts
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Flashcard({
  concept,
  flipped,
  onFlip,
  isKnown,
  isStarred,
  onToggleKnown,
  onToggleStar,
}: {
  concept: Concept;
  flipped: boolean;
  onFlip: () => void;
  isKnown: boolean;
  isStarred: boolean;
  onToggleKnown: () => void;
  onToggleStar: () => void;
}) {
  const conceptModule = modules.find((m) => m.id === concept.module)!;
  const c = colorMap[conceptModule.color];

  return (
    <div
      className="relative h-[28rem] md:h-[26rem] cursor-pointer select-none"
      style={{ perspective: "1500px" }}
      onClick={onFlip}
    >
      <div
        className="absolute inset-0 transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front face — term + short */}
        <Card
          className="absolute inset-0 flex flex-col"
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardContent className="flex-1 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", c.text)}>
                  <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
                  {conceptModule.title}
                </span>
                <Badge variant="outline" className="text-xs">
                  {concept.difficulty}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                {isStarred && (
                  <Star className="h-4 w-4 text-amber-500 fill-current" />
                )}
                {isKnown && (
                  <Check className="h-4 w-4 text-emerald-600" />
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
              <div className={cn("p-3 rounded-xl", c.bg, c.text)}>
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold leading-tight max-w-md">
                {concept.term}
              </h3>
              <p className="text-muted-foreground text-sm max-w-md">
                {concept.short}
              </p>
            </div>

            <div className="mt-4 text-center text-xs text-muted-foreground">
              Click to flip and reveal the explanation ·{" "}
              <kbd className="px-1 py-0.5 border rounded bg-muted">Space</kbd>
            </div>
          </CardContent>
        </Card>

        {/* Back face — detail + key facts + bridge */}
        <Card
          className={cn("absolute inset-0 flex flex-col", c.border)}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <CardContent className="flex-1 p-5 overflow-y-auto custom-scroll flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base">{concept.term}</h3>
              <Badge variant="outline" className={cn("text-xs shrink-0", c.text)}>
                {conceptModule.title}
              </Badge>
            </div>

            <p className="text-sm leading-relaxed">{concept.detail}</p>

            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                Key Facts
              </h5>
              <ul className="space-y-1">
                {concept.keyFacts.map((fact, i) => (
                  <li key={i} className="text-xs flex items-start gap-2">
                    <span className={cn("mt-1.5 h-1.5 w-1.5 rounded-full shrink-0", c.dot)} />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            {concept.networkBridge && (
              <div className={cn("p-2.5 rounded-md border", c.bg, c.border)}>
                <h5 className={cn("text-xs font-semibold uppercase tracking-wide mb-1 flex items-center gap-1.5", c.text)}>
                  <Network className="h-3 w-3" />
                  Network Bridge
                </h5>
                <p className="text-xs leading-relaxed">{concept.networkBridge}</p>
              </div>
            )}

            {concept.gotcha && (
              <div className="p-2.5 rounded-md border border-amber-500/30 bg-amber-500/5">
                <h5 className="text-xs font-semibold uppercase tracking-wide mb-1 text-amber-700 dark:text-amber-300">
                  ⚠ Gotcha
                </h5>
                <p className="text-xs leading-relaxed">{concept.gotcha}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
