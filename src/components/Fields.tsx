import { useEffect, useRef, useState } from "react";
import { SDGS, SUGGESTED_VALUES, type Field } from "@/content/journey";
import { getRef, gatherWithPrompt, sdgCounts, setStepValue, toggleLimited, useJournal } from "@/lib/journal";

export function FieldView({ stepId, field }: { stepId: string; field: Field }) {
  const j = useJournal();
  const v = "key" in field ? j.steps[stepId]?.v?.[field.key] : undefined;
  const set = (val: unknown) => "key" in field && setStepValue(stepId, field.key, val);

  switch (field.type) {
    case "list": return <ListField label={field.label} value={v ?? []} min={field.min} placeholder={field.placeholder} onChange={set} />;
    case "text":
      return (
        <label className="block">
          <span className="mb-1 block font-semibold text-ink">{field.label}</span>
          <textarea className="field min-h-28" rows={field.rows ?? 4} value={v ?? ""} placeholder={field.placeholder}
            onChange={(e) => set(e.target.value)} />
        </label>
      );
    case "tags": return <TagField value={v ?? []} placeholder={field.placeholder} onChange={set} />;
    case "timer": return <Timer minutes={field.minutes} label={field.label} />;
    case "links":
      return (
        <div className="flex flex-wrap gap-3">
          {field.links.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="btn-ghost">
              {l.label}{l.note ? ` (${l.note})` : ""} ↗
            </a>
          ))}
        </div>
      );
    case "copy": return <CopyBlock label={field.label} text={field.text} />;
    case "people": {
      const list: { name: string; reply: string }[] = v ?? [];
      return (
        <div className="grid gap-4">
          {Array.from({ length: field.count }, (_, i) => {
            const p = list[i] ?? { name: "", reply: "" };
            const upd = (k: "name" | "reply", val: string) => { const n = [...list]; n[i] = { ...p, [k]: val }; set(n); };
            return (
              <div key={i} className="journal-card p-4">
                <input aria-label={`Person ${i + 1} name`} className="field mb-2" placeholder={`Person ${i + 1}`} value={p.name} onChange={(e) => upd("name", e.target.value)} />
                <textarea aria-label={`Reply from person ${i + 1}`} className="field" rows={3} placeholder="What they said..." value={p.reply} onChange={(e) => upd("reply", e.target.value)} />
              </div>
            );
          })}
        </div>
      );
    }
    case "values": return <ValuesField value={v ?? { chosen: [], links: {} }} max={field.max} labels={getRef(j, field.labelsFrom) ?? []} onChange={set} />;
    case "problems": {
      const list: { text: string; scope: string }[] = v ?? [];
      return (
        <ol className="grid gap-2">
          {Array.from({ length: field.count }, (_, i) => {
            const p = list[i] ?? { text: "", scope: "" };
            const upd = (k: "text" | "scope", val: string) => { const n = [...list]; n[i] = { ...p, [k]: val }; set(n); };
            return (
              <li key={i} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <span className="w-6 font-serif text-lg text-ink">{i + 1}</span>
                <input aria-label={`Problem ${i + 1}`} className="field flex-1" value={p.text} placeholder="A problem I care about..." onChange={(e) => upd("text", e.target.value)} />
                <div role="group" aria-label="Scope" className="flex gap-1">
                  {["personal", "local", "global"].map((sc) => (
                    <button key={sc} type="button" aria-pressed={p.scope === sc} onClick={() => upd("scope", p.scope === sc ? "" : sc)}
                      className={`rounded-full border px-2.5 py-1 text-xs ${p.scope === sc ? "border-ink bg-secondary font-semibold" : "border-border"}`}>{sc}</button>
                  ))}
                </div>
              </li>
            );
          })}
        </ol>
      );
    }
    case "sdg": return <SdgField stepId={stepId} fieldKey={field.key} problems={(getRef(j, field.problemsFrom) ?? []).map((p: any) => p?.text).filter(Boolean)} />;
    case "choice":
      return (
        <fieldset>
          <legend className="mb-2 font-semibold text-ink">{field.label}</legend>
          <div className="flex flex-wrap gap-2">
            {field.options.map((o) => (
              <button key={o} type="button" aria-pressed={v === o} onClick={() => set(o)}
                className={`rounded-full border px-4 py-1.5 text-sm ${v === o ? "border-ink bg-secondary font-semibold" : "border-border bg-paper"}`}>{o}</button>
            ))}
          </div>
        </fieldset>
      );
    case "board": {
      const val: Record<string, string> = v ?? {};
      return (
        <div className="relative rounded-3xl border-4 border-double border-ink p-4 sm:p-8" style={{ background: "repeating-conic-gradient(color-mix(in oklab, var(--turquoise) 14%, var(--paper)) 0 25%, var(--paper) 0 50%) 0 0/48px 48px" }}>
          <p className="mb-4 text-center font-serif text-lg italic text-ink">The edges of the board... where creativity happens</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {field.edges.map((e) => (
              <label key={e.key} className="journal-card block p-3">
                <span className="mb-1 block font-semibold text-ink">{e.label}</span>
                <textarea className="field" rows={3} placeholder={e.placeholder} value={val[e.key] ?? ""} onChange={(ev) => set({ ...val, [e.key]: ev.target.value })} />
              </label>
            ))}
          </div>
        </div>
      );
    }
    case "gather": return <Gather />;
    case "pathways": return <Pathways stepId={stepId} fieldKey={field.key} count={field.count} />;
  }
}

