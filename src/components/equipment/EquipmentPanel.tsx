"use client";

import type { Equipment, EquipmentSlot, EquipmentStyle } from "@/engine/types";
import { useMemo, useState } from "react";
import { equipment, useSimulatorStore } from "@/stores/simulator-store";

const styleLabels: Record<EquipmentStyle, string> = { all: "All styles", melee: "Melee", ranged: "Ranged", magic: "Magic", necromancy: "Necromancy" };
const slotLabels: Record<EquipmentSlot | "all", string> = { all: "All slots", weapon: "Weapons", off_hand: "Off-hand", armour: "Armour sets", head: "Head", body: "Body", legs: "Legs", hands: "Hands", feet: "Feet", cape: "Capes", neck: "Neck", ring: "Rings" };
const remoteImages: Record<string, string> = {
  "noxious-scythe": "https://runescape.wiki/images/d/d3/Noxious_scythe.png", "masterwork-spear-annihilation": "https://runescape.wiki/images/3/3d/Masterwork_Spear_of_Annihilation.png", "zaros-godsword": "https://runescape.wiki/images/4/42/Zaros_godsword.png", "abyssal-scourge": "https://runescape.wiki/images/1/18/Abyssal_scourge.png", "dark-shard-leng": "https://runescape.wiki/images/8/81/Dark_Shard_of_Leng.png", "dark-sliver-leng": "https://runescape.wiki/images/4/44/Dark_Sliver_of_Leng.png", "ek-zekkil": "https://runescape.wiki/images/9/90/Ek-ZekKil.png", "tumekens-light": "https://runescape.wiki/images/9/94/Tumeken's_Light.png", "masterwork-2h-sword": "https://runescape.wiki/images/3/3f/Masterwork_2h_sword.png", "vestments-havoc": "https://runescape.wiki/images/f/fc/Vestments_of_Havoc.png", "masterwork-armour": "https://runescape.wiki/images/3/3a/Masterwork_armour.png", "noxious-longbow": "https://runescape.wiki/images/7/78/Noxious_longbow.png", "seren-godbow": "https://runescape.wiki/images/4/49/Seren_godbow.png", "blightbound-crossbow": "https://runescape.wiki/images/0/0e/Blightbound_crossbow.png", "off-hand-blightbound-crossbow": "https://runescape.wiki/images/c/c7/Off-hand_Blightbound_crossbow.png", "bow-last-guardian": "https://runescape.wiki/images/5/5c/Bow_of_the_Last_Guardian.png", "masterwork-bow": "https://runescape.wiki/images/3/38/Masterwork_bow.png", "elite-tectonic": "https://runescape.wiki/images/c/ce/Elite_tectonic_robe_armour.png", "seismic-wand": "https://runescape.wiki/images/1/13/Seismic_wand.png", "seismic-singularity": "https://runescape.wiki/images/b/ba/Seismic_singularity.png", "praesul-wand": "https://runescape.wiki/images/5/57/Wand_of_the_praesul.png", "imperium-core": "https://runescape.wiki/images/0/03/Imperium_core.png", "fractured-staff-armadyl": "https://runescape.wiki/images/3/3a/Fractured_Staff_of_Armadyl.png", "death-guard": "https://runescape.wiki/images/f/f4/Death_guard.png", "skull-lantern": "https://runescape.wiki/images/5/5a/Skull_lantern.png", omniguard: "https://runescape.wiki/images/9/95/Omni_guard.png", "deathdealer-robes": "https://runescape.wiki/images/1/12/Deathdealer_robes.png", "first-necromancer-robes": "https://runescape.wiki/images/9/95/First_Necromancer's_robes.png", "essence-of-finality": "https://runescape.wiki/images/d/d2/Essence_of_Finality.png", "reavers-ring": "https://runescape.wiki/images/3/31/Reaver's_ring.png", "champions-ring": "https://runescape.wiki/images/1/16/Champion's_ring.png",
};

function EquipmentCard({ item }: { item: Equipment }) {
  const selected = useSimulatorStore((state) => state.selectedEquipmentIds.includes(item.id));
  const toggleEquipment = useSimulatorStore((state) => state.toggleEquipment);
  const [imageStage, setImageStage] = useState<0 | 1 | 2>(0);
  const fallback = item.style === "melee" ? "/abilities/melee-generic.svg" : item.style === "magic" ? "/abilities/constitution-generic.svg" : item.style === "necromancy" ? "/abilities/constitution-generic.svg" : "/abilities/defence-generic.svg";
  const image = imageStage === 0 ? item.image : imageStage === 1 && remoteImages[item.id] ? remoteImages[item.id] : fallback;
  const handedness = item.handedness === "two_handed" ? " · 2H" : "";
  return <button className={`equipment-card ${selected ? "selected" : ""}`} onClick={() => toggleEquipment(item.id)} aria-pressed={selected} title={`${item.name}${item.tier ? ` · Tier ${item.tier}` : " · Best-in-slot"}${handedness}`}>
    <span className="equipment-icon">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={`${item.name} equipment icon`} width={54} height={54} onError={() => setImageStage((stage) => stage < 2 ? (stage + 1) as 1 | 2 : 2)} />
    </span>
    {item.handedness === "two_handed" && <span className="two-handed-badge">2H</span>}
    <span className="equipment-tooltip" role="tooltip"><b>{item.name}</b><small>{item.tier ? `Tier ${item.tier}` : "Best-in-slot"} · {item.slot.replace("_", " ")}{handedness}</small></span>
    <span className="equipment-check">{selected ? "✓" : "+"}</span>
  </button>;
}

function LoadoutItemImage({ item }: { item: Equipment }) {
  const [imageStage, setImageStage] = useState<0 | 1 | 2>(0);
  const fallback = item.style === "melee" ? "/abilities/melee-generic.svg" : item.style === "magic" || item.style === "necromancy" ? "/abilities/constitution-generic.svg" : "/abilities/defence-generic.svg";
  const image = imageStage === 0 ? item.image : imageStage === 1 && remoteImages[item.id] ? remoteImages[item.id] : fallback;
  return <span className="loadout-item-image">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={image} alt={item.name} onError={() => setImageStage((stage) => stage < 2 ? (stage + 1) as 1 | 2 : 2)} />
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
  const selectedCount = useSimulatorStore((state) => state.selectedEquipmentIds.length);
  return <section className="panel equipment-panel" aria-labelledby="equipment-title">
    <div className="section-heading row-heading"><div><span className="eyebrow">Loadout</span><h2 id="equipment-title">High-tier equipment</h2></div><span className="count-badge">{selectedCount} selected</span></div>
    <p className="equipment-intro">Tier 90+ and current best-in-slot candidates. Selection is saved locally and will feed damage calculations in a later phase.</p>
    <div className="equipment-toolbar"><div className="search-shell"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search equipment..." aria-label="Search equipment" /></div><select value={style} onChange={(event) => setStyle(event.target.value as EquipmentStyle)} aria-label="Filter equipment by style">{Object.entries(styleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><select value={slot} onChange={(event) => setSlot(event.target.value as EquipmentSlot | "all")} aria-label="Filter equipment by slot">{Object.entries(slotLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
    <div className="equipment-layout"><div><div className="equipment-grid">{visible.map((item) => <EquipmentCard key={item.id} item={item} />)}</div>{!visible.length && <div className="equipment-empty">No matching equipment.</div>}</div><EquipmentLoadout /></div>
  </section>;
}
