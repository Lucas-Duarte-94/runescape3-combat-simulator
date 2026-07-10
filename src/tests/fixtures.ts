import type { Ability } from "@/engine/types";

export const directAbility: Ability = {
  id: "direct", name: "Direct", description: "", image: "/abilities/attack.png", category: "basic", style: "melee",
  cooldownTicks: 6, globalCooldownTicks: 3, adrenalineCost: 0, adrenalineGain: 8,
  effects: [{ type: "direct_damage", hits: [{ tickOffset: 1, minMultiplier: 0.8, maxMultiplier: 1.2 }] }],
};

export const multiAbility: Ability = {
  id: "multi", name: "Multi", description: "", image: "/abilities/assault.png", category: "threshold", style: "melee",
  cooldownTicks: 10, globalCooldownTicks: 3, adrenalineCost: 15, adrenalineGain: 0,
  effects: [{ type: "multi_hit", hits: [
    { tickOffset: 1, minMultiplier: 0.4, maxMultiplier: 0.6 },
    { tickOffset: 2, minMultiplier: 0.9, maxMultiplier: 1.1 },
  ] }],
};

export const step = (id: string, abilityId: string) => ({ id, abilityId });
