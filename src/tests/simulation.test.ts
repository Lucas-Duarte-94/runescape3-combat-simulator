import { describe, expect, it } from "vitest";
import { simulateRotation } from "@/engine/simulate-rotation";
import type { Ability } from "@/engine/types";
import { directAbility, step } from "./fixtures";

describe("simulateRotation", () => {
  it("sorts events by tick", () => {
    const delayed = { ...directAbility, id: "delayed", name: "Delayed", effects: [{ type: "direct_damage" as const, hits: [{ tickOffset: 8, minMultiplier: 1, maxMultiplier: 1 }] }] };
    const result = simulateRotation({ rotation: [step("1", "delayed"), step("2", "direct")], abilities: [delayed, directAbility], abilityDamage: 1000, startingAdrenaline: 0 });
    expect(result.events.map((event) => event.tick)).toEqual([...result.events.map((event) => event.tick)].sort((a, b) => a - b));
  });

  it("calculates DPS using duration in ticks", () => {
    const result = simulateRotation({ rotation: [step("1", "direct")], abilities: [directAbility], abilityDamage: 1800, startingAdrenaline: 0 });
    expect(result.totalTicks).toBe(3);
    expect(result.totalSeconds).toBeCloseTo(1.8);
    expect(result.damagePerSecond).toBeCloseTo(1000);
  });

  it("applies a timed buff to direct damage but not bleeds", () => {
    const buff: Ability = { id: "buff", name: "Buff", description: "", image: "/abilities/berserk.png", category: "ultimate", style: "melee", cooldownTicks: 100, globalCooldownTicks: 3, adrenalineCost: 100, adrenalineGain: 0, effects: [{ type: "buff", durationTicks: 10, damageMultiplier: 2 }] };
    const bleed: Ability = { ...directAbility, id: "bleed", name: "Bleed", effects: [{ type: "bleed", hits: [{ tickOffset: 1, minMultiplier: 1, maxMultiplier: 1 }] }] };
    const result = simulateRotation({ rotation: [step("1", "buff"), step("2", "direct"), step("3", "bleed")], abilities: [buff, directAbility, bleed], abilityDamage: 1000, startingAdrenaline: 100 });
    expect(result.totalDamage).toBe(3000);
    expect(result.events.filter((event) => event.type === "buff_applied")).toHaveLength(1);
    expect(result.events.filter((event) => event.type === "buff_expired")).toHaveLength(1);
  });

  it("returns an empty result without a rotation", () => {
    const result = simulateRotation({ rotation: [], abilities: [], abilityDamage: 1000, startingAdrenaline: 50 });
    expect(result.totalTicks).toBe(0);
    expect(result.damagePerSecond).toBe(0);
    expect(result.endingAdrenaline).toBe(50);
  });
});
