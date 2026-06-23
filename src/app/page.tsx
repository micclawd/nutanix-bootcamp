"use client";

import { useState } from "react";
import { Dashboard } from "@/components/study/dashboard";
import { Learn } from "@/components/study/learn";
import { Flashcards } from "@/components/study/flashcards";
import { Quiz } from "@/components/study/quiz";
import { BridgeGuide } from "@/components/study/bridge-guide";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Target,
  Network,
  Github,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "dashboard" | "learn" | "flashcards" | "quiz" | "bridge";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "flashcards", label: "Flashcards", icon: Layers },
  { id: "quiz", label: "Quiz", icon: Target },
  { id: "bridge", label: "Bridge Guide", icon: Network },
];

export default function Home() {
  const [active, setActive] = useState<Tab>("dashboard");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top header bar */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500 to-sky-600 text-white">
              <Network className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-none">
                Nutanix Study Companion
              </h1>
              <p className="text-xs text-muted-foreground leading-none mt-0.5">
                For network engineers refreshing on HCI
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex"
            onClick={() => window.location.reload()}
            title="Refresh page"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Tab navigation */}
        <div className="container mx-auto max-w-6xl px-2 pb-2">
          <Tabs value={active} onValueChange={(v) => setActive(v as Tab)}>
            <TabsList className="grid w-full grid-cols-5 h-auto">
              {tabs.map((t) => {
                const Icon = t.icon;
                return (
                  <TabsTrigger
                    key={t.id}
                    value={t.id}
                    className="flex flex-col items-center gap-1 py-2 text-xs md:flex-row md:gap-2 md:text-sm md:py-1.5"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden md:inline">{t.label}</span>
                    <span className="md:hidden">{t.label.split(" ")[0]}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-6">
        {active === "dashboard" && <Dashboard onNavigate={(t) => setActive(t as Tab)} />}
        {active === "learn" && <Learn />}
        {active === "flashcards" && <Flashcards />}
        {active === "quiz" && <Quiz />}
        {active === "bridge" && <BridgeGuide />}
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto max-w-6xl px-4 py-4 text-center text-xs text-muted-foreground">
          Study content drawn from publicly available Nutanix official
          documentation. Built for self-study — verify against the latest docs
          before any production deployment.
        </div>
      </footer>
    </div>
  );
}
