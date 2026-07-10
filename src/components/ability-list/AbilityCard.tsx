"use client";

import type { Ability } from "@/engine/types";
import Image from "next/image";

export function AbilityCard({ ability, onAdd }: { ability: Ability; onAdd: () => void }) {
  const damageEffect = ability.effects.find((effect) => effect.hits?.length);
  const average = damageEffect?.hits?.reduce((sum, hit) => sum + (hit.minMultiplier + hit.maxMultiplier) / 2, 0);
  return (
    <article className={`ability-card ${ability.category}`}>
      <div className="ability-icon"><Image src={ability.image} alt={`${ability.name} ability icon`} width={48} height={48} unoptimized={ability.image.endsWith(".svg")} /></div>
      <div className="ability-copy">
        <div className="ability-title-row"><h3>{ability.name}</h3><span className={`category-pill ${ability.category}`}>{ability.category}</span><span className="style-pill">{ability.style === "constitution" ? "HP" : ability.style}</span></div>
        <p>{ability.description}</p>
        <div className="ability-stats">
          <span title="Cooldown">↻ {ability.cooldownTicks * 0.6}s</span>
          <span title="Adrenaline">◆ {ability.adrenalineCost ? `−${ability.adrenalineCost}%` : `+${ability.adrenalineGain}%`}</span>
          {average ? <span title="Average damage">≈ {Math.round(average * 100)}%</span> : <span>{ability.category === "utility" ? "Utility" : "Effect"}</span>}
        </div>
      </div>
      <button className="add-button" onClick={onAdd} aria-label={`Add ${ability.name} to the rotation`}>+</button>
    </article>
  );
}
