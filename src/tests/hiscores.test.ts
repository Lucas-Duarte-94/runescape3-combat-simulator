import { describe, expect, it } from "vitest";
import { parseHiscores } from "@/lib/hiscores";

describe("RuneScape Hiscores parser", () => {
  it("maps the official skill order to combat levels", () => {
    const rows = Array.from({ length: 30 }, (_, index) => `1,${index + 1},0`);
    const levels = parseHiscores(rows.join("\n"));
    expect(levels).toEqual({ attack: 2, strength: 4, defence: 3, constitution: 5, ranged: 6, magic: 8, prayer: 7, necromancy: 30, summoning: 25 });
  });

  it("rejects incomplete responses", () => {
    expect(() => parseHiscores("1,99,1000")).toThrow("incomplete");
  });
});
