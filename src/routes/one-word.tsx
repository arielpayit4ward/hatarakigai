import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { copy, ESSAY_URL } from "@/content/journey";
import { updateJournal, useJournal } from "@/lib/journal";

export const Route = createFileRoute("/one-word")({
  head: () => ({ meta: [{ title: "One Sentence · Work Worth Doing" }, { name: "description", content: "In one sentence, what makes work feel worth doing, for you?" }, { property: "og:title", content: "One Sentence · Work Worth Doing" }, { property: "og:description", content: "In one sentence, what makes work feel worth doing, for you?" }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: OneWord,
});

function OneWord() {
  const j = useJournal();
  const [w, setW] = useState("");
  return (
    <Shell>
      <section className="mx-auto max-w-xl py-10 text-center">
        <h1 className="text-5xl">{copy.oneWord.title}</h1>
        <p className="mt-6 font-serif text-2xl italic text-ink">{copy.oneWord.question}</p>
        <form className="mt-6 grid justify-items-center gap-3" onSubmit={(e) => { e.preventDefault(); const t = w.trim(); if (!t) return;
          updateJournal((x) => ({ ...x, words: [...x.words, { word: t, date: new Date().toISOString().slice(0, 10) }] })); setW(""); }}>
          <textarea className="field text-center font-serif text-2xl" rows={3} value={w} onChange={(e) => setW(e.target.value)} aria-label="Your sentence" placeholder="Work feels worth doing when..." />
          <button className="btn" type="submit">Keep it</button>
        </form>
        <ul className="mt-10 grid gap-3">
          {[...j.words].reverse().map((x, i) => (
            <li key={i} className="journal-card p-4"><span className="font-serif text-2xl italic text-ink">{x.word}</span><span className="mt-1 block text-sm text-muted-foreground">{x.date}</span></li>
          ))}
        </ul>
        <a href={ESSAY_URL + "/comments"} target="_blank" rel="noreferrer" className="btn-ghost mt-8">{copy.oneWord.share} ↗</a>
      </section>
    </Shell>
  );
}
