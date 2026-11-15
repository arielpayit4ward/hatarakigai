import { describe, expect, it } from "vitest";
import { toggleLimited, circleEntries, emptyJournal } from "@/lib/journal";

describe("journal rules", () => {
  it("allows at most ten values", () => {
    const ten = Array.from({ length: 10 }, (_, i) => `v${i}`);
    expect(toggleLimited(ten, "extra", 10)).toHaveLength(10);
  });
  it("puts joy audit answers in the Love circle", () => {
    const j = emptyJournal();
    j.steps["1"] = { v: { joys: ["Morning tea"] } };
    expect(circleEntries(j, "Love")).toEqual(["Morning tea"]);
    expect(circleEntries(j, "Skill")).toEqual([]);
  });
});
