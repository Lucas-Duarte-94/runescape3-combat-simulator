"use client";

import type { Equipment, EquipmentSlot, EquipmentStyle } from "@/engine/types";
import { useMemo, useState } from "react";
import { equipment, useSimulatorStore } from "@/stores/simulator-store";
import Image from "next/image";

const styleLabels: Record<EquipmentStyle, string> = { all: "All styles", melee: "Melee", ranged: "Ranged", magic: "Magic", necromancy: "Necromancy" };
const slotLabels: Record<EquipmentSlot | "all", string> = { all: "All slots", weapon: "Weapons", off_hand: "Off-hand", armour: "Armour sets", head: "Head", body: "Body", legs: "Legs", hands: "Hands", feet: "Feet", cape: "Capes", neck: "Neck", ring: "Rings" };
function EquipmentCard({ item }: { item: Equipment }) {
  const selected = useSimulatorStore((state) => state.selectedEquipmentIds.includes(item.id));
  const toggleEquipment = useSimulatorStore((state) => state.toggleEquipment);
  const [imageStage, setImageStage] = useState<0 | 1 | 2>(0);
  const fallback = item.style === "melee" ? "/abilities/melee-generic.svg" : item.style === "magic" ? "/abilities/constitution-generic.svg" : item.style === "necromancy" ? "/abilities/constitution-generic.svg" : "/abilities/defence-generic.svg";
  const image = imageStage === 0 ? item.image : fallback;
  const handedness = item.handedness === "two_handed" ? " · 2H" : "";
  const weaponStats = item.kind === "weapon" ? ` · Damage ${item.damage} · Accuracy ${item.accuracy}` : "";
  return <button className={`equipment-card ${selected ? "selected" : ""}`} onClick={() => toggleEquipment(item.id)} aria-pressed={selected} title={`${item.name}${item.tier ? ` · Tier ${item.tier}` : " · Best-in-slot"}${handedness}${weaponStats}`}>
    <span className="equipment-icon">
      <Image src={image} alt={`${item.name} equipment icon`} width={48} height={48} onError={() => setImageStage((stage) => stage < 2 ? (stage + 1) as 1 | 2 : 2)} />
    </span>
    {item.handedness === "two_handed" && <span className="two-handed-badge">2H</span>}
    <span className="equipment-tooltip" role="tooltip"><b>{item.name}</b><small>{item.tier ? `Tier ${item.tier}` : "Best-in-slot"} · {item.slot.replace("_", " ")}{handedness}</small>{item.kind === "weapon" && <small>Damage {item.damage} · Accuracy {item.accuracy}</small>}{item.styleBonus !== undefined && <small>{item.style === "melee" ? "Strength" : item.style} bonus {item.styleBonus}</small>}</span>
    <span className="equipment-check">{selected ? "✓" : "+"}</span>
  </button>;
}

function LoadoutItemImage({ item }: { item: Equipment }) {
  const [imageStage, setImageStage] = useState<0 | 1 | 2>(0);
  const fallback = item.style === "melee" ? "/abilities/melee-generic.svg" : item.style === "magic" || item.style === "necromancy" ? "/abilities/constitution-generic.svg" : "/abilities/defence-generic.svg";
  const image = imageStage === 0 ? item.image : fallback;
  return <span className="loadout-item-image">
    <Image src={image} alt={item.name} width={48} height={48} onError={() => setImageStage((stage) => stage < 2 ? (stage + 1) as 1 | 2 : 2)} />
  </span>;
}

const loadoutSlots: Array<{ slot: EquipmentSlot; label: string }> = [
  { slot: "head", label: "Head" },
  { slot: "cape", label: "Cape" },
  { slot: "neck", label: "Neck" },
  { slot: "body", label: "Body" },
  { slot: "weapon", label: "Main hand" },
  { slot: "off_hand", label: "Off-hand" },
  { slot: "legs", label: "Legs" },
  { slot: "hands", label: "Hands" },
  { slot: "feet", label: "Feet" },
  { slot: "ring", label: "Ring" },
];

function EquipmentLoadout() {
  const selectedIds = useSimulatorStore((state) => state.selectedEquipmentIds);
  const selectedItems = equipment.filter((item) => selectedIds.includes(item.id));
  const selectedForSlot = (slot: EquipmentSlot) => selectedItems.find((item) => item.slot === slot || (slot === "body" && item.slot === "armour"));
  return <aside className="loadout-display" aria-label="Equipped loadout preview">
    <div className="loadout-heading"><span className="eyebrow">In-game preview</span><strong>Equipped loadout</strong></div>
    <div className="loadout-character">
      <div className="character-glow" />
      <div className="character-silhouette" aria-hidden="true"><span className="silhouette-head" /><span className="silhouette-body" /><span className="silhouette-legs" /><span className="silhouette-feet" /></div>
      {loadoutSlots.map(({ slot, label }) => {
        const item = selectedForSlot(slot);
        return <div key={slot} className={`loadout-slot slot-${slot} ${item ? "filled" : "empty"}`} title={item?.name ?? `${label} slot empty`}>
          {item ? <><LoadoutItemImage item={item} />{item.handedness === "two_handed" && <span className="loadout-two-handed">2H</span>}<span className="slot-tooltip">{item.name}{item.handedness === "two_handed" ? " · 2H" : ""}</span></> : <span className="slot-placeholder">＋</span>}
          <small>{label}</small>
        </div>;
      })}
    </div>
    <div className="loadout-footer"><span>{selectedItems.length} item(s) equipped</span><span className="loadout-status">● local preset</span></div>
  </aside>;
}

export function EquipmentPanel() {
  const [style, setStyle] = useState<EquipmentStyle>("all");
  const [slot, setSlot] = useState<EquipmentSlot | "all">("all");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => equipment.filter((item) => (style === "all" || item.style === style || item.style === "all") && (slot === "all" || item.slot === slot) && item.name.toLowerCase().includes(query.toLowerCase())), [query, slot, style]);
  const selectedCount = useSimulatorStore((state) => state.selectedEquipmentIds.filter((id) => equipment.some((item) => item.id === id)).length);
  return <section className="panel equipment-panel" aria-labelledby="equipment-title">
    <div className="section-heading row-heading"><div><span className="eyebrow">Loadout</span><h2 id="equipment-title">High-tier equipment</h2></div><span className="count-badge">{selectedCount} selected</span></div>
    <p className="equipment-intro">Tier 90+ and current best-in-slot candidates. Selection is saved locally and will feed damage calculations in a later phase.</p>
    <div className="equipment-toolbar"><div className="search-shell"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search equipment..." aria-label="Search equipment" /></div><select value={style} onChange={(event) => setStyle(event.target.value as EquipmentStyle)} aria-label="Filter equipment by style">{Object.entries(styleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><select value={slot} onChange={(event) => setSlot(event.target.value as EquipmentSlot | "all")} aria-label="Filter equipment by slot">{Object.entries(slotLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
    <div className="equipment-layout"><div><div className="equipment-grid">{visible.map((item) => <EquipmentCard key={item.id} item={item} />)}</div>{!visible.length && <div className="equipment-empty">No matching equipment.</div>}</div><EquipmentLoadout /></div>
  </section>;
}
