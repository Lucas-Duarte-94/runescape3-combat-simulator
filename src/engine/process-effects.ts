import { calculateExpectedDamage } from "./calculate-damage";
import type { Ability, EffectType } from "./types";

export interface PendingHit {
  tick: number;
  ability: Ability;
  baseDamage: number;
  effectType: EffectType;
}

export interface ActiveBuff {
  startTick: number;
  endTick: number;
  multiplier: number;
  ability: Ability;
}

export function collectAbilityEffects(
  ability: Ability,
  activationTick: number,
  abilityDamage: number,
): { hits: PendingHit[]; buffs: ActiveBuff[] } {
  const hits: PendingHit[] = [];
  const buffs: ActiveBuff[] = [];

  for (const effect of ability.effects) {
    if (effect.type === "buff" && effect.durationTicks && effect.damageMultiplier) {
      buffs.push({
        startTick: activationTick,
        endTick: activationTick + effect.durationTicks,
        multiplier: effect.damageMultiplier,
        ability,
      });
    }
    for (const hit of effect.hits ?? []) {
      hits.push({
        tick: activationTick + hit.tickOffset,
        ability,
        baseDamage: calculateExpectedDamage(abilityDamage, hit),
        effectType: effect.type,
      });
    }
  }
  return { hits, buffs };
}

export function damageWithBuffs(hit: PendingHit, buffs: ActiveBuff[]): number {
  if (hit.effectType === "bleed") return hit.baseDamage;
  return buffs
    .filter((buff) => hit.tick >= buff.startTick && hit.tick < buff.endTick)
    .reduce((damage, buff) => damage * buff.multiplier, hit.baseDamage);
}

