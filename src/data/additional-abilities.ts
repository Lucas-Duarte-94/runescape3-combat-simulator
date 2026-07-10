import type { Ability, AbilityCategory, CombatStyle } from "@/engine/types";

const source = { pageTitle: "Abilities — Combat Style Modernisation", url: "https://runescape.wiki/w/Combat_Style_Modernisation", checkedAt: "2026-07-10" };
const images: Record<CombatStyle, string> = {
  melee: "/abilities/melee-generic.svg",
  defence: "/abilities/defence-generic.svg",
  constitution: "/abilities/constitution-generic.svg",
};
const iconFileById: Record<string, string> = {
  fury: "fury.webp", "greater-fury": "greater-fury.webp", flurry: "flurry.webp", "greater-flurry": "greater-flurry.webp", punish: "punish.webp", barge: "barge.webp", "greater-barge": "greater-barge.webp", "bladed-dive": "bladed-dive.webp", slaughter: "slaughter.webp", massacre: "massacre.webp", pulverise: "pulverise.webp",
  devotion: "devotion.webp", anticipation: "anticipation.webp", bash: "bash.webp", provoke: "provoke.webp", preparation: "preparation.webp", freedom: "freedom.webp", resonance: "resonance.webp", reflect: "reflect.webp", revenge: "revenge.webp", debilitate: "debilitate.webp", immortality: "immortality.webp", rejuvenate: "rejuvenate.webp", barricade: "barricade.webp", "shield-dome": "shield-dome.webp", transfigure: "transfigure.webp", "defensive-stance": "defensive-stance.webp",
  sacrifice: "sacrifice.webp", siphon: "siphon.webp", incite: "incite.webp", "tuska-wrath": "tuska-wrath.webp", "storm-shards": "storm-shards.webp", "demon-slayer": "demon-slayer.webp", "dragon-slayer": "dragon-slayer.webp", shatter: "shatter.webp", reprisal: "reprisal.webp", "guthixs-blessing": "guthixs-blessing.webp", onslaught: "onslaught.webp", "ice-asylum": "ice-asylum.webp", "weapon-special-attack": "weapon-special-attack.webp",
};

function ability(
  id: string,
  name: string,
  style: CombatStyle,
  category: AbilityCategory,
  cooldownTicks: number,
  description: string,
  options: { cost?: number; gain?: number; min?: number; max?: number; hitOffsets?: number[]; weapon?: "any" | "dual_wield" | "two_handed" } = {},
): Ability {
  const { cost = 0, gain = category === "basic" ? 9 : 0, min, max, hitOffsets = [1], weapon = "any" } = options;
  const effects = min === undefined || max === undefined ? [] : [{ type: "direct_damage" as const, hits: hitOffsets.map((tickOffset) => ({ tickOffset, minMultiplier: min, maxMultiplier: max, canCrit: true })) }];
  return { id, name, style, category, description, image: iconFileById[id] ? `/abilities/${iconFileById[id]}` : images[style], cooldownTicks, globalCooldownTicks: 3, adrenalineCost: cost, adrenalineGain: gain, weaponRequirement: weapon, effects, source };
}

const melee: Ability[] = [
  ability("rend", "Rend", "melee", "basic", 17, "Slice through the target and generate two Bloodlust stacks.", { min: 1.35, max: 1.65, gain: 9 }),
  ability("fury", "Fury", "melee", "basic", 25, "Strike with fury; your next Melee attack gains critical chance.", { min: 1.1, max: 1.3 }),
  ability("greater-fury", "Greater Fury", "melee", "basic", 25, "A stronger Fury that guarantees the next non-bleed attack critically strikes.", { min: 1.2, max: 1.4 }),
  ability("flurry", "Flurry", "melee", "enhanced", 34, "Channel eight rapid dual-wield hits around you.", { cost: 25, min: 0.6, max: 0.7, hitOffsets: [1, 2, 3, 4, 5, 6, 7, 8], weapon: "dual_wield" }),
  ability("greater-flurry", "Greater Flurry", "melee", "enhanced", 34, "Flurry that extends Berserk by 0.6 seconds per hit.", { cost: 25, min: 0.6, max: 0.7, hitOffsets: [1, 2, 3, 4, 5, 6, 7, 8], weapon: "dual_wield" }),
  ability("punish", "Punish", "melee", "basic", 40, "Strike unexpectedly; deals 2.5x damage below 50% target life points.", { min: 1.1, max: 1.3 }),
  ability("barge", "Barge", "melee", "basic", 34, "Run up to the target, dealing damage and binding it.", { min: 0.75, max: 0.95 }),
  ability("greater-barge", "Greater Barge", "melee", "basic", 34, "Barge with extra damage based on time since your last attack.", { min: 0.75, max: 0.95 }),
  ability("dive", "Dive", "melee", "utility", 34, "Move up to 10 tiles toward a tile; can be cast during the global cooldown."),
  ability("bladed-dive", "Bladed Dive", "melee", "basic", 34, "Dash forward and strike enemies around the destination.", { min: 0.75, max: 0.95, weapon: "dual_wield" }),
  ability("slaughter", "Slaughter", "melee", "enhanced", 0, "Second cast of the Dismember sequence: a six-hit bleed.", { cost: 25, min: 0.8, max: 1, hitOffsets: [1, 4, 7, 10, 13, 16] }),
  ability("massacre", "Massacre", "melee", "enhanced", 0, "Third cast of the Dismember sequence: an initial hit followed by a bleed.", { cost: 25, min: 1.1, max: 1.3 }),
  ability("pulverise", "Pulverise", "melee", "ultimate", 100, "Charge a massive two-handed strike that reduces the target's damage.", { cost: 60, min: 3, max: 3.4, weapon: "two_handed" }),
];

