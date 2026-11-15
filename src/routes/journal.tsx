import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Shell } from "@/components/Shell";
import { steps, copy } from "@/content/journey";
import { download, emptyJournal, flatten, setJournal, stepEntries, toMarkdown, useJournal, getRef, type Journal } from "@/lib/journal";

export const Route = createFileRoute("/journal")({
  staticData: { sitemap: false },
  head: () => pageHead("/journal", "My Journal · Work Worth Doing", "Print your pages, export as Markdown, save or restore a backup.", false),
  component: JournalPage,
});

function JournalPage() {
  const j = useJournal();
  const file = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const restore = async (f: File) => {
    try {
      const data = JSON.parse(await f.text()) as Journal;
      if (!data || typeof data !== "object" || !("steps" in data)) throw new Error();
      if (!confirm("Restore this backup? It will replace what is here now.")) return;
      setJournal({ ...emptyJournal(), ...data }); setMsg("Your backup is restored.");
    } catch { setMsg("That file did not look like a Work Worth Doing backup."); }
  };
  return (
    <Shell>
      <section className="no-print py-6">
        <h1 className="text-5xl">My Journal</h1>
        <p className="mt-3 max-w-xl text-lg">Your pages, gathered. Print them, keep a copy, or tuck a backup somewhere safe.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="btn" onClick={() => window.print()}>Print my pages</button>
          <button className="btn-ghost" onClick={() => download(`work-worth-doing-${today}.md`, toMarkdown(j))}>Export as Markdown</button>
          <button className="btn-ghost" onClick={() => download(`work-worth-doing-backup-${today}.json`, JSON.stringify(j, null, 2), "application/json")}>Save a backup</button>
          <button className="btn-ghost" onClick={() => file.current?.click()}>Restore a backup</button>
          <input ref={file} type="file" accept="application/json,.json" className="hidden" onChange={(e) => e.target.files?.[0] && restore(e.target.files[0])} />
          <button className="rounded-full border border-destructive px-4 py-2 text-sm font-semibold text-destructive"
            onClick={() => { if (confirm("Clear everything? This removes all your pages from this device and cannot be undone.") && confirm("Are you quite sure?")) { setJournal(emptyJournal()); setMsg("Everything is cleared."); } }}>
            Clear everything
          </button>
        </div>
        {msg && <p role="status" className="mt-3 text-ink">{msg}</p>}
      </section>
      <div className="grid gap-6">
        {steps.map((s) => {
          const e = s.id === "14" ? flatten(getRef(j, "14.pathways")) : stepEntries(j, s.id);
          return (
            <section key={s.id} className="print-page dot-grid rounded-2xl border border-border p-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{s.phase} · {s.mode}</p>
              <h2 className="text-3xl">{s.n}. {s.title}</h2>
              {j.steps[s.id]?.paper && <p className="text-sm italic text-muted-foreground">Done on paper</p>}
              {e.length ? <ul className="mt-3 grid gap-1">{e.map((x, i) => <li key={i}>✿ {x}</li>)}</ul> : <p className="mt-3 text-muted-foreground">An empty page, for now.</p>}
            </section>
          );
        })}
        {j.compass.length > 0 && (
          <section className="print-page dot-grid rounded-2xl border border-border p-6">
            <h2 className="text-3xl">{copy.compass.title}</h2>
            {j.compass.map((c) => <p key={c.id} className="mt-2"><strong>{c.date}</strong> {c.did}. {c.happened} ({copy.compass.dial[c.dial + 2]})</p>)}
          </section>
        )}
      </div>
    </Shell>
  );
}
