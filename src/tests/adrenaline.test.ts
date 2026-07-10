import { describe, expect, it } from "vitest";
import { simulateRotation } from "@/engine/simulate-rotation";
import { directAbility, multiAbility, step } from "./fixtures";

describe("adrenaline", () => {
  it("prevents an ability without enough adrenaline", () => {
    const result = simulateRotation({ rotation: [step("1", "multi")], abilities: [multiAbility], abilityDamage: 1000, startingAdrenaline: 10 });
    expect(result.totalDamage).toBe(0);
    expect(result.errors[0]).toContain("requires 15%");
  });

  it("applies adrenaline gain and cost", () => {
    const result = simulateRotation({ rotation: [step("1", "direct"), step("2", "multi")], abilities: [directAbility, multiAbility], abilityDamage: 1000, startingAdrenaline: 10 });
    expect(result.endingAdrenaline).toBe(3);
    expect(result.errors).toHaveLength(0);
  });

  it("caps adrenaline at 100%", () => {
    const result = simulateRotation({ rotation: [step("1", "direct")], abilities: [directAbility], abilityDamage: 1000, startingAdrenaline: 99 });
    expect(result.endingAdrenaline).toBe(100);
  });
});
