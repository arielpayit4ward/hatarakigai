import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";

export const Route = createFileRoute("/privacy")({
  staticData: { sitemap: true },
  head: () => ({ meta: [{ title: "Privacy · Work Worth Doing" }, { name: "description", content: "Everything you write stays in your own browser. No accounts, no server, no analytics on your answers." }, { property: "og:title", content: "Privacy · Work Worth Doing" }, { property: "og:description", content: "Everything you write stays in your own browser. No accounts, no server, no analytics on your answers." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Privacy,
});

function Privacy() {
  return (
    <Shell>
      <article className="mx-auto max-w-2xl py-8 text-lg">
        <h1 className="text-5xl">Your pages are yours</h1>
        <p className="mt-6">Everything you write here is saved in this browser, on this device, and nowhere else.</p>
        <ul className="mt-4 grid gap-2">
          <li>✿ No accounts and no sign in.</li>
          <li>✿ Your pages are never stored on a server.</li>
          <li>✿ No analytics on what you write.</li>
          <li>✿ One exception, only if you choose it: when you press "Give me an AI idea" on the Design Table, up to four of your answers, picked at random, are sent to an AI service to make one idea. Nothing is kept there, and nothing else ever leaves your device.</li>
          <li>✿ If you paste your pages into another AI tool yourself, that happens outside this app.</li>
        </ul>
        <p className="mt-4">Because it lives in your browser, clearing your browser data will clear your pages too. I would gently suggest saving a backup now and then from <Link to="/journal" className="underline">My Journal</Link>.</p>
      </article>
    </Shell>
  );
}
