import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { copy, type Circle } from "@/content/journey";
import { circleEntries, useJournal } from "@/lib/journal";

export const Route = createFileRoute("/table")({
  head: () => ({ meta: [{ title: "The Design Table · Work Worth Doing" }, { name: "description", content: "A four circle design tool filled with your own words: Love, Skill, Value and Problem." }, { property: "og:title", content: "The Design Table · Work Worth Doing" }, { property: "og:description", content: "A four circle design tool filled with your own words: Love, Skill, Value and Problem." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Table,
});

type Region = { sets: Circle[]; name: string; x: number; y: number };
const ellipses: { c: Circle; letter: string; label: string; cx: number; cy: number; rot: number; rx: number; ry: number; color: string; lx: number; ly: number }[] = [
  { c: "Love", letter: "A", label: "What you LOVE", cx: 600, cy: 740, rx: 270, ry: 520, rot: -40, color: "var(--turquoise)", lx: 270, ly: 620 },
  { c: "Skill", letter: "B", label: "What you are GOOD AT", cx: 910, cy: 740, rx: 270, ry: 520, rot: 40, color: "var(--blossom)", lx: 1265, ly: 620 },
  { c: "Value", letter: "C", label: "What you can be PAID FOR", cx: 700, cy: 520, rx: 230, ry: 520, rot: -48, color: "var(--softblue)", lx: 500, ly: 215 },
  { c: "Problem", letter: "D", label: "What the WORLD NEEDS", cx: 810, cy: 520, rx: 230, ry: 520, rot: 48, color: "var(--bluebell)", lx: 1060, ly: 215 },
];
const regions: Region[] = [
  { sets: ["Love", "Value"], name: "Devotion", x: 445, y: 430 },
  { sets: ["Value", "Problem"], name: "Vocation", x: 780, y: 375 },
  { sets: ["Skill", "Problem"], name: "Contribution", x: 1105, y: 430 },
  { sets: ["Love", "Value", "Problem"], name: "Dedication", x: 610, y: 550 },
  { sets: ["Skill", "Value", "Problem"], name: "Foundation", x: 950, y: 550 },
  { sets: ["Love", "Problem"], name: "Mission", x: 505, y: 790 },
  { sets: ["Skill", "Value"], name: "Profession", x: 1055, y: 805 },
  { sets: ["Love", "Skill", "Problem"], name: "Elevation", x: 625, y: 840 },
  { sets: ["Love", "Skill", "Value"], name: "Inspiration", x: 890, y: 840 },
  { sets: ["Love", "Skill"], name: "Passion", x: 775, y: 1025 },
  { sets: ["Love", "Skill", "Value", "Problem"], name: "Hatarakigai", x: 775, y: 720 },
];
const letterOf = (c: Circle) => ellipses.find((e) => e.c === c)!.letter;

function Table() {
  const j = useJournal();
  const [sel, setSel] = useState<Circle[]>(["Love"]);
  const [name, setName] = useState<string>("What you love");
  const same = (sets: Circle[]) => sets.length === sel.length && sets.every((c) => sel.includes(c));
  const pick = (sets: Circle[], n: string) => { setSel(sets); setName(n); };
  return (
    <Shell>
      <section className="py-6">
        <h1 className="text-5xl">{copy.table.title}</h1>
        <p className="mt-3 max-w-2xl text-lg">{copy.table.intro}</p>
        <div className="mt-8 grid gap-8">
          <div>
            <svg viewBox="80 90 1360 1080" className="mx-auto w-full max-w-3xl" role="group" aria-label="The Work Worth Doing Venn diagram, four ellipses with all fifteen overlaps">
              {ellipses.map((e) => (
                <ellipse key={e.c} cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} transform={`rotate(${e.rot} ${e.cx} ${e.cy})`}
                  fill={e.color} fillOpacity={0.32} stroke="var(--ink)" strokeOpacity={0.5} strokeWidth={2} />
              ))}
              {ellipses.map((e) => {
                const on = same([e.c]);
                const words = e.label.split(" ");
                const lines = e.c === "Love" || e.c === "Skill" ? [words.slice(0, 2).join(" "), words.slice(2).join(" ")] : [words.slice(0, 3).join(" "), words.slice(3).join(" ")];
                return (
                  <g key={e.c + "l"} role="button" tabIndex={0} aria-pressed={on} aria-label={`${e.label}, ${e.c}`} className="cursor-pointer"
                    onClick={() => pick([e.c], e.label)} onKeyDown={(ev) => ev.key === "Enter" && pick([e.c], e.label)}>
                    <text x={e.lx} y={e.ly} textAnchor="middle" fontFamily="var(--font-serif)" fontWeight="700" fontSize="40" fill="var(--ink)" textDecoration={on ? "underline" : undefined}>
                      <tspan x={e.lx}>{lines[0]}</tspan><tspan x={e.lx} dy="44">{lines[1]}</tspan>
                    </text>
                  </g>
                );
              })}
              {regions.map((r) => {
                const on = same(r.sets);
                const centre = r.sets.length === 4;
                return (
                  <g key={r.name} role="button" tabIndex={0} aria-pressed={on} aria-label={`${r.name}: ${r.sets.join(", ")}`} className="cursor-pointer"
                    onClick={() => pick(r.sets, r.name)} onKeyDown={(ev) => ev.key === "Enter" && pick(r.sets, r.name)}>
                    <rect x={r.x - (centre ? 170 : 105)} y={r.y - (centre ? 34 : 26)} width={centre ? 340 : 210} height={centre ? 104 : 48} rx={20}
                      fill={on ? "var(--paper)" : "transparent"} stroke={on ? "var(--ink)" : "none"} strokeWidth={2} />
                    
                    <text x={r.x} y={r.y + (centre ? 10 : 8)} textAnchor="middle" fontFamily="var(--font-serif)" fontSize={centre ? 38 : 26} letterSpacing="3" fill="var(--ink)">
                      {r.name.toUpperCase()}
                    </text>
                    {centre && <text x={r.x} y={r.y + 52} textAnchor="middle" fontFamily="var(--font-serif)" fontStyle="italic" fontWeight="700" fontSize="30" fill="var(--ink)">work worth doing</text>}
                  </g>
                );
              })}
            </svg>
            <div className="mt-4 flex flex-wrap gap-2">
              {regions.map((r) => (
                <button key={r.name} type="button" aria-pressed={same(r.sets)} onClick={() => pick(r.sets, r.name)}
                  className={`rounded-full border px-3 py-1 text-sm ${same(r.sets) ? "border-ink bg-secondary font-semibold" : "border-border"}`}>{r.name}</button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-3 text-3xl">{name}</h2>
            <div className={`grid gap-4 ${sel.length > 1 ? "sm:grid-cols-2" : ""}`}>
              {sel.map((c) => {
                const e = circleEntries(j, c);
                const el = ellipses.find((x) => x.c === c)!;
                return (
                  <div key={c} className="dot-grid rounded-2xl border border-border p-5">
                    <h3 className="text-2xl">{c}</h3>
                    <p className="text-sm text-muted-foreground">{el.label.charAt(0) + el.label.slice(1).toLowerCase()}</p>
                    {e.length ? (
                      <ul className="mt-3 grid gap-1.5">{e.map((x, i) => <li key={i}>✿ {x}</li>)}</ul>
                    ) : <p className="mt-3 text-muted-foreground">Nothing here yet... your words from the path will gather here.</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
