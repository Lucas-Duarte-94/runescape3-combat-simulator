import type { Equipment } from "./types";

export interface AbilityDamageBreakdown {
  total: number;
  levelDamage: number;
  weaponDamage: number;
  styleBonus: number;
  setup: "unarmed" | "main_hand" | "dual_wield" | "two_handed";
}

/** Post-2 March 2026 level scaling, equal to the old linear scaling at effective level 145. */
export function scaledCombatLevel(level: number): number {
  const effectiveLevel = Math.min(145, Math.max(1, level));
  return 145 * Math.log(1 + (0.6 * effectiveLevel) / 145) / Math.log(1.6);
}

export function calculateMeleeAbilityDamage(
  strengthLevel: number,
  equipped: Equipment[],
  styleBonus = 0,
): AbilityDamageBreakdown {
  const effectiveStrength = Math.min(145, Math.max(1, strengthLevel));
  const bonus = Math.max(0, styleBonus);
  const scaledLevel = scaledCombatLevel(effectiveStrength);
  const levelDamage = Math.floor(2.5 * scaledLevel);
  const mainHand = equipped.find((item) => item.slot === "weapon" && item.style === "melee");
  const offHand = equipped.find((item) => item.slot === "off_hand" && item.style === "melee");

  if (!mainHand?.tier) return { total: levelDamage + Math.floor(bonus), levelDamage, weaponDamage: 0, styleBonus: bonus, setup: "unarmed" };

  const mainTier = mainHand.tier;
  const mainWeaponDamage = Math.floor(9.6 * Math.min(mainTier, effectiveStrength) + bonus);
  if (mainHand.handedness === "two_handed") {
    const secondLevelDamage = Math.floor(1.25 * scaledLevel);
    const secondWeaponDamage = Math.floor(4.8 * mainTier + 0.5 * bonus);
    return {
      total: levelDamage + secondLevelDamage + mainWeaponDamage + secondWeaponDamage,
      levelDamage: levelDamage + secondLevelDamage,
      weaponDamage: mainWeaponDamage + secondWeaponDamage,
      styleBonus: bonus * 1.5,
      setup: "two_handed",
    };
  }

  if (offHand?.tier) {
    const offHandDamage = Math.floor(0.5 * (levelDamage + Math.floor(9.6 * Math.min(offHand.tier, effectiveStrength) + bonus)));
    return {
      total: levelDamage + mainWeaponDamage + offHandDamage,
      levelDamage: levelDamage + Math.floor(0.5 * levelDamage),
      weaponDamage: mainWeaponDamage + offHandDamage - Math.floor(0.5 * levelDamage),
      styleBonus: bonus * 1.5,
      setup: "dual_wield",
    };
  }

  return { total: levelDamage + mainWeaponDamage, levelDamage, weaponDamage: mainWeaponDamage, styleBonus: bonus, setup: "main_hand" };
}

export function equipmentStyleBonus(equipped: Equipment[], style: Equipment["style"]): number {
  return equipped
    .filter((item) => item.style === style || item.style === "all")
    .reduce((total, item) => total + (item.styleBonus ?? 0), 0);
}
