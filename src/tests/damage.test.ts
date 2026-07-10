import { describe, expect, it } from "vitest";
import { calculateExpectedDamage } from "@/engine/calculate-damage";
import { simulateRotation } from "@/engine/simulate-rotation";
import { directAbility, multiAbility, step } from "./fixtures";

describe("damage", () => {
  it("calculates the average multiplier", () => {
    expect(calculateExpectedDamage(2500, { tickOffset: 1, minMultiplier: 0.8, maxMultiplier: 1.2 })).toBe(2500);
  });

  it("calculates direct damage", () => {
    const result = simulateRotation({ rotation: [step("1", "direct")], abilities: [directAbility], abilityDamage: 1000, startingAdrenaline: 0 });
    expect(result.totalDamage).toBe(1000);
    expect(result.events.find((event) => event.type === "damage")?.tick).toBe(1);
  });

  it("calculates multiple hits", () => {
    const result = simulateRotation({ rotation: [step("1", "multi")], abilities: [multiAbility], abilityDamage: 1000, startingAdrenaline: 100 });
    expect(result.totalDamage).toBe(1500);
    expect(result.events.filter((event) => event.type === "damage")).toHaveLength(2);
  });
});
