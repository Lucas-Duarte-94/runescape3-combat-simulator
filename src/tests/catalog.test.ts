import { describe, expect, it } from "vitest";
import { abilities, equipment } from "@/stores/simulator-store";

describe("post-March 2026 ability catalog", () => {
  it("contains the complete active Melee rotation set", () => {
    const melee = new Set(abilities.filter((ability) => ability.style === "melee").map((ability) => ability.name));
    expect(melee).toEqual(new Set([
      "Attack", "Adaptive Strike", "Rend", "Backhand", "Fury", "Greater Fury", "Punish", "Barge", "Greater Barge", "Dive", "Bladed Dive", "Dismember", "Slaughter", "Massacre", "Assault", "Flurry", "Greater Flurry", "Hurricane", "Overpower", "Berserk", "Pulverise", "Meteor Strike", "Chaos Roar",
    ]));
    expect(melee.has("Slice")).toBe(false);
    expect(melee.has("Cleave")).toBe(false);
    expect(melee.has("Destroy")).toBe(false);
  });

  it("includes Defence and Constitution/HP catalogs", () => {
    expect(abilities.filter((ability) => ability.style === "defence").length).toBe(20);
    expect(abilities.filter((ability) => ability.style === "constitution").length).toBe(22);
    expect(abilities.every((ability) => ability.image.startsWith("/abilities/"))).toBe(true);
  });

  it("contains only tier 90+ or best-in-slot equipment", () => {
    expect(equipment.length).toBe(31);
    expect(equipment.every((item) => (item.tier ?? 0) >= 90 || item.bestInSlot)).toBe(true);
    expect(new Set(equipment.map((item) => item.style))).toEqual(new Set(["melee", "ranged", "magic", "necromancy", "all"]));
  });
});
