import { describe, expect, it } from "vitest";
import { toggleLimited, circleEntries, emptyJournal, deleteSentence, setJournal } from "@/lib/journal";

describe("journal rules", () => {
  it("deletes only the selected sentence even when two entries match", () => {
    const j = emptyJournal();
    j.words = [
      { word: "Helping others", date: "2026-11-15" },
      { word: "Helping others", date: "2026-11-15" },
      { word: "Making things", date: "2026-11-15" },
    ];
    setJournal(j);
    deleteSentence(1);
    const saved = JSON.parse(localStorage.getItem("work-worth-doing.v1") ?? "{}");
    expect(saved.words).toEqual([j.words[0], j.words[2]]);
    setJournal(emptyJournal());
  });
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
