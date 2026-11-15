import { createFileRoute, redirect } from "@tanstack/react-router";

// Old address kept so earlier links still land on the One Sentence page.
export const Route = createFileRoute("/one-word")({
  staticData: { sitemap: false },
  beforeLoad: () => { throw redirect({ to: "/one-sentence", statusCode: 301 }); },
});
