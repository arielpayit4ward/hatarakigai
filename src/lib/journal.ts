import { useSyncExternalStore } from "react";
import { steps, SARAH_PPS_PROMPT, type Circle } from "@/content/journey";

export type StepState = { done?: boolean; paper?: boolean; v: Record<string, any> };
export type CompassEntry = { id: string; date: string; did: string; happened: string; dial: number };
export type Journal = {
  steps: Record<string, StepState>;
  compass: CompassEntry[];
  words: { word: string; date: string }[];
  acrostic: { word: string; lines: string[] };
};

const KEY = "work-worth-doing.v1";
export const emptyJournal = (): Journal => ({ steps: {}, compass: [], words: [], acrostic: { word: "", lines: [] } });

let cache: Journal | null = null;
const listeners = new Set<() => void>();
const EMPTY = emptyJournal();

function read(): Journal {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? { ...emptyJournal(), ...JSON.parse(raw) } : emptyJournal();
  } catch {
    cache = emptyJournal();
  }
  return cache!;
}

export function setJournal(next: Journal) {
  cache = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  listeners.forEach((l) => l());
}

export function updateJournal(fn: (j: Journal) => Journal) { setJournal(fn(read())); }

export function useJournal(): Journal {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    read,
    () => EMPTY,
  );
}

export function setStepValue(id: string, key: string, value: unknown) {
  updateJournal((j) => {
    const s = j.steps[id] ?? { v: {} };
    return { ...j, steps: { ...j.steps, [id]: { ...s, v: { ...s.v, [key]: value } } } };
  });
}
export function setStepFlag(id: string, flag: "done" | "paper", value: boolean) {
  updateJournal((j) => {
    const s = j.steps[id] ?? { v: {} };
    return { ...j, steps: { ...j.steps, [id]: { ...s, [flag]: value } } };
  });
}

export function getRef(j: Journal, ref: string): any {
  const [id, key] = ref.split(".");
  return j.steps[id]?.v?.[key];
}

/** Flatten any stored answer into readable strings. */
export function flatten(value: any): string[] {
  if (value == null) return [];
  if (typeof value === "string") return value.trim() ? [value.trim()] : [];
  if (Array.isArray(value)) return value.flatMap(flatten);
  if (typeof value === "object") {
    if ("text" in value) return flatten(value.text);
    if ("name" in value || "reply" in value) {
      const s = [value.name, value.reply].filter((x) => x && String(x).trim()).join(": ");
      return s ? [s] : [];
    }
    return Object.values(value).flatMap(flatten);
  }
  return [];
}

export function stepEntries(j: Journal, id: string): string[] {
  const v = j.steps[id]?.v ?? {};
  if (id === "11") return []; // mapping only, shown elsewhere
  if (id === "9") return flatten([v.offer, v.learned]);
  return flatten(Object.values(v));
}

export function circleEntries(j: Journal, circle: Circle): string[] {
  return steps.filter((s) => s.circle === circle).flatMap((s) => stepEntries(j, s.id));
}

export function hasContent(j: Journal, id: string) {
  return stepEntries(j, id).length > 0;
}

export function gatherPages(j: Journal): string {
  const out: string[] = ["# My pages: Work Worth Doing", ""];
  for (const s of steps) {
    if (s.id === "14") continue;
    const e = stepEntries(j, s.id);
    if (s.id === "11") {
      const top = sdgCounts(j).filter((x) => x.count > 0).slice(0, 5);
      if (top.length) { out.push(`## 11. ${s.title}`, ...top.map((t) => `- ${t.goal} (${t.count})`), ""); }
      continue;
    }
    if (!e.length) continue;
    out.push(`## ${s.n}. ${s.title}`, ...e.map((x) => `- ${x}`), "");
  }
  return out.join("\n");
}

export function gatherWithPrompt(j: Journal) {
  return `${gatherPages(j)}\n---\n\n${SARAH_PPS_PROMPT}`;
}

import { SDGS } from "@/content/journey";
export function sdgCounts(j: Journal) {
  const map: Record<string, number[]> = getRef(j, "11.sdg") ?? {};
  const counts = SDGS.map((goal, i) => ({ goal, i, count: 0 }));
  Object.values(map).forEach((arr) => arr.forEach((g) => counts[g] && counts[g].count++));
  return counts.sort((a, b) => b.count - a.count);
}

export function toggleLimited<T>(list: T[], item: T, max: number): T[] {
  if (list.includes(item)) return list.filter((x) => x !== item);
  if (list.length >= max) return list;
  return [...list, item];
}

export function toMarkdown(j: Journal): string {
  const parts = [gatherPages(j)];
  const p = getRef(j, "14.pathways");
  if (p) parts.push("## 14. Synthesise and Choose", ...flatten(p).map((x) => `- ${x}`), "");
  if (j.compass.length) {
    parts.push("# Compass Log", "");
    j.compass.forEach((c) => parts.push(`## ${c.date}`, `What I did: ${c.did}`, `What happened: ${c.happened}`, `Toward or away: ${c.dial}`, ""));
  }
  if (j.words.length) parts.push("# One Word", ...j.words.map((w) => `- ${w.date}: ${w.word}`));
  return parts.join("\n");
}

export function download(name: string, text: string, type = "text/markdown") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}
