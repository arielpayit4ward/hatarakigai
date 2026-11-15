import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { GardenPath } from "@/components/GardenPath";
import { copy } from "@/content/journey";
import sprig from "@/assets/blossom-sprig.png";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Work Worth Doing: a hatarakigai companion" }, { name: "description", content: "Walk through twelve exercises and two closing steps to find work worth doing, privately, at your own pace." }, { property: "og:title", content: "Work Worth Doing: a hatarakigai companion" }, { property: "og:description", content: "Walk through twelve exercises and two closing steps to find work worth doing, privately, at your own pace." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Home,
});

function Home() {
  return (
    <Shell>
      <section className="grid items-center gap-6 py-6 sm:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-muted-foreground">Hatarakigai · 働き甲斐</p>
          <h1 className="text-5xl sm:text-6xl">Work Worth Doing</h1>
          <p className="mt-4 max-w-md text-lg">{copy.tagline}.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/threshold" className="btn">Begin at the threshold</Link>
            <Link to="/compass" className="btn-ghost">Open the Compass Log</Link>
          </div>
        </div>
        <img src={sprig} alt="Watercolour cherry blossom and bluebells" width={1024} height={768} className="mx-auto w-full max-w-sm" />
      </section>
      <section aria-labelledby="path" className="mt-6">
        <h2 id="path" className="text-center text-3xl">The path</h2>
        <p className="mx-auto mt-2 max-w-md text-center text-muted-foreground">{copy.pathIntro}</p>
        <ul className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
          {(["Reflect", "Check", "Test"] as const).map((m) => (
            <li key={m} className="flex items-center gap-2">
              <span aria-hidden className="h-3 w-3 rounded-full border border-ink" style={{ background: m === "Reflect" ? "var(--blossom)" : m === "Check" ? "var(--turquoise)" : "var(--bluebell)" }} />
              <strong>{m}</strong> <span className="text-muted-foreground">{copy.modes[m]}</span>
            </li>
          ))}
        </ul>
        <GardenPath />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { to: "/table" as const, t: "The Design Table", d: "Your words, gathered into four circles." },
            { to: "/compass" as const, t: "The Compass Log", d: "Toward or away from meaning?" },
            { to: "/one-word" as const, t: "One Sentence", d: "What makes work feel worth doing?" },
          ].map((c) => (
            <Link key={c.to} to={c.to} className="journal-card block p-5 transition-transform hover:-translate-y-0.5">
              <h3 className="text-2xl">{c.t}</h3><p className="text-muted-foreground">{c.d}</p>
            </Link>
          ))}
        </div>
      </section>
    </Shell>
  );
}