function ListField({ label, value, min, placeholder, onChange }: { label?: string; value: string[]; min: number; placeholder: string; onChange: (v: string[]) => void }) {
  const rows = Math.max(min, value.length + (value[value.length - 1]?.trim() ? 1 : 0));
  return (
    <div>
      {label && <p className="mb-2 font-semibold text-ink">{label}</p>}
      <ul className="grid gap-2">
        {Array.from({ length: rows }, (_, i) => (
          <li key={i} className="flex items-center gap-2">
            <span aria-hidden className="text-blossom">✿</span>
            <input aria-label={`${label ?? placeholder} ${i + 1}`} className="field" placeholder={placeholder} value={value[i] ?? ""}
              onChange={(e) => { const n = [...value]; n[i] = e.target.value; onChange(n); }} />
          </li>
        ))}
      </ul>
      <p className="mt-2 text-sm text-muted-foreground">{value.filter((x) => x?.trim()).length} written. A new line appears as you go.</p>
    </div>
  );
}

function TagField({ value, placeholder, onChange }: { value: string[]; placeholder: string; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState("");
  const add = () => { const t = draft.trim(); if (t && !value.includes(t)) onChange([...value, t]); setDraft(""); };
  return (
    <div className="dot-grid rounded-2xl border border-border p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {value.map((t) => (
          <span key={t} className="ingredient">{t}
            <button type="button" aria-label={`Remove ${t}`} onClick={() => onChange(value.filter((x) => x !== t))} className="text-ink">×</button>
          </span>
        ))}
        {!value.length && <span className="text-sm text-muted-foreground">Your ingredients will appear here...</span>}
      </div>
      <input className="field" placeholder={placeholder} value={draft} aria-label="Add a label"
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }} onBlur={add} />
    </div>
  );
}

