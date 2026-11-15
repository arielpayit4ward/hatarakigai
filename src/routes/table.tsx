import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { copy, type Circle } from "@/content/journey";
import { circleEntries, useJournal } from "@/lib/journal";

export const Route = createFileRoute("/table")({
  head: () => ({ meta: [{ title: "The Design Table · Work Worth Doing" }, { name: "description", content: "A four circle design tool filled with your own words: Love, Skill, Value and Problem." }, { property: "og:title", content: "The Design Table · Work Worth Doing" }, { property: "og:description", content: "A four circle design tool filled with your own words: Love, Skill, Value and Problem." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Table,
});

const circles: { c: Circle; x: number; y: number; color: string }[] = [
  { c: "Love", x: 200, y: 130, color: "var(--blossom)" },
  { c: "Skill", x: 130, y: 200, color: "var(--turquoise)" },
  { c: "Value", x: 270, y: 200, color: "var(--softblue)" },
  { c: "Problem", x: 200, y: 270, color: "var(--bluebell)" },
];
const pairs: [Circle, Circle][] = [["Love", "Skill"], ["Love", "Value"], ["Skill", "Problem"], ["Value", "Problem"], ["Love", "Problem"], ["Skill", "Value"]];

function Table() {
  const j = useJournal();
  const [sel, setSel] = useState<Circle[]>(["Love"]);
  const pos = (c: Circle) => circles.find((x) => x.c === c)!;
  return (
    <Shell>
      <section className="py-6">
        <h1 className="text-5xl">{copy.table.title}</h1>
        <p className="mt-3 max-w-2xl text-lg">{copy.table.intro}</p>
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[400px_1fr]">
          <svg viewBox="0 0 400 400" className="mx-auto w-full max-w-sm" role="group" aria-label="Four circles">
            {circles.map((k) => (
              <g key={k.c}>
                <circle cx={k.x} cy={k.y} r={105} fill={k.color} fillOpacity={0.35} stroke="var(--ink)" strokeWidth={1} />
              </g>
            ))}
            {circles.map((k) => {
              const lx = k.x + (k.x - 200) * 0.9, ly = k.y + (k.y - 200) * 0.9;
              return (
                <g key={k.c + "l"} role="button" tabIndex={0} aria-label={`Show ${k.c}`} className="cursor-pointer"
                  onClick={() => setSel([k.c])} onKeyDown={(e) => e.key === "Enter" && setSel([k.c])}>
                  <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontFamily="var(--font-serif)" fontSize="22" fontWeight="600" fill="var(--ink)">{k.c}</text>
                </g>
              );
            })}
            {pairs.slice(0, 4).map(([a, b]) => {
              const A = pos(a), B = pos(b);
              const on = sel.length === 2 && sel.includes(a) && sel.includes(b);
              return (
                <circle key={a + b} cx={(A.x + B.x) / 2} cy={(A.y + B.y) / 2} r={14} role="button" tabIndex={0}
                  aria-label={`Show ${a} and ${b} side by side`} className="cursor-pointer"
                  fill={on ? "var(--ink)" : "var(--paper)"} stroke="var(--ink)" strokeDasharray="3 2"
                  onClick={() => setSel([a, b])} onKeyDown={(e) => e.key === "Enter" && setSel([a, b])} />
              );
            })}
            <text x="200" y="204" textAnchor="middle" fontFamily="var(--font-serif)" fontStyle="italic" fontSize="14" fill="var(--ink)">work</text>
          </svg>
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              {pairs.map(([a, b]) => (
                <button key={a + b} type="button" onClick={() => setSel([a, b])}
                  className={`rounded-full border px-3 py-1 text-sm ${sel.length === 2 && sel.includes(a) && sel.includes(b) ? "border-ink bg-secondary font-semibold" : "border-border"}`}>{a} + {b}</button>
              ))}
            </div>
            <div className={`grid gap-4 ${sel.length === 2 ? "sm:grid-cols-2" : ""}`}>
              {sel.map((c) => {
                const e = circleEntries(j, c);
                return (
                  <div key={c} className="dot-grid rounded-2xl border border-border p-5">
                    <h2 className="text-3xl">{c}</h2>
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
