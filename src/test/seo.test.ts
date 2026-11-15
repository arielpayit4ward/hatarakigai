import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { sitemapStaticPaths, sitemapXML } from "@/lib/sitemap";
import { pageHead, PUBLIC_URL, webApplication } from "@/lib/seo";

describe("Search privacy", () => {
  it("lists only the existing welcome and privacy pages", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(sitemapStaticPaths(router)).toEqual(["/", "/privacy"]);
  });

  for (const path of ["/threshold", "/table", "/compass", "/journal", "/one-sentence", "/step/1"]) {
    it(`keeps ${path} out of search`, () => {
      const head = pageHead(path, "Reflection", "Private writing");
      expect(head.meta.find((tag) => "name" in tag && tag.name === "robots")?.content).toBe("noindex, follow");
    });
  }

  it("does not invent sitemap change dates", () => {
    expect(sitemapXML(PUBLIC_URL, [{ path: "/" }, { path: "/privacy" }])).not.toContain("<lastmod>");
  });
});

describe("Application structured data", () => {
  it("identifies the free application and its author", () => {
    expect(webApplication.offers.price).toBe("0");
    expect(webApplication.author.name).toBe("Sarah Ennett");
    expect(webApplication.applicationCategory).toBe("LifestyleApplication");
  });
});