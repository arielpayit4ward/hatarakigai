import { Link } from "@tanstack/react-router";
import { steps, type Mode } from "@/content/journey";
import { hasContent, useJournal } from "@/lib/journal";

const modeColor: Record<Mode, string> = {
  Reflect: "var(--blossom)",
  Check: "var(--turquoise)",
  Test: "var(--bluebell)",
};

export function GardenPath() {
  const j = useJournal();
  return (
    <ol className="relative mx-auto max-w-xl py-4">
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 1400">
        <path d="M50 0 C 90 100, 10 200, 50 300 S 90 500, 50 600 S 10 800, 50 900 S 90 1100, 50 1200 S 30 1350, 50 1400"
          fill="none" stroke="var(--ink)" strokeOpacity="0.25" strokeWidth="0.5" strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
      </svg>
      {steps.map((s, i) => {
        const st = j.steps[s.id];
        const filled = !!(st?.done || st?.paper || hasContent(j, s.id));
        const offset = ["ml-[8%]", "ml-[38%]", "ml-[58%]", "ml-[30%]"][i % 4];
        const showPhase = i === 0 || steps[i - 1]!.phase !== s.phase;
        return (
          <li key={s.id} className="relative">
            {showPhase && (
              <p className="relative my-6 text-center font-serif text-xl italic text-ink">{s.phase}</p>
            )}
            <Link to="/step/$id" params={{ id: s.id }}
              className={`group relative my-3 flex w-[62%] items-center gap-3 sm:w-[48%] ${offset}`}>
              <span className="relative grid h-16 w-20 shrink-0 place-items-center transition-transform duration-500 group-hover:scale-105">
                <svg viewBox="0 0 80 64" className="absolute inset-0 h-full w-full" aria-hidden>
                  <path d="M10 30 C 8 12, 30 4, 44 6 C 62 7, 76 18, 72 36 C 69 54, 46 60, 30 57 C 14 54, 11 44, 10 30 Z"
                    fill={filled ? modeColor[s.mode] : "var(--paper)"} fillOpacity={filled ? 0.75 : 1}
                    stroke="var(--ink)" strokeWidth={filled ? 1 : 1.2} strokeDasharray={filled ? "0" : "3 2"} />
                </svg>
                <span className="relative font-serif text-xl font-semibold text-ink">{s.n}</span>
              </span>
              <span className="leading-tight">
                <span className="block font-serif text-lg font-semibold text-ink group-hover:underline">{s.title}</span>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{s.mode}{filled ? " · in watercolour" : ""}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
