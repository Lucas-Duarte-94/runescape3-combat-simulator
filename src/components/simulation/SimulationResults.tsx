"use client";

import type { SimulationResult } from "@/engine/types";
import { formatNumber, formatSeconds } from "@/lib/formatters";

export function SimulationResults({ result }: { result: SimulationResult }) {
  return (
    <section className="results-section" aria-labelledby="results-title">
      <div className="section-heading row-heading"><div><span className="eyebrow">Results</span><h2 id="results-title">Simulation summary</h2></div><span className={result.errors.length ? "status-warning" : "status-ok"}>{result.errors.length ? `${result.errors.length} warning(s)` : "✓ valid rotation"}</span></div>
      <div className="metric-grid">
        <article className="metric primary"><span>Total damage</span><strong>{formatNumber(result.totalDamage)}</strong><small>expected value</small></article>
        <article className="metric"><span>DPS</span><strong>{formatNumber(result.damagePerSecond)}</strong><small>damage per second</small></article>
        <article className="metric"><span>Duration</span><strong>{formatSeconds(result.totalSeconds)}</strong><small>{result.totalTicks} ticks</small></article>
        <article className="metric"><span>Ending adrenaline</span><strong>{formatNumber(result.endingAdrenaline)}%</strong><small>after the rotation</small></article>
      </div>
      {result.errors.length > 0 && <div className="error-summary"><b>Rotation completed with warnings</b><ul>{result.errors.map((error, index) => <li key={`${error}-${index}`}>{error}</li>)}</ul></div>}
    </section>
  );
}
