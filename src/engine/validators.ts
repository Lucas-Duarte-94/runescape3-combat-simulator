import type { Ability } from "./types";

export function validateActivation(
  ability: Ability,
  tick: number,
  adrenaline: number,
  cooldowns: ReadonlyMap<string, number>,
): string | null {
  const readyAt = cooldowns.get(ability.id) ?? 0;
  if (tick < readyAt) {
    const remainingTicks = readyAt - tick;
    return `${ability.name} is on cooldown for ${remainingTicks} more tick${remainingTicks === 1 ? "" : "s"}.`;
  }
  if (adrenaline < ability.adrenalineCost) {
    return `${ability.name} requires ${ability.adrenalineCost}% adrenaline (${adrenaline}% available).`;
  }
  return null;
}
