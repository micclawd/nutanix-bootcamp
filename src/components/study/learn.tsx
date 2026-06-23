"use client";

import { useState, useMemo } from "react";
import { useProgressStore } from "@/lib/store";
import {
  modules,
  concepts,
  conceptsByModule,
  type ModuleId,
  type Concept,
} from "@/lib/nutanix-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Server,
  Database,
  Network,
  LayoutDashboard,
  Shield,
  HardDrive,
  Workflow,
  Cloud,
  BookOpen,
  Check,
  Star,
  Search,
  ChevronDown,
  X,
  ExternalLink,
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

const difficultyColors: Record<string, string> = {
  Foundational: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  Intermediate: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  Advanced: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
};

export function Learn() {
  const [activeModule, setActiveModule] = useState<ModuleId | "all">("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [filterKnown, setFilterKnown] = useState(false);
  const [filterStarred, setFilterStarred] = useState(false);

  const {
    knownConcepts,
    starredConcepts,
    toggleKnown,
    toggleStar,
    studiedModules,
    markModuleStudied,
    unmarkModuleStudied,
  } = useProgressStore();

  const filtered = useMemo(() => {
    let list = activeModule === "all" ? concepts : conceptsByModule(activeModule);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.term.toLowerCase().includes(q) ||
          c.short.toLowerCase().includes(q) ||
          c.detail.toLowerCase().includes(q) ||
          c.keyFacts.some((f) => f.toLowerCase().includes(q))
      );
    }
    if (filterKnown) list = list.filter((c) => knownConcepts.includes(c.id));
    if (filterStarred) list = list.filter((c) => starredConcepts.includes(c.id));
    return list;
  }, [activeModule, search, filterKnown, filterStarred, knownConcepts, starredConcepts]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Group filtered concepts by module when "all" is selected
  const grouped = useMemo(() => {
    if (activeModule !== "all") return [{ module: modules.find((m) => m.id === activeModule)!, items: filtered }];
    return modules
      .map((m) => ({ module: m, items: filtered.filter((c) => c.module === m.id) }))
      .filter((g) => g.items.length > 0);
  }, [filtered, activeModule]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          Learn
        </h2>
        <p className="text-muted-foreground mt-1">
          Browse {concepts.length} concepts across {modules.length} modules. Click any
          card to expand the full explanation, key facts, network-bridge mapping,
          and common gotchas.
        </p>
      </div>

      {/* Search + filters */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search concepts, e.g. 'VLAN', 'RF2', 'GENEVE', 'VPC'…"
              className="pl-9 pr-9"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant={filterKnown ? "default" : "outline"}
              onClick={() => setFilterKnown(!filterKnown)}
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              Known only
            </Button>
            <Button
              size="sm"
              variant={filterStarred ? "default" : "outline"}
              onClick={() => setFilterStarred(!filterStarred)}
            >
              <Star className={cn("h-3.5 w-3.5 mr-1", filterStarred && "fill-current")} />
              Starred only
            </Button>
            <span className="text-xs text-muted-foreground ml-auto">
              {filtered.length} of {concepts.length} concepts
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Module selector chips */}
      <div className="flex flex-wrap gap-2">
        <ModuleChip
          active={activeModule === "all"}
          onClick={() => setActiveModule("all")}
          label="All Modules"
          count={concepts.length}
        />
        {modules.map((m) => {
          const Icon = iconMap[m.icon] ?? BookOpen;
          const c = colorMap[m.color];
          const count = conceptsByModule(m.id).length;
          return (
            <button
              key={m.id}
              onClick={() => setActiveModule(m.id)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition-colors",
                activeModule === m.id
                  ? cn(c.bg, c.text, c.border, "font-medium")
                  : "bg-background hover:bg-muted"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {m.title}
              <span className="text-xs opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Concepts grouped by module */}
      {grouped.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            No concepts match your filters.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {grouped.map((group) => {
            const m = group.module;
            const Icon = iconMap[m.icon] ?? BookOpen;
            const c = colorMap[m.color];
            const moduleConcepts = conceptsByModule(m.id);
            const knownCount = moduleConcepts.filter((cc) =>
              knownConcepts.includes(cc.id)
            ).length;
            const isStudied = studiedModules.includes(m.id);

            return (
              <div key={m.id} className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg shrink-0", c.bg, c.text)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-semibold">{m.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {knownCount}/{moduleConcepts.length} known
                      </Badge>
                      {isStudied && (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <Check className="h-3 w-3" />
                          Studied
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {m.description}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={isStudied ? "outline" : "default"}
                    onClick={() =>
                      isStudied
                        ? unmarkModuleStudied(m.id)
                        : markModuleStudied(m.id)
                    }
                    className="shrink-0"
                  >
                    {isStudied ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Studied
                      </>
                    ) : (
                      "Mark Studied"
                    )}
                  </Button>
                </div>

                <div className="grid gap-3">
                  {group.items.map((concept) => (
                    <ConceptCard
                      key={concept.id}
                      concept={concept}
                      isExpanded={expanded.has(concept.id)}
                      onToggle={() => toggleExpand(concept.id)}
                      isKnown={knownConcepts.includes(concept.id)}
                      isStarred={starredConcepts.includes(concept.id)}
                      onToggleKnown={() => toggleKnown(concept.id)}
                      onToggleStar={() => toggleStar(concept.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ModuleChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition-colors",
        active
          ? "bg-primary text-primary-foreground border-primary font-medium"
          : "bg-background hover:bg-muted"
      )}
    >
      {label}
      <span className="text-xs opacity-70">({count})</span>
    </button>
  );
}

interface ConceptCardProps {
  concept: Concept;
  isExpanded: boolean;
  onToggle: () => void;
  isKnown: boolean;
  isStarred: boolean;
  onToggleKnown: () => void;
  onToggleStar: () => void;
}

function ConceptCard({
  concept,
  isExpanded,
  onToggle,
  isKnown,
  isStarred,
  onToggleKnown,
  onToggleStar,
}: ConceptCardProps) {
  const conceptModule = modules.find((m) => m.id === concept.module)!;
  const c = colorMap[conceptModule.color];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-3">
        <div className="flex items-start gap-3">
          <button
            onClick={onToggle}
            className="flex-1 min-w-0 text-left"
            aria-expanded={isExpanded}
          >
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <CardTitle className="text-base font-semibold leading-tight">
                {concept.term}
              </CardTitle>
              <Badge
                variant="outline"
                className={cn("text-xs", difficultyColors[concept.difficulty])}
              >
                {concept.difficulty}
              </Badge>
              <span className={cn("inline-flex items-center gap-1 text-xs", c.text)}>
                <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
                {conceptModule.title}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-snug">
              {concept.short}
            </p>
          </button>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              size="sm"
              variant="ghost"
              className={cn("h-8 w-8 p-0", isStarred && "text-amber-500")}
              onClick={onToggleStar}
              title={isStarred ? "Remove star" : "Star for review"}
            >
              <Star className={cn("h-4 w-4", isStarred && "fill-current")} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className={cn("h-8 w-8 p-0", isKnown && "text-emerald-600")}
              onClick={onToggleKnown}
              title={isKnown ? "Mark as not known" : "Mark as known"}
            >
              <Check className={cn("h-4 w-4", isKnown && "font-bold")} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={onToggle}
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isExpanded && "rotate-180"
                )}
              />
            </Button>
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="p-4 pt-0 space-y-4 border-t bg-muted/30">
          {/* Detailed explanation */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
              Explanation
            </h5>
            <p className="text-sm leading-relaxed">{concept.detail}</p>
          </div>

          {/* Key facts */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
              Key Facts
            </h5>
            <ul className="space-y-1">
              {concept.keyFacts.map((fact, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className={cn("mt-1.5 h-1.5 w-1.5 rounded-full shrink-0", c.dot)} />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Network bridge */}
          {concept.networkBridge && (
            <div className={cn("p-3 rounded-md border", c.bg, c.border)}>
              <h5 className={cn("text-xs font-semibold uppercase tracking-wide mb-1.5 flex items-center gap-1.5", c.text)}>
                <Network className="h-3 w-3" />
                Network Bridge
              </h5>
              <p className="text-sm leading-relaxed">{concept.networkBridge}</p>
            </div>
          )}

          {/* Gotcha */}
          {concept.gotcha && (
            <div className="p-3 rounded-md border border-amber-500/30 bg-amber-500/5">
              <h5 className="text-xs font-semibold uppercase tracking-wide mb-1.5 flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
                ⚠ Gotcha
              </h5>
              <p className="text-sm leading-relaxed">{concept.gotcha}</p>
            </div>
          )}

          {/* Example */}
          {concept.example && (
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                Example
              </h5>
              <p className="text-sm leading-relaxed italic text-muted-foreground">
                {concept.example}
              </p>
            </div>
          )}

          {/* Doc reference */}
          {concept.docRef && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1 border-t">
              <ExternalLink className="h-3 w-3" />
              <span>Source: {concept.docRef}</span>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
