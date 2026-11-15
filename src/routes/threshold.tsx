import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { ESSAY_URL, threshold } from "@/content/journey";
import { updateJournal, useJournal } from "@/lib/journal";

export const Route = createFileRoute("/threshold")({
  staticData: { sitemap: true },
  head: () => ({ meta: [{ title: "The threshold · Work Worth Doing" }, { name: "description", content: "A welcome to ikigai and hatarakigai, with an optional five pillars warm up." }, { property: "og:title", content: "The threshold · Work Worth Doing" }, { property: "og:description", content: "A welcome to ikigai and hatarakigai, with an optional five pillars warm up." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Threshold,
});

function Threshold() {
  const j = useJournal();
  const { word, lines } = j.acrostic;
  const letters = word.replace(/[^a-zA-Z]/g, "").slice(0, 5).toUpperCase().split("");
  const setA = (patch: Partial<typeof j.acrostic>) => updateJournal((x) => ({ ...x, acrostic: { ...x.acrostic, ...patch } }));
  return (
    <Shell>
      <article className="mx-auto max-w-2xl py-6">
        <h1 className="text-5xl">{threshold.title}</h1>
        {threshold.intro.map((p) => <p key={p} className="mt-4 text-lg">{p}</p>)}
        <a href={ESSAY_URL} className="btn-ghost mt-6" target="_blank" rel="noreferrer">Read the essay ↗</a>

        <section className="journal-card mt-10 p-6">
          <h2 className="text-3xl">{threshold.warmup.title}</h2>
          <ol className="mt-4 grid gap-2">
            {threshold.warmup.pillars.map((p, i) => (
              <li key={p} className="flex gap-3"><span className="font-serif text-xl text-bluebell">{i + 1}</span>{p}</li>
            ))}
          </ol>
          <p className="mt-3 text-sm text-muted-foreground">{threshold.warmup.credit}</p>
          <p className="mt-6">{threshold.warmup.builder}</p>
          <ul className="mt-3 grid gap-1 rounded-2xl border border-border bg-paper p-4" aria-label="Sarah's BLOOM example">
            {threshold.warmup.example.map((e, i) => (
              <li key={i} className="flex items-baseline gap-3"><span className="w-6 font-serif text-2xl font-semibold text-ink">{e.letter}</span>{e.text}</li>
            ))}
          </ul>
          <p className="mt-4">{threshold.warmup.exampleAfter}</p>
          <input className="field mt-3 max-w-xs font-serif text-xl uppercase tracking-[0.3em]" maxLength={5} value={word}
            aria-label="Your five letter word" placeholder="Word" onChange={(e) => setA({ word: e.target.value })} />
          <div className="mt-4 grid gap-2">
            {letters.map((l, i) => (
              <label key={i} className="flex items-center gap-3">
                <span className="w-8 font-serif text-3xl text-ink">{l}</span>
                <input className="field" value={lines[i] ?? ""} aria-label={`Pillar for ${l}`} placeholder="My pillar..."
                  onChange={(e) => { const n = [...lines]; n[i] = e.target.value; setA({ lines: n }); }} />
              </label>
            ))}
          </div>
        </section>
        <Link to="/step/$id" params={{ id: "1" }} className="btn mt-10">Step onto the first stone</Link>
      </article>
    </Shell>
  );
}
