import type { CombatSkill, PlayerLevels } from "@/engine/types";

export const combatSkills: Array<{ id: CombatSkill; label: string; hiscoreIndex: number }> = [
  { id: "attack", label: "Attack", hiscoreIndex: 1 },
  { id: "strength", label: "Strength", hiscoreIndex: 3 },
  { id: "defence", label: "Defence", hiscoreIndex: 2 },
  { id: "constitution", label: "Constitution", hiscoreIndex: 4 },
  { id: "ranged", label: "Ranged", hiscoreIndex: 5 },
  { id: "magic", label: "Magic", hiscoreIndex: 7 },
  { id: "prayer", label: "Prayer", hiscoreIndex: 6 },
  { id: "necromancy", label: "Necromancy", hiscoreIndex: 29 },
  { id: "summoning", label: "Summoning", hiscoreIndex: 24 },
];

export const defaultPlayerLevels: PlayerLevels = Object.fromEntries(combatSkills.map(({ id }) => [id, 99])) as PlayerLevels;

export function parseHiscores(raw: string): PlayerLevels {
  const rows = raw.trim().split(/\s+/);
  if (rows.length < 30) throw new Error("The official Hiscores response is incomplete.");
  return Object.fromEntries(combatSkills.map(({ id, hiscoreIndex }) => {
    const level = Number(rows[hiscoreIndex]?.split(",")[1]);
    if (!Number.isInteger(level) || level < 1) throw new Error(`Invalid ${id} level in the Hiscores response.`);
    return [id, Math.min(120, level)];
  })) as PlayerLevels;
}
