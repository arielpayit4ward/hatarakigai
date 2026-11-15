import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { FieldView } from "@/components/Fields";
import { steps } from "@/content/journey";
import { setStepFlag, useJournal } from "@/lib/journal";

export const Route = createFileRoute("/step/$id")({
  loader: ({ params }) => {
    const step = steps.find((s) => s.id === params.id);
    if (!step) throw notFound();
    return { title: step.title, why: step.why };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.title} · Work Worth Doing` : "Step · Work Worth Doing";
    const d = loaderData?.why ?? "A step on the path to work worth doing.";
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" }] };
  },
  component: StepPage,
});

function StepPage() {
  const { id } = Route.useParams();
  const j = useJournal();
  const idx = steps.findIndex((s) => s.id === id);
  const step = steps[idx]!;
  const st = j.steps[id];
  const prev = steps[idx - 1];
  const next = steps[idx + 1];
  return (
    <Shell>
      <article key={id} className="mx-auto max-w-3xl py-6 fade-in">
        <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
          {step.phase}{step.group ? ` · ${step.group}` : ""} · <span className="font-semibold text-ink">{step.mode}</span>
        </p>
        <h1 className="mt-2 text-5xl"><span className="text-bluebell">{step.n}.</span> {step.title}</h1>
        <p className="mt-5 text-lg">{step.why}</p>
        <p className="mt-4 rounded-2xl border-l-4 border-blossom bg-paper p-4 font-serif text-xl italic text-ink">{step.prompt}</p>
        {step.kind && <p className="mt-3 text-muted-foreground">{step.kind}</p>}
        <div className="mt-8 grid gap-8">
          {step.fields.map((f, i) => <FieldView key={i} stepId={id} field={f} />)}
        </div>
        <div className="mt-10 flex flex-wrap gap-6 border-t border-border pt-6">
          <label className="flex items-center gap-2"><input type="checkbox" className="h-5 w-5 accent-[var(--ink)]" checked={!!st?.paper} onChange={(e) => setStepFlag(id, "paper", e.target.checked)} />Done on paper</label>
          <label className="flex items-center gap-2"><input type="checkbox" className="h-5 w-5 accent-[var(--ink)]" checked={!!st?.done} onChange={(e) => setStepFlag(id, "done", e.target.checked)} />I'm happy with this for now</label>
          <span className="text-sm text-muted-foreground">Saved as you write, on this device only.</span>
        </div>
        {step.mode !== "Test" && next?.mode === "Test" && (
          <p className="mt-6 text-muted-foreground">Reflection is lovely... but do not linger too long here. The next stone asks you to try something in the real world.</p>
        )}
        <nav className="mt-8 flex justify-between gap-3" aria-label="Steps">
          {prev ? <Link to="/step/$id" params={{ id: prev.id }} className="btn-ghost">← {prev.title}</Link> : <Link to="/threshold" className="btn-ghost">← Threshold</Link>}
          {next ? <Link to="/step/$id" params={{ id: next.id }} className="btn">{next.title} →</Link> : <Link to="/compass" className="btn">To the Compass Log →</Link>}
        </nav>
      </article>
    </Shell>
  );
}
