"use client";

import { abilities, useSimulatorStore } from "@/stores/simulator-store";
import type { AbilityCategory, CombatStyle } from "@/engine/types";
import { useMemo, useState } from "react";
import { AbilityCard } from "./AbilityCard";

export function AbilityList() {
  const addAbility = useSimulatorStore((state) => state.addAbility);
  const [styleFilter, setStyleFilter] = useState<"all" | CombatStyle>("melee");
  const [filter, setFilter] = useState<"all" | AbilityCategory>("all");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => abilities.filter((ability) =>
    (styleFilter === "all" || ability.style === styleFilter) && (filter === "all" || ability.category === filter) && ability.name.toLowerCase().includes(query.toLowerCase())), [filter, query, styleFilter]);

  return (
    <section className="panel ability-panel" aria-labelledby="abilities-title">
      <div className="section-heading row-heading">
        <div><span className="eyebrow">Arsenal</span><h2 id="abilities-title">Combat abilities</h2></div>
        <span className="count-badge">{visible.length}</span>
      </div>
      <div className="search-shell"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search abilities..." aria-label="Search abilities" /></div>
      <div className="filters style-filters" role="group" aria-label="Filter by combat style">
        {(["all", "melee", "defence", "constitution"] as const).map((value) => <button key={value} className={styleFilter === value ? "active" : ""} onClick={() => setStyleFilter(value)}>{value === "all" ? "All styles" : value === "constitution" ? "Constitution / HP" : value}</button>)}
      </div>
      <div className="filters" role="group" aria-label="Filter by category">
        {(["all", "basic", "enhanced", "threshold", "ultimate", "utility"] as const).map((value) => <button key={value} className={filter === value ? "active" : ""} onClick={() => setFilter(value)}>{value === "all" ? "All types" : value}</button>)}
      </div>
      <div className="ability-list">{visible.map((ability) => <AbilityCard key={ability.id} ability={ability} onAdd={() => addAbility(ability.id)} />)}</div>
    </section>
  );
}
