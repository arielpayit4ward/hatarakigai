import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SITE_URL } from "@/content/journey";

const nav = [
  { to: "/", label: "Path" },
  { to: "/table", label: "Design Table" },
  { to: "/compass", label: "Compass Log" },
  { to: "/one-sentence", label: "One Sentence" },
  { to: "/journal", label: "My Journal" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="no-print mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-5">
        <Link to="/" className="font-serif text-2xl font-semibold text-ink">Work Worth Doing</Link>
        <nav aria-label="Main" className="flex flex-wrap gap-1 text-sm">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="rounded-full px-3 py-1.5 text-foreground hover:bg-secondary"
              activeProps={{ className: "bg-secondary font-semibold" }} activeOptions={{ exact: true }}>
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 pb-16 fade-in">{children}</main>
      <footer className="no-print border-t border-border/70 py-8 text-sm text-muted-foreground">
        <div className="mx-auto flex max-w-5xl flex-wrap justify-between gap-3 px-5">
          <p>Made with care by Sarah, Seeking Ikigai</p>
          <div className="flex flex-wrap gap-4">
            <a href={SITE_URL} className="underline">seekingikigai.online</a>
            <Link to="/privacy" className="underline">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
