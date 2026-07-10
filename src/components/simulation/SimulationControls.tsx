"use client";

import { useSimulation } from "@/hooks/use-simulation";
import { useSimulatorStore } from "@/stores/simulator-store";

export function SimulationControls() {
  const rotationLength = useSimulatorStore((state) => state.rotation.length);
  const { runSimulation } = useSimulation();
  return (
    <section className="simulation-cta">
      <div><span className="eyebrow">Combat engine</span><h2>Ready to test?</h2><p>Cooldowns, GCD, adrenaline, and effects will be processed tick by tick.</p></div>
      <button className="simulate-button" onClick={runSimulation} disabled={!rotationLength}><span>▶</span> Simulate rotation</button>
    </section>
  );
}
