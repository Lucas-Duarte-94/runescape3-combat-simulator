import {
  DEFAULT_GLOBAL_COOLDOWN_TICKS,
  MAX_ADRENALINE,
  MIN_ADRENALINE,
  TICK_DURATION_SECONDS,
} from "@/lib/constants";
import { collectAbilityEffects, damageWithBuffs, type ActiveBuff, type PendingHit } from "./process-effects";
import type { SimulationEvent, SimulationInput, SimulationResult } from "./types";
import { validateActivation } from "./validators";

export function simulateRotation(input: SimulationInput): SimulationResult {
  const abilityMap = new Map(input.abilities.map((ability) => [ability.id, ability]));
  const cooldowns = new Map<string, number>();
  const events: SimulationEvent[] = [];
  const hits: PendingHit[] = [];
  const buffs: ActiveBuff[] = [];
  const errors: string[] = [];
  let currentTick = 0;
  let adrenaline = clamp(input.startingAdrenaline);
  let eventIndex = 0;
  const addEvent = (event: Omit<SimulationEvent, "id">) =>
    events.push({ ...event, id: `event-${eventIndex++}` });

  for (const step of input.rotation) {
    const ability = abilityMap.get(step.abilityId);
    if (!ability) {
      const message = `Unknown ability: ${step.abilityId}.`;
      errors.push(message);
      addEvent({ tick: currentTick, type: "error", abilityId: step.abilityId, message });
      currentTick += DEFAULT_GLOBAL_COOLDOWN_TICKS;
      continue;
    }

    const validationError = validateActivation(ability, currentTick, adrenaline, cooldowns);
    if (validationError) {
      errors.push(validationError);
      addEvent({ tick: currentTick, type: "error", abilityId: ability.id, abilityName: ability.name, message: validationError, adrenaline });
      currentTick += ability.globalCooldownTicks || DEFAULT_GLOBAL_COOLDOWN_TICKS;
      continue;
    }

    adrenaline = clamp(adrenaline - ability.adrenalineCost + ability.adrenalineGain);
    cooldowns.set(ability.id, currentTick + ability.cooldownTicks);
    addEvent({
      tick: currentTick,
      type: "ability_activated",
      abilityId: ability.id,
      abilityName: ability.name,
      adrenaline,
      message: `${ability.name} activated.`,
    });

    const collected = collectAbilityEffects(ability, currentTick, input.abilityDamage);
    hits.push(...collected.hits);
    buffs.push(...collected.buffs);
    for (const buff of collected.buffs) {
      addEvent({ tick: buff.startTick, type: "buff_applied", abilityId: ability.id, abilityName: ability.name, message: `${ability.name}: damage ×${buff.multiplier}.` });
      addEvent({ tick: buff.endTick, type: "buff_expired", abilityId: ability.id, abilityName: ability.name, message: `${ability.name} ended.` });
    }
    currentTick += ability.globalCooldownTicks || DEFAULT_GLOBAL_COOLDOWN_TICKS;
  }

  let totalDamage = 0;
  for (const hit of hits) {
    const damage = damageWithBuffs(hit, buffs);
    totalDamage += damage;
    addEvent({
      tick: hit.tick,
      type: "damage",
      abilityId: hit.ability.id,
      abilityName: hit.ability.name,
      damage,
      message: `${hit.ability.name} dealt ${Math.round(damage).toLocaleString("en-US")} expected damage.`,
    });
  }

  events.sort((a, b) => a.tick - b.tick || eventPriority(a.type) - eventPriority(b.type));
  const lastEventTick = events.reduce((max, event) => Math.max(max, event.tick), 0);
  const totalTicks = Math.max(currentTick, lastEventTick, input.rotation.length ? 1 : 0);
  const totalSeconds = totalTicks * TICK_DURATION_SECONDS;

  return {
    totalTicks,
    totalSeconds,
    totalDamage,
    damagePerSecond: totalSeconds > 0 ? totalDamage / totalSeconds : 0,
    endingAdrenaline: adrenaline,
    events,
    errors,
  };
}

function clamp(value: number): number {
  return Math.min(MAX_ADRENALINE, Math.max(MIN_ADRENALINE, Number.isFinite(value) ? value : 0));
}

function eventPriority(type: SimulationEvent["type"]): number {
  return { buff_expired: 0, ability_activated: 1, buff_applied: 2, damage: 3, error: 4 }[type];
}