function Timer({ minutes, label }: { minutes: number; label: string }) {
  const [left, setLeft] = useState(minutes * 60);
  const [running, setRunning] = useState(false);
  const ref = useRef<number | null>(null);
  useEffect(() => {
    if (!running) return;
    ref.current = window.setInterval(() => setLeft((l) => (l <= 1 ? (setRunning(false), 0) : l - 1)), 1000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <div className="journal-card flex flex-wrap items-center gap-4 p-4">
      <span className="font-serif text-4xl tabular-nums text-ink" aria-live="polite">{mm}:{ss}</span>
      <span className="flex-1 text-sm text-muted-foreground">{left === 0 ? "Time. Pen down... how did that feel?" : label}</span>
      <button type="button" className="btn" onClick={() => setRunning((r) => !r)}>{running ? "Pause" : left === minutes * 60 ? "Start" : "Resume"}</button>
      <button type="button" className="btn-ghost" onClick={() => { setRunning(false); setLeft(minutes * 60); }}>Reset</button>
    </div>
  );
}

function CopyBlock({ label, text }: { label: string; text: string }) {
  const [done, setDone] = useState(false);
  return (
    <div className="dot-grid rounded-2xl border border-border p-4">
      <p className="mb-2 font-semibold text-ink">{label}</p>
      <p className="mb-3 whitespace-pre-wrap">{text}</p>
      <button type="button" className="btn-ghost" onClick={async () => { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); }}>
        {done ? "Copied" : "Copy message"}
      </button>
    </div>
  );
}

function ValuesField({ value, max, labels, onChange }: { value: { chosen: string[]; links: Record<string, string[]> }; max: number; labels: string[]; onChange: (v: any) => void }) {
  const [custom, setCustom] = useState("");
  const all = Array.from(new Set([...SUGGESTED_VALUES, ...value.chosen]));
  const toggle = (val: string) => onChange({ ...value, chosen: toggleLimited(value.chosen, val, max) });
  return (
    <div className="grid gap-5">
      <div>
        <p className="mb-2 text-sm text-muted-foreground">{value.chosen.length} of {max} chosen</p>
        <div className="flex flex-wrap gap-2">
          {all.map((val) => {
            const on = value.chosen.includes(val);
            return (
              <button key={val} type="button" aria-pressed={on} onClick={() => toggle(val)}
                disabled={!on && value.chosen.length >= max}
                className={`rounded-full border px-3 py-1 text-sm disabled:opacity-40 ${on ? "border-ink bg-secondary font-semibold" : "border-border bg-paper"}`}>{val}</button>
            );
          })}
        </div>
        <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); const t = custom.trim(); if (t) { toggle(t); setCustom(""); } }}>
          <input className="field" placeholder="Add your own value" value={custom} onChange={(e) => setCustom(e.target.value)} aria-label="Add your own value" />
          <button className="btn-ghost" type="submit">Add</button>
        </form>
      </div>
      {value.chosen.length > 0 && (
        <div className="grid gap-3">
          <p className="font-semibold text-ink">Link each value to your labels</p>
          {!labels.length && <p className="text-sm text-muted-foreground">Your labels from step 2 will appear here once you have written some.</p>}
          {value.chosen.map((val) => (
            <div key={val} className="journal-card p-3">
              <p className="mb-2 font-serif text-lg text-ink">{val}</p>
              <div className="flex flex-wrap gap-2">
                {labels.map((l) => {
                  const on = value.links[val]?.includes(l);
                  return (
                    <button key={l} type="button" aria-pressed={!!on}
                      onClick={() => { const cur = value.links[val] ?? []; onChange({ ...value, links: { ...value.links, [val]: on ? cur.filter((x) => x !== l) : [...cur, l] } }); }}
                      className={`ingredient ${on ? "font-semibold ring-2 ring-bluebell" : "opacity-70"}`}>{l}</button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SdgField({ stepId, fieldKey, problems }: { stepId: string; fieldKey: string; problems: string[] }) {
  const j = useJournal();
  const map: Record<string, number[]> = j.steps[stepId]?.v?.[fieldKey] ?? {};
  const counts = sdgCounts(j);
  const maxC = Math.max(1, ...counts.map((c) => c.count));
  if (!problems.length) return <p className="text-muted-foreground">Write a few of your twelve favourite problems first, and they will appear here.</p>;
  return (
    <div className="grid gap-6">
      {problems.map((p) => (
        <div key={p} className="journal-card p-4">
          <p className="mb-2 font-serif text-lg text-ink">{p}</p>
          <div className="flex flex-wrap gap-1.5">
            {SDGS.map((g, i) => {
              const on = map[p]?.includes(i);
              return (
                <button key={g} type="button" aria-pressed={!!on}
                  onClick={() => { const cur = map[p] ?? []; setStepValue(stepId, fieldKey, { ...map, [p]: on ? cur.filter((x) => x !== i) : [...cur, i] }); }}
                  className={`rounded-full border px-2.5 py-0.5 text-xs ${on ? "border-ink bg-turquoise/60 font-semibold" : "border-border"}`}>{i + 1}. {g}</button>
              );
            })}
          </div>
        </div>
      ))}
      <div>
        <h3 className="mb-3 text-2xl">Which goals light up</h3>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {SDGS.map((g, i) => {
            const c = counts.find((x) => x.i === i)!.count;
            return (
              <div key={g} className="rounded-xl border border-border p-2 text-center text-xs"
                style={{ background: `color-mix(in oklab, var(--bluebell) ${Math.round((c / maxC) * 45)}%, var(--paper))` }}>
                <span className="block font-serif text-lg text-ink">{i + 1}</span>{g}{c ? ` (${c})` : ""}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Gather() {
  const j = useJournal();
  const [text, setText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  return (
    <div className="dot-grid rounded-2xl border border-border p-4">
      <button type="button" className="btn" onClick={() => setText(gatherWithPrompt(j))}>Gather my pages</button>
      {text && (
        <div className="mt-4">
          <textarea readOnly className="field h-72 font-mono text-sm" value={text} aria-label="Your gathered pages" />
          <button type="button" className="btn-ghost mt-2" onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); }}>
            {copied ? "Copied, ready for Claude or ChatGPT" : "Copy all"}
          </button>
        </div>
      )}
    </div>
  );
}

type Pathway = { name: string; closeness: number; needs: string };
function Pathways({ stepId, fieldKey, count }: { stepId: string; fieldKey: string; count: number }) {
  const j = useJournal();
  const v = j.steps[stepId]?.v?.[fieldKey] ?? {};
  const list: Pathway[] = v.list ?? [];
  const set = (patch: any) => setStepValue(stepId, fieldKey, { ...v, ...patch });
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: count }, (_, i) => {
          const p = list[i] ?? { name: "", closeness: 0, needs: "" };
          const upd = (patch: Partial<Pathway>) => { const n = [...list]; n[i] = { ...p, ...patch }; set({ list: n }); };
          const chosen = v.chosen === i;
          return (
            <div key={i} className={`journal-card p-4 ${chosen ? "ring-2 ring-bluebell" : ""}`}>
              <input aria-label={`Pathway ${i + 1}`} className="field mb-2 font-serif text-lg" placeholder={`Pathway ${i + 1}`} value={p.name} onChange={(e) => upd({ name: e.target.value })} />
              <label className="mb-2 block text-sm">How close does this feel to ikigai, for you?
                <input type="range" min={0} max={5} value={p.closeness} onChange={(e) => upd({ closeness: +e.target.value })} className="w-full accent-[var(--ink)]" />
              </label>
              <textarea aria-label="What it would need" className="field mb-2" rows={2} placeholder="What it would need..." value={p.needs} onChange={(e) => upd({ needs: e.target.value })} />
              <button type="button" className={chosen ? "btn" : "btn-ghost"} onClick={() => set({ chosen: chosen ? null : i })}>{chosen ? "My chosen path" : "Choose this one"}</button>
            </div>
          );
        })}
      </div>
      <div className="journal-card p-5" style={{ background: "color-mix(in oklab, var(--turquoise) 18%, var(--paper))" }}>
        <h3 className="mb-2 text-2xl">My smallest experiment this week</h3>
        <textarea className="field mb-3" rows={3} placeholder="The smallest thing I can try..." value={v.experiment ?? ""} onChange={(e) => set({ experiment: e.target.value })} aria-label="My smallest experiment" />
        <label className="text-sm">By when <input type="date" className="field mt-1 max-w-xs" value={v.date ?? ""} onChange={(e) => set({ date: e.target.value })} /></label>
      </div>
    </div>
  );
}
