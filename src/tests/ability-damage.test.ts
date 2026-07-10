import { describe, expect, it } from "vitest";
import { calculateMeleeAbilityDamage, equipmentStyleBonus, scaledCombatLevel } from "@/engine/ability-damage";
import type { Equipment } from "@/engine/types";

const weapon = (id: string, slot: "weapon" | "off_hand", tier: number, handedness?: "two_handed"): Equipment => ({
  id, name: id, style: "melee", slot, tier, handedness, kind: "weapon", description: "", image: "",
});

describe("post-March 2026 melee ability damage", () => {
  it("uses logarithmic level scaling that converges with the former formula at 145", () => {
    expect(scaledCombatLevel(145)).toBeCloseTo(145);
    expect(scaledCombatLevel(20)).toBeGreaterThan(20);
  });

  it("calculates main-hand, dual-wield and two-handed setups", () => {
    const main = calculateMeleeAbilityDamage(99, [weapon("main", "weapon", 90)], 0);
    const dual = calculateMeleeAbilityDamage(99, [weapon("main", "weapon", 90), weapon("off", "off_hand", 90)], 0);
    const twoHanded = calculateMeleeAbilityDamage(99, [weapon("2h", "weapon", 90, "two_handed")], 0);
    expect(main.setup).toBe("main_hand");
    expect(dual.total).toBeGreaterThan(main.total);
    expect(twoHanded.total).toBe(dual.total);
  });

  it("caps the main-hand weapon contribution by effective Strength", () => {
    expect(calculateMeleeAbilityDamage(50, [weapon("high", "weapon", 100)], 0).weaponDamage)
      .toBe(calculateMeleeAbilityDamage(50, [weapon("matched", "weapon", 50)], 0).weaponDamage);
  });

  it("sums only offensive bonuses matching the selected style", () => {
    const meleeArmour = { ...weapon("melee-armour", "weapon", 90), kind: "armour" as const, slot: "head" as const, styleBonus: 28 };
    const magicArmour = { ...meleeArmour, id: "magic-armour", style: "magic" as const, styleBonus: 23 };
    expect(equipmentStyleBonus([meleeArmour, magicArmour], "melee")).toBe(28);
  });
});
