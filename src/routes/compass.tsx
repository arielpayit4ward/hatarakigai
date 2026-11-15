import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { copy } from "@/content/journey";
import { updateJournal, useJournal } from "@/lib/journal";

export const Route = createFileRoute("/compass")({
  staticData: { sitemap: true },
  head: () => ({ meta: [{ title: "The Compass Log · Work Worth Doing" }, { name: "description", content: "Log each small experiment and notice whether it moves you toward or away from meaning." }, { property: "og:title", content: "The Compass Log · Work Worth Doing" }, { property: "og:description", content: "Log each small experiment and notice whether it moves you toward or away from meaning." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Compass,
});

function Compass() {
  const j = useJournal();
  const [did, setDid] = useState("");
  const [happened, setHappened] = useState("");
  const [dial, setDial] = useState(0);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const entries = [...j.compass].sort((a, b) => a.date.localeCompare(b.date));
  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!did.trim()) return;
    updateJournal((x) => ({ ...x, compass: [...x.compass, { id: crypto.randomUUID(), date, did, happened, dial }] }));
    setDid(""); setHappened(""); setDial(0);
  };
  const W = Math.max(320, entries.length * 70);
  return (
    <Shell>
      <section className="mx-auto max-w-3xl py-6">
        <h1 className="text-5xl">{copy.compass.title}</h1>
        <p className="mt-4 text-lg">{copy.compass.intro}</p>

        <div className="journal-card mt-8 overflow-x-auto p-5">
          <h2 className="mb-2 text-2xl">Your trail</h2>
          {entries.length ? (
            <svg viewBox={`0 0 ${W} 180`} className="h-48 min-w-full" style={{ width: W }} role="img" aria-label="Trail of experiments, higher means toward meaning">
              <line x1="0" x2={W} y1="90" y2="90" stroke="var(--ink)" strokeOpacity=".25" strokeDasharray="3 4" />
              <text x="4" y="16" fontSize="11" fill="var(--ink)">toward</text>
              <text x="4" y="174" fontSize="11" fill="var(--ink)">away</text>
              <polyline fill="none" stroke="var(--bluebell)" strokeWidth="2" strokeLinecap="round"
                points={entries.map((e, i) => `${50 + i * 70},${90 - e.dial * 35}`).join(" ")} />
              {entries.map((e, i) => (
                <g key={e.id}>
                  <circle cx={50 + i * 70} cy={90 - e.dial * 35} r="8" fill={e.dial >= 0 ? "var(--turquoise)" : "var(--blossom)"} stroke="var(--ink)" />
                  <title>{e.date}: {e.did}</title>
                </g>
              ))}
            </svg>
          ) : <p className="text-muted-foreground">Your first experiment will start the trail.</p>}
        </div>

        <form onSubmit={add} className="dot-grid mt-8 grid gap-4 rounded-2xl border border-border p-5">
          <h2 className="text-2xl">A new entry</h2>
          <label>Date <input type="date" className="field mt-1 max-w-xs" value={date} onChange={(e) => setDate(e.target.value)} /></label>
          <label>What I did<textarea className="field mt-1" rows={2} value={did} onChange={(e) => setDid(e.target.value)} required /></label>
          <label>What happened<textarea className="field mt-1" rows={3} value={happened} onChange={(e) => setHappened(e.target.value)} /></label>
          <fieldset>
            <legend className="mb-2 font-semibold text-ink">{copy.compass.dialLabel}</legend>
            <div className="flex flex-wrap gap-2">
              {copy.compass.dial.map((label, i) => {
                const val = i - 2;
                return (
                  <button key={label} type="button" aria-pressed={dial === val} onClick={() => setDial(val)}
                    className={`rounded-full border px-3 py-1.5 text-sm ${dial === val ? "border-ink bg-secondary font-semibold" : "border-border bg-paper"}`}>{label}</button>
                );
              })}
            </div>
          </fieldset>
          <button className="btn justify-self-start" type="submit">Add to my log</button>
        </form>

        <ol className="mt-8 grid gap-4">
          {[...entries].reverse().map((e) => (
            <li key={e.id} className="journal-card p-5">
              <div className="flex justify-between gap-2">
                <p className="text-sm text-muted-foreground">{e.date} · {copy.compass.dial[e.dial + 2]}</p>
                <button type="button" className="text-sm underline" onClick={() => confirm("Remove this entry?") && updateJournal((x) => ({ ...x, compass: x.compass.filter((c) => c.id !== e.id) }))}>Remove</button>
              </div>
              <p className="mt-2"><strong className="text-ink">What I did:</strong> {e.did}</p>
              {e.happened && <p><strong className="text-ink">What happened:</strong> {e.happened}</p>}
            </li>
          ))}
        </ol>
      </section>
    </Shell>
  );
}
