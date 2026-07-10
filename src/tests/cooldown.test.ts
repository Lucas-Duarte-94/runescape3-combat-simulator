import { describe, expect, it } from "vitest";
import { simulateRotation } from "@/engine/simulate-rotation";
import { directAbility, step } from "./fixtures";

describe("cooldown and global cooldown", () => {
  it("prevents an ability during its cooldown", () => {
    const result = simulateRotation({ rotation: [step("1", "direct"), step("2", "direct")], abilities: [directAbility], abilityDamage: 1000, startingAdrenaline: 0 });
    expect(result.events.filter((event) => event.type === "ability_activated")).toHaveLength(1);
    expect(result.errors[0]).toContain("3 more ticks");
  });

  it("respects the GCD between different abilities", () => {
    const second = { ...directAbility, id: "second", name: "Second" };
    const result = simulateRotation({ rotation: [step("1", "direct"), step("2", "second")], abilities: [directAbility, second], abilityDamage: 1000, startingAdrenaline: 0 });
    expect(result.events.filter((event) => event.type === "ability_activated").map((event) => event.tick)).toEqual([0, 3]);
  });

  it("records an unknown ability and continues", () => {
    const result = simulateRotation({ rotation: [step("1", "missing"), step("2", "direct")], abilities: [directAbility], abilityDamage: 1000, startingAdrenaline: 0 });
    expect(result.errors[0]).toContain("Unknown ability");
    expect(result.events.find((event) => event.type === "ability_activated")?.tick).toBe(3);
  });
});
