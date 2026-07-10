"use client";

import { calculateMeleeAbilityDamage, equipmentStyleBonus } from "@/engine/ability-damage";
import { equipment, useSimulatorStore } from "@/stores/simulator-store";

export function PlayerConfiguration() {
  const startingAdrenaline = useSimulatorStore((state) => state.startingAdrenaline);
  const strength = useSimulatorStore((state) => state.playerLevels.strength);
  const strengthBoost = useSimulatorStore((state) => state.strengthBoost);
  const meleeStyleBonus = useSimulatorStore((state) => state.meleeStyleBonus);
  const selectedEquipmentIds = useSimulatorStore((state) => state.selectedEquipmentIds);
  const setStrengthBoost = useSimulatorStore((state) => state.setStrengthBoost);
  const setMeleeStyleBonus = useSimulatorStore((state) => state.setMeleeStyleBonus);
  const setStartingAdrenaline = useSimulatorStore((state) => state.setStartingAdrenaline);
  const equipped = equipment.filter((item) => selectedEquipmentIds.includes(item.id));
  const equippedBonus = equipmentStyleBonus(equipped, "melee");
  const damage = calculateMeleeAbilityDamage(strength + strengthBoost, equipped, equippedBonus + meleeStyleBonus);

  return (
    <section className="panel config-panel" aria-labelledby="config-title">
      <div className="section-heading">
        <span className="eyebrow">Configuration</span>
        <h2 id="config-title">Your starting point</h2>
      </div>
      <div className="field-grid">
        <label className="field">
          <span>Calculated ability damage</span>
          <span className="input-shell calculated-damage"><b>⚔</b><output>{damage.total.toLocaleString("en-US")}</output></span>
          <small>{damage.setup.replace("_", " ")} · Level {damage.levelDamage} + weapon {damage.weaponDamage}</small>
        </label>
        <label className="field">
          <span>Strength boost</span>
          <span className="input-shell"><b>↑</b><input type="number" min={0} max={25} value={strengthBoost} onChange={(e) => setStrengthBoost(Number(e.target.value) || 0)} /></span>
          <small>Temporary potion boost. Effective Strength: {Math.min(145, strength + strengthBoost)}.</small>
        </label>
        <label className="field">
          <span>Additional melee bonus</span>
          <span className="input-shell"><b>＋</b><input type="number" min={0} max={1000} step="0.1" value={meleeStyleBonus} onChange={(e) => setMeleeStyleBonus(Number(e.target.value) || 0)} /></span>
          <small>Equipped armour: {equippedBonus.toFixed(1)} · Manual extras: {meleeStyleBonus.toFixed(1)}.</small>
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
