export type WeaponRequirement = "any" | "dual_wield" | "two_handed";
export type EffectType = "direct_damage" | "multi_hit" | "bleed" | "buff" | "channelled";
export type CombatStyle = "melee" | "defence" | "constitution";
export type EquipmentStyle = "melee" | "ranged" | "magic" | "necromancy" | "all";
export type EquipmentSlot = "weapon" | "off_hand" | "armour" | "head" | "body" | "legs" | "hands" | "feet" | "cape" | "neck" | "ring";
export type EquipmentHandedness = "main_hand" | "off_hand" | "two_handed";
export type AbilityCategory = "basic" | "enhanced" | "threshold" | "ultimate" | "utility";

export interface AbilityHit {
  tickOffset: number;
  minMultiplier: number;
  maxMultiplier: number;
  canCrit?: boolean;
}

export interface AbilityEffect {
  type: EffectType;
  hits?: AbilityHit[];
  durationTicks?: number;
  damageMultiplier?: number;
  name?: string;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  image: string;
  externalImage?: string;
  category: AbilityCategory;
  style: CombatStyle;
  cooldownTicks: number;
  globalCooldownTicks: number;
  adrenalineCost: number;
  adrenalineGain: number;
  weaponRequirement?: WeaponRequirement;
  effects: AbilityEffect[];
  source?: { pageTitle: string; revisionId?: number; url?: string; checkedAt?: string };
}

export interface Equipment {
  id: string;
  name: string;
  style: EquipmentStyle;
  slot: EquipmentSlot;
  handedness?: EquipmentHandedness;
  tier?: number;
  kind: "weapon" | "armour" | "accessory";
  description: string;
  image: string;
  bestInSlot?: boolean;
  source?: { pageTitle: string; url?: string; checkedAt?: string };
}

export interface RotationStep { id: string; abilityId: string }

export type SimulationEventType =
  | "ability_activated"
  | "damage"
  | "buff_applied"
  | "buff_expired"
  | "error";

export interface SimulationEvent {
  id: string;
  tick: number;
  type: SimulationEventType;
  abilityId?: string;
  abilityName?: string;
  damage?: number;
  adrenaline?: number;
  message?: string;
}

export interface SimulationResult {
  totalTicks: number;
  totalSeconds: number;
  totalDamage: number;
  damagePerSecond: number;
  endingAdrenaline: number;
  events: SimulationEvent[];
  errors: string[];
}

export interface SimulationInput {
  rotation: RotationStep[];
  abilities: Ability[];
  abilityDamage: number;
  startingAdrenaline: number;
}