const defenceEntries: Array<[string, string, AbilityCategory, number, string]> = [
  ["aggression", "Aggression", "utility", 150, "Force nearby enemies to attack you."], ["cease", "Cease", "utility", 0, "Stop all current and pending attacks."], ["unsullied", "Unsullied", "utility", 100, "Cleanse corruption and its damage penalty."], ["devotion", "Devotion", "threshold", 100, "Raise protection prayer effectiveness to 100%."], ["anticipation", "Anticipation", "basic", 41, "Reduce damage taken and become immune to stuns."], ["bash", "Bash", "basic", 25, "Slam your shield into the target."], ["provoke", "Provoke", "basic", 17, "Taunt the target and force it to attack you."], ["preparation", "Preparation", "basic", 25, "Prepare to reduce the next incoming damage."], ["freedom", "Freedom", "basic", 30, "Break free from stuns, binds, and other disabling effects."], ["resonance", "Resonance", "basic", 30, "Block the next hit and convert it into healing."], ["reflect", "Reflect", "basic", 30, "Reflect a portion of incoming damage."], ["revenge", "Revenge", "threshold", 75, "Gain damage for each attack received."], ["debilitate", "Debilitate", "threshold", 100, "Reduce damage dealt by the target."], ["immortality", "Immortality", "ultimate", 200, "Survive a lethal hit and prevent death temporarily."], ["rejuvenate", "Rejuvenate", "ultimate", 100, "Restore life points and prayer over time."], ["barricade", "Barricade", "ultimate", 100, "Summon an impenetrable dome of shields."], ["shield-dome", "Shield Dome", "utility", 60, "Reduce damage taken while standing behind your shield."], ["divert", "Divert", "basic", 30, "Divert the next attack into adrenaline."], ["transfigure", "Transfigure", "ultimate", 100, "Convert incoming damage into a powerful defensive effect."], ["defensive-stance", "Defensive Stance", "utility", 0, "Adopt a defensive combat stance."] ,
];
const defenceNames: Ability[] = defenceEntries.map(([id, name, category, cooldownTicks, description]) => ability(id, name, "defence", category, cooldownTicks, description, { gain: category === "basic" ? 9 : 0, weapon: "any" }));

const constitutionEntries: Array<[string, string, AbilityCategory, number, string]> = [
  ["eat-food", "Eat Food", "utility", 0, "Consume the first food in your backpack."], ["regenerate", "Regenerate", "utility", 0, "Spend adrenaline to heal over time."], ["sacrifice", "Sacrifice", "basic", 50, "Deal damage and heal for a portion of it."], ["siphon", "Siphon", "basic", 0, "Drain life from the target."], ["incite", "Incite", "basic", 0, "Force nearby enemies to focus on you."], ["tuska-wrath", "Tuska's Wrath", "basic", 50, "Deal increased damage based on the target's current life."], ["storm-shards", "Storm Shards", "basic", 0, "Mark the target for a future coordinated strike."], ["ingenuity-of-the-humans", "Ingenuity of the Humans", "utility", 120, "Guarantee the next ability's hit chance."], ["demon-slayer", "Demon Slayer", "utility", 100, "Increase damage against demons for 10.2 seconds."], ["dragon-slayer", "Dragon Slayer", "utility", 100, "Increase damage against dragons for 10.2 seconds."], ["undead-slayer", "Undead Slayer", "utility", 100, "Increase damage against undead for 10.2 seconds."], ["limitless", "Limitless", "utility", 150, "Remove adrenaline requirements temporarily."], ["slayers-insight", "Slayer's Insight", "utility", 150, "Gain an advantage against your Slayer target."], ["kuradals-favour", "Kuradal's Favour", "utility", 150, "Empower attacks against your Slayer assignment."], ["essence-of-finality", "Essence of Finality", "utility", 0, "Use the special attack stored in your amulet."], ["shatter", "Shatter", "threshold", 100, "Break through the target's defenses."], ["reprisal", "Reprisal", "threshold", 75, "Return a portion of recent damage to the target."], ["transfigure-constitution", "Transfigure", "ultimate", 100, "Convert life points into a powerful defensive effect."], ["guthixs-blessing", "Guthix's Blessing", "ultimate", 100, "Call on Guthix to restore life points and prayer."], ["onslaught", "Onslaught", "ultimate", 200, "Channel repeated high-damage hits while consuming adrenaline."], ["ice-asylum", "Ice Asylum", "ultimate", 100, "Create a healing area for allies."], ["weapon-special-attack", "Weapon Special Attack", "utility", 0, "Activate the special attack of your equipped weapon."]
];
const constitutionNames: Ability[] = constitutionEntries.map(([id, name, category, cooldownTicks, description]) => ability(id, name, "constitution", category, cooldownTicks, description, { cost: category === "threshold" ? 15 : category === "ultimate" ? 60 : 0, gain: category === "basic" ? 9 : 0 }));

export const additionalAbilities: Ability[] = [...melee, ...defenceNames, ...constitutionNames];
