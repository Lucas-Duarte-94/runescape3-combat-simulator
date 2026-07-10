"use client";

import { useSimulatorStore } from "@/stores/simulator-store";

export function PlayerConfiguration() {
  const abilityDamage = useSimulatorStore((state) => state.abilityDamage);
  const startingAdrenaline = useSimulatorStore((state) => state.startingAdrenaline);
  const setAbilityDamage = useSimulatorStore((state) => state.setAbilityDamage);
  const setStartingAdrenaline = useSimulatorStore((state) => state.setStartingAdrenaline);

  return (
    <section className="panel config-panel" aria-labelledby="config-title">
      <div className="section-heading">
        <span className="eyebrow">Configuration</span>
        <h2 id="config-title">Your starting point</h2>
      </div>
      <div className="field-grid">
        <label className="field">
          <span>Ability damage</span>
          <span className="input-shell"><b>⚔</b><input type="number" min={1} max={100000} value={abilityDamage} onChange={(e) => setAbilityDamage(Math.max(1, Number(e.target.value) || 1))} /></span>
          <small>The base value shown in your offensive stats.</small>
        </label>
        <label className="field">
          <span>Starting adrenaline</span>
          <span className="input-shell"><b className="adrenaline-mark">◆</b><input type="number" min={0} max={100} value={startingAdrenaline} onChange={(e) => setStartingAdrenaline(Math.min(100, Math.max(0, Number(e.target.value) || 0)))} /><em>%</em></span>
          <small>From 0% to 100% before the first ability.</small>
        </label>
      </div>
    </section>
  );
}
