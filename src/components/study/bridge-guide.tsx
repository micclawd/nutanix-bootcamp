"use client";

import { useState, useMemo } from "react";
import { useProgressStore } from "@/lib/store";
import { bridgeGuide } from "@/lib/nutanix-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Network,
  ArrowRight,
  Check,
  Search,
  X,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function BridgeGuide() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [onlyUnreviewed, setOnlyUnreviewed] = useState(false);

  const { reviewedBridge, markBridgeReviewed, unmarkBridgeReviewed } =
    useProgressStore();

  const categories = useMemo(() => {
    const set = new Set(bridgeGuide.map((b) => b.category));
    return ["all", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    let list = bridgeGuide;
    if (activeCategory !== "all") {
      list = list.filter((b) => b.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.networkConcept.toLowerCase().includes(q) ||
          b.nutanixEquivalent.toLowerCase().includes(q) ||
          b.networkDesc.toLowerCase().includes(q) ||
          b.nutanixDesc.toLowerCase().includes(q) ||
          b.mapping.toLowerCase().includes(q)
      );
    }
    if (onlyUnreviewed) {
      list = list.filter((b) => !reviewedBridge.includes(b.id));
    }
    return list;
  }, [activeCategory, search, onlyUnreviewed, reviewedBridge]);

  const reviewedCount = reviewedBridge.length;
  const pct = Math.round((reviewedCount / bridgeGuide.length) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Network className="h-6 w-6" />
          Network → Nutanix Bridge Guide
        </h2>
        <p className="text-muted-foreground mt-1">
          A side-by-side mapping of networking concepts you already know to their
          Nutanix equivalents. Use this as your translation layer when reading
          the official docs.
        </p>
      </div>

      {/* Intro / progress */}
      <Card className="overflow-hidden bg-gradient-to-br from-violet-500/10 to-sky-500/10 border-violet-500/30">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-violet-500/20 text-violet-700 dark:text-violet-300 shrink-0">
            <Lightbulb className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">
              You already know networking — here's the translation
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {bridgeGuide.length} mappings across {categories.length - 1} categories.{" "}
              Mark each one as reviewed once you've internalized it.
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-bold tabular-nums">{pct}%</div>
            <div className="text-xs text-muted-foreground">
              {reviewedCount}/{bridgeGuide.length} reviewed
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search + filters */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search mappings — try 'VLAN', 'NAT', 'LACP', 'ACL'…"
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
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-full border text-xs transition-colors",
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary font-medium"
                    : "bg-background hover:bg-muted"
                )}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}
            <Button
              size="sm"
              variant={onlyUnreviewed ? "default" : "outline"}
              onClick={() => setOnlyUnreviewed(!onlyUnreviewed)}
              className="ml-auto"
            >
              {onlyUnreviewed ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1" />
                  Showing unreviewed only
                </>
              ) : (
                "Show unreviewed only"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mapping cards */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            No mappings match your filters.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => {
            const isReviewed = reviewedBridge.includes(b.id);
            return (
              <Card
                key={b.id}
                className={cn(
                  "overflow-hidden",
                  isReviewed && "border-emerald-500/30 bg-emerald-500/5"
                )}
              >
                <CardHeader className="p-4 pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-xs">
                      {b.category}
                    </Badge>
                    <Button
                      size="sm"
                      variant={isReviewed ? "outline" : "default"}
                      onClick={() =>
                        isReviewed
                          ? unmarkBridgeReviewed(b.id)
                          : markBridgeReviewed(b.id)
                      }
                      className="h-7"
                    >
                      {isReviewed ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Reviewed
                        </>
                      ) : (
                        "Mark Reviewed"
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                  {/* Side-by-side mapping */}
                  <div className="grid md:grid-cols-[1fr_auto_1fr] gap-3 items-stretch">
                    {/* Network side */}
                    <div className="p-3 rounded-md border bg-sky-500/5 border-sky-500/20 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">
                        <Network className="h-3 w-3" />
                        Networking
                      </div>
                      <div className="font-semibold text-sm">{b.networkConcept}</div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {b.networkDesc}
                      </p>
                    </div>

                    {/* Arrow (desktop) */}
                    <div className="hidden md:flex items-center justify-center">
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>

                    {/* Nutanix side */}
                    <div className="p-3 rounded-md border bg-emerald-500/5 border-emerald-500/20 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                        <BookOpen className="h-3 w-3" />
                        Nutanix
                      </div>
                      <div className="font-semibold text-sm">{b.nutanixEquivalent}</div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {b.nutanixDesc}
                      </p>
                    </div>
                  </div>

                  {/* Mapping note */}
                  <div className="p-3 rounded-md bg-muted/50 border">
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                      How they map
                    </div>
                    <p className="text-sm leading-relaxed">{b.mapping}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Bottom action */}
      {filtered.length > 0 && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => {
              const filteredIds = filtered.map((b) => b.id);
              const allReviewed = filteredIds.every((id) =>
                reviewedBridge.includes(id)
              );
              filteredIds.forEach((id) =>
                allReviewed
                  ? unmarkBridgeReviewed(id)
                  : markBridgeReviewed(id)
              );
            }}
          >
            {filtered.every((b) => reviewedBridge.includes(b.id))
              ? "Mark all as not reviewed"
              : "Mark all visible as reviewed"}
          </Button>
        </div>
      )}
    </div>
  );
}
