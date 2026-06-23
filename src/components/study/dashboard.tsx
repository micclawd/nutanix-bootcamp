"use client";

import { useProgressStore } from "@/lib/store";
import {
  modules,
  concepts,
  quizQuestions,
  bridgeGuide,
  conceptsByModule,
  type ModuleId,
} from "@/lib/nutanix-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Layers,
  TrendingUp,
  Target,
  Lightbulb,
  ArrowRight,
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

const colorMap: Record<string, { bg: string; text: string; border: string; ring: string }> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-500/30", ring: "ring-emerald-500/20" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-700 dark:text-sky-300", border: "border-sky-500/30", ring: "ring-sky-500/20" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-700 dark:text-violet-300", border: "border-violet-500/30", ring: "ring-violet-500/20" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-700 dark:text-amber-300", border: "border-amber-500/30", ring: "ring-amber-500/20" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-700 dark:text-rose-300", border: "border-rose-500/30", ring: "ring-rose-500/20" },
  teal: { bg: "bg-teal-500/10", text: "text-teal-700 dark:text-teal-300", border: "border-teal-500/30", ring: "ring-teal-500/20" },
  indigo: { bg: "bg-indigo-500/10", text: "text-indigo-700 dark:text-indigo-300", border: "border-indigo-500/30", ring: "ring-indigo-500/20" },
  orange: { bg: "bg-orange-500/10", text: "text-orange-700 dark:text-orange-300", border: "border-orange-500/30", ring: "ring-orange-500/20" },
};

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const {
    knownConcepts,
    studiedModules,
    quizSessions,
    quizAttempts,
    reviewedBridge,
    starredConcepts,
  } = useProgressStore();

  const totalConcepts = concepts.length;
  const knownPct = Math.round((knownConcepts.length / totalConcepts) * 100);
  const studiedPct = Math.round((studiedModules.length / modules.length) * 100);
  const bridgePct = Math.round((reviewedBridge.length / bridgeGuide.length) * 100);

  const totalQuizAttempts = quizAttempts.length;
  const correctAttempts = quizAttempts.filter((a) => a.correct).length;
  const quizAccuracy =
    totalQuizAttempts > 0 ? Math.round((correctAttempts / totalQuizAttempts) * 100) : 0;

  const bestSession = quizSessions.length > 0
    ? quizSessions.reduce((best, cur) =>
        cur.correct / cur.total > best.correct / best.total ? cur : best
      )
    : null;

  // Recommend next module — first module not yet studied
  const nextModule = modules.find((m) => !studiedModules.includes(m.id));
  const nextModuleConcepts = nextModule ? conceptsByModule(nextModule.id) : [];
  const nextModuleKnown = nextModule
    ? nextModuleConcepts.filter((c) => knownConcepts.includes(c.id)).length
    : 0;

  // Recommend weak areas — modules with lowest quiz accuracy
  const moduleStats = modules.map((m) => {
    const moduleQuestions = quizQuestions.filter((q) => q.module === m.id);
    const moduleAttempts = quizAttempts.filter((a) =>
      moduleQuestions.some((q) => q.id === a.questionId)
    );
    const correct = moduleAttempts.filter((a) => a.correct).length;
    const accuracy = moduleAttempts.length > 0 ? (correct / moduleAttempts.length) * 100 : null;
    return { module: m, attempts: moduleAttempts.length, accuracy };
  });
  const weakModules = moduleStats
    .filter((s) => s.accuracy !== null && s.accuracy < 70)
    .sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0));

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card className="overflow-hidden border-none bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                <Lightbulb className="h-4 w-4" />
                Network-Engineer's Refresher Track
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Nutanix Cloud Platform — Study Companion
              </h1>
              <p className="text-slate-300 max-w-2xl text-sm md:text-base">
                A focused refresher that bridges concepts you already know from
                networking (VLANs, LACP, VXLAN, ACLs, NAT) into the Nutanix
                platform (AHV, Flow, DSF, Prism). Track your progress, drill
                flashcards, and test yourself with scenario-based quizzes.
              </p>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              <div className="text-5xl font-bold tabular-nums">
                {knownPct}<span className="text-2xl text-slate-400">%</span>
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">
                Concepts Mastered
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          label="Concepts Known"
          value={`${knownConcepts.length}/${totalConcepts}`}
          pct={knownPct}
          color="emerald"
          onClick={() => onNavigate("learn")}
        />
        <StatCard
          icon={Layers}
          label="Modules Studied"
          value={`${studiedModules.length}/${modules.length}`}
          pct={studiedPct}
          color="sky"
          onClick={() => onNavigate("learn")}
        />
        <StatCard
          icon={Target}
          label="Quiz Accuracy"
          value={`${quizAccuracy}%`}
          sub={`${correctAttempts}/${totalQuizAttempts} correct`}
          pct={quizAccuracy}
          color="violet"
          onClick={() => onNavigate("quiz")}
        />
        <StatCard
          icon={Network}
          label="Bridge Reviewed"
          value={`${reviewedBridge.length}/${bridgeGuide.length}`}
          pct={bridgePct}
          color="amber"
          onClick={() => onNavigate("bridge")}
        />
      </div>

      {/* Two columns: recommendations + recent activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          {nextModule && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  Recommended Next Step
                </CardTitle>
                <CardDescription>
                  Pick up where you left off — the next module to study.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-lg border",
                    colorMap[nextModule.color].bg,
                    colorMap[nextModule.color].border
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-md",
                      colorMap[nextModule.color].bg,
                      colorMap[nextModule.color].text
                    )}
                  >
                    {(() => {
                      const Icon = iconMap[nextModule.icon] ?? BookOpen;
                      return <Icon className="h-5 w-5" />;
                    })()}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold">{nextModule.title}</h4>
                      <Badge variant="outline" className={colorMap[nextModule.color].text}>
                        {nextModuleConcepts.length} concepts
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {nextModule.tagline}
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                      <div className="flex-1">
                        <Progress
                          value={
                            nextModuleConcepts.length > 0
                              ? (nextModuleKnown / nextModuleConcepts.length) * 100
                              : 0
                          }
                          className="h-1.5"
                        />
                      </div>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {nextModuleKnown}/{nextModuleConcepts.length} known
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="shrink-0"
                    onClick={() => onNavigate("learn")}
                  >
                    Study
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {weakModules.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-4 w-4 text-rose-600" />
                  Weak Areas — Re-Quiz Recommended
                </CardTitle>
                <CardDescription>
                  Modules where your quiz accuracy is below 70%.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {weakModules.slice(0, 3).map((s) => (
                  <div
                    key={s.module.id}
                    className="flex items-center justify-between p-3 rounded-md border bg-rose-500/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("p-1.5 rounded", colorMap[s.module.color].bg, colorMap[s.module.color].text)}>
                        {(() => {
                          const Icon = iconMap[s.module.icon] ?? BookOpen;
                          return <Icon className="h-4 w-4" />;
                        })()}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{s.module.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {s.attempts} attempts
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-rose-600 tabular-nums">
                        {Math.round(s.accuracy ?? 0)}%
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onNavigate("quiz")}
                      >
                        Re-quiz
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Layers className="h-4 w-4 text-sky-600" />
                All Modules
              </CardTitle>
              <CardDescription>
                Overview of every module and your progress through it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {modules.map((m) => {
                const moduleConcepts = conceptsByModule(m.id);
                const known = moduleConcepts.filter((c) =>
                  knownConcepts.includes(c.id)
                ).length;
                const pct =
                  moduleConcepts.length > 0
                    ? (known / moduleConcepts.length) * 100
                    : 0;
                const studied = studiedModules.includes(m.id);
                const Icon = iconMap[m.icon] ?? BookOpen;
                return (
                  <button
                    key={m.id}
                    onClick={() => onNavigate("learn")}
                    className="w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-md shrink-0",
                          colorMap[m.color].bg,
                          colorMap[m.color].text
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">{m.title}</span>
                          {studied && (
                            <Badge variant="secondary" className="text-xs">
                              Studied
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {m.tagline}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Progress value={pct} className="h-1" />
                          <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                            {known}/{moduleConcepts.length}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Recent activity */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Quiz Sessions</CardTitle>
              <CardDescription>Your last 5 quiz runs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {quizSessions.length === 0 ? (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  No quiz sessions yet.
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full"
                    onClick={() => onNavigate("quiz")}
                  >
                    Take a quiz
                  </Button>
                </div>
              ) : (
                quizSessions
                  .slice(-5)
                  .reverse()
                  .map((s) => {
                    const pct = Math.round((s.correct / s.total) * 100);
                    const scope = s.scope === "mixed" ? "Mixed" : modules.find((m) => m.id === s.scopeId)?.title ?? "Module";
                    return (
                      <div
                        key={s.id}
                        className="flex items-center justify-between p-2 rounded-md border"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">
                            {scope}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {s.correct}/{s.total} correct
                          </div>
                        </div>
                        <Badge
                          variant={pct >= 70 ? "default" : "destructive"}
                          className="tabular-nums"
                        >
                          {pct}%
                        </Badge>
                      </div>
                    );
                  })
              )}
              {bestSession && (
                <div className="pt-3 mt-3 border-t text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Best session:</span>
                    <span className="font-semibold text-emerald-600 tabular-nums">
                      {Math.round((bestSession.correct / bestSession.total) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total sessions:</span>
                    <span className="font-semibold tabular-nums">
                      {quizSessions.length}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {starredConcepts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Starred for Review</CardTitle>
                <CardDescription>
                  {starredConcepts.length} concept{starredConcepts.length !== 1 ? "s" : ""} you flagged.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => onNavigate("flashcards")}
                >
                  Review starred flashcards
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reset Progress</CardTitle>
              <CardDescription>
                Wipe all known-concepts, quiz history, and reviewed bridge entries.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                size="sm"
                variant="outline"
                className="w-full text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950"
                onClick={() => {
                  if (confirm("Reset all study progress? This cannot be undone.")) {
                    useProgressStore.getState().resetProgress();
                  }
                }}
              >
                Reset all progress
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  pct: number;
  color: keyof typeof colorMap;
  onClick?: () => void;
}

function StatCard({ icon: Icon, label, value, sub, pct, color, onClick }: StatCardProps) {
  const c = colorMap[color];
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {label}
          </span>
          <div className={cn("p-1.5 rounded", c.bg, c.text)}>
            <Icon className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="text-2xl font-bold tabular-nums">{value}</div>
        {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
        <Progress value={pct} className="h-1" />
      </CardContent>
    </Card>
  );
}
