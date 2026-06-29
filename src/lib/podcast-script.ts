// Podcast script generator — transforms a Lesson's theory + key terms
// into a 2-host conversational dialogue.
//
// Host A (Alex) — the curious learner, asks questions
// Host B (Sam) — the expert, explains concepts
//
// Output: array of { speaker: "alex" | "sam", text: string }
// Each text is kept under ~900 chars to stay within TTS API limits.

import type { Lesson } from "./curriculum";

export interface PodcastLine {
  speaker: "alex" | "sam";
  text: string;
}

const intros: Record<string, string[]> = {
  "net-fundamentals": [
    "Hey everyone, welcome back to the show. I'm Alex.",
    "And I'm Sam. Today we're diving into another piece of the networking puzzle, and it's a foundational one.",
  ],
  "nutanix-foundations": [
    "Welcome back. Alex here.",
    "And Sam. Today we're getting into the actual Nutanix platform — finally past the networking groundwork.",
  ],
  storage: [
    "Hey, welcome back. Alex here.",
    "Sam too. Today we're talking storage — specifically, how Nutanix handles storage across a cluster.",
  ],
  "ahv-networking": [
    "Welcome back. Alex.",
    "Sam here. Today we're taking the networking fundamentals we covered and applying them inside AHV, the Nutanix hypervisor.",
  ],
  prism: [
    "Hey, welcome back. Alex.",
    "And Sam. Today's episode is about Prism — the management plane for Nutanix.",
  ],
  flow: [
    "Welcome back to the show. Alex.",
    "Sam here. Today we're tackling Flow, Nutanix's software-defined networking stack.",
  ],
  "data-services": [
    "Hey, welcome back. Alex.",
    "Sam too. Today we're looking at how Nutanix exposes storage through different services — Files, Volumes, and Objects.",
  ],
  operations: [
    "Welcome back. Alex here.",
    "And Sam. Today we're talking operations — the day-two tooling that makes Nutanix manageable at scale.",
  ],
  "hybrid-cloud": [
    "Hey, welcome back. Alex.",
    "Sam here. Today's topic is hybrid cloud — running Nutanix outside your own datacenter.",
  ],
};

const outros: string[] = [
  "That's a wrap for today. Thanks for listening, and we'll catch you in the next episode.",
  "And that's our episode. If this clicked, hit the exercises in the app — they really help cement it. See you next time.",
  "That's all for today. Take what you learned and try the practice exercises. See you in the next lesson.",
  "Wrapping up — thanks for learning with us. The hands-on exercises in the app are next. Catch you next time.",
];

function conversationalize(text: string): string {
  return text
    .replace(/\bMoreover\b/gi, "On top of that")
    .replace(/\bFurthermore\b/gi, "And here's another thing")
    .replace(/\bHowever\b/gi, "But")
    .replace(/\bTherefore\b/gi, "So")
    .replace(/\bThus\b/gi, "So")
    .replace(/\bFor example\b/gi, "For instance")
    .replace(/\bis required\b/gi, "you need")
    .replace(/\bmust be\b/gi, "should be")
    .replace(/—/g, ", ")
    .replace(/–/g, ", ");
}

// Compact mode: ~6-8 lines, ~1.5-2 min spoken. Designed for TTS API rate limits.
export function generatePodcastScriptCompact(lesson: Lesson): PodcastLine[] {
  const lines: PodcastLine[] = [];

  const intro = intros[lesson.module] || intros["net-fundamentals"];
  lines.push({ speaker: "alex", text: intro[0] });
  lines.push({ speaker: "sam", text: intro[1] });

  lines.push({
    speaker: "alex",
    text: `Today we're covering: ${lesson.title}. Can you give me the quick overview?`,
  });

  if (lesson.theory.length > 0) {
    const firstSection = lesson.theory[0];
    const body = conversationalize(firstSection.body);
    const shortBody = body.length > 800 ? body.slice(0, 797) + "..." : body;
    const kt = lesson.keyTerms[0];
    const termSuffix = kt ? ` The key term to remember is ${kt.term}: ${kt.definition}` : "";
    const combined = (shortBody + termSuffix).slice(0, 1000);
    lines.push({ speaker: "sam", text: combined });
  }

  if (lesson.theory.length > 1) {
    const lastSection = lesson.theory[lesson.theory.length - 1];
    const body = conversationalize(lastSection.body);
    const shortBody = body.length > 700 ? body.slice(0, 697) + "..." : body;
    lines.push({ speaker: "alex", text: `So how does this apply in practice?` });
    lines.push({ speaker: "sam", text: shortBody });
  }

  lines.push({
    speaker: "alex",
    text: "Got it. I'll try the exercises in the app now.",
  });
  const outro = outros[Math.floor(Math.random() * outros.length)];
  lines.push({ speaker: "sam", text: outro });

  return lines;
}

export function generatePodcastScript(lesson: Lesson, compact = false): PodcastLine[] {
  return generatePodcastScriptCompact(lesson);
}

export function estimateDurationMinutes(lines: PodcastLine[]): number {
  const totalWords = lines.reduce((sum, l) => sum + l.text.split(/\s+/).length, 0);
  return Math.round((totalWords / 150) * 10) / 10;
}
