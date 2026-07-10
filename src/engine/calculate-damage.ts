import type { AbilityHit } from "./types";

export function calculateExpectedDamage(abilityDamage: number, hit: AbilityHit): number {
  const averageMultiplier = (hit.minMultiplier + hit.maxMultiplier) / 2;
  return abilityDamage * averageMultiplier;
}

