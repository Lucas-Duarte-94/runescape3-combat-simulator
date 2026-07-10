"use client";

import type { PlayerLevels as PlayerLevelsData } from "@/engine/types";
import { combatSkills } from "@/lib/hiscores";
import { useSimulatorStore } from "@/stores/simulator-store";
import { FormEvent, useState } from "react";

export function PlayerLevels() {
  const characterName = useSimulatorStore((state) => state.characterName);
  const levels = useSimulatorStore((state) => state.playerLevels);
  const setCharacterName = useSimulatorStore((state) => state.setCharacterName);
  const setPlayerLevel = useSimulatorStore((state) => state.setPlayerLevel);
  const setPlayerLevels = useSimulatorStore((state) => state.setPlayerLevels);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function importCharacter(event: FormEvent) {
    event.preventDefault();
    const player = characterName.trim();
    if (!player) return setMessage({ type: "error", text: "Enter a character name." });
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/hiscores?player=${encodeURIComponent(player)}`);
      const data = await response.json() as { player?: string; levels?: PlayerLevelsData; error?: string };
      if (!response.ok || !data.levels) throw new Error(data.error ?? "Could not import this character.");
      setPlayerLevels(data.levels);
      setCharacterName(data.player ?? player);
      setMessage({ type: "success", text: `Levels imported for ${data.player ?? player}.` });
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Could not reach RuneScape Hiscores." });
    } finally {
      setLoading(false);
    }
  }

  return <section className="panel levels-panel" aria-labelledby="levels-title">
    <div className="levels-heading">
      <div className="section-heading"><span className="eyebrow">Character</span><h2 id="levels-title">Combat levels</h2></div>
      <p>Set levels manually or import the public profile from the official RuneScape Hiscores.</p>
    </div>
    <form className="character-lookup" onSubmit={importCharacter}>
      <label htmlFor="character-name">Character name</label>
      <div><input id="character-name" maxLength={12} value={characterName} onChange={(event) => setCharacterName(event.target.value)} placeholder="RuneScape name" autoComplete="off" /><button type="submit" disabled={loading}>{loading ? "Importing…" : "Import levels"}</button></div>
      {message && <span className={`lookup-message ${message.type}`} role="status">{message.text}</span>}
    </form>
    <div className="levels-grid">
      {combatSkills.map(({ id, label }) => <label className="level-field" key={id}>
        <span>{label}</span>
        <input type="number" min={1} max={120} value={levels[id]} onChange={(event) => setPlayerLevel(id, Number(event.target.value) || 1)} aria-label={`${label} level`} />
      </label>)}
    </div>
  </section>;
}
