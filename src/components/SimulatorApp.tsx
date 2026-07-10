"use client";

import { AbilityList } from "./ability-list/AbilityList";
import { PlayerConfiguration } from "./configuration/PlayerConfiguration";
import { PlayerLevels } from "./configuration/PlayerLevels";
import { RotationBuilder } from "./rotation-builder/RotationBuilder";
import { SimulationControls } from "./simulation/SimulationControls";
import { SimulationResults } from "./simulation/SimulationResults";
import { Timeline } from "./simulation/Timeline";
import { EquipmentPanel } from "./equipment/EquipmentPanel";
import { abilities, useSimulatorStore } from "@/stores/simulator-store";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => undefined;

export function SimulatorApp() {
  const result = useSimulatorStore((state) => state.result);
  const hydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);
  if (!hydrated) return <div className="app-loading">Preparing the arsenal…</div>;

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="RS3 Rotation Lab"><span className="brand-mark">R<span>3</span></span><span><b>Rotation Lab</b><small>RS3 combat simulator</small></span></a>
        <div className="header-meta"><span className="version">MVP · v0.1</span><a href="https://runescape.wiki/w/Abilities" target="_blank" rel="noreferrer">Data: RuneScape Wiki ↗</a></div>
      </header>
      <main id="top">
        <section className="hero">
          <div className="hero-kicker"><span /> MELEE SIMULATOR</div>
          <h1>Plan. Simulate.<br /><em>Perfect.</em></h1>
          <p>Build your rotation, follow every game tick, and discover your expected damage before entering combat.</p>
          <div className="hero-facts"><span><b>0.6s</b> per tick</span><span><b>{abilities.length}</b> abilities</span><span><b>100%</b> local and private</span></div>
        </section>

        <PlayerConfiguration />
        <PlayerLevels />
        <EquipmentPanel />
        <div className="builder-grid"><AbilityList /><RotationBuilder /></div>
        <SimulationControls />
        {result && <div className="result-shell"><SimulationResults result={result} /><Timeline events={result.events} /></div>}
      </main>
      <footer><span>Rotation Lab</span><p>Theoretical simulation based on average damage. RuneScape is a trademark of Jagex Ltd.</p></footer>
    </>
  );
}
