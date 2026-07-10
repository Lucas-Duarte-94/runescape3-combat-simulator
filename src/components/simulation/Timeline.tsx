"use client";

import type { SimulationEvent } from "@/engine/types";
import { formatNumber } from "@/lib/formatters";

const labels: Record<SimulationEvent["type"], string> = { ability_activated: "Activation", damage: "Damage", buff_applied: "Buff", buff_expired: "Buff ended", error: "Error" };

export function Timeline({ events }: { events: SimulationEvent[] }) {
  return (
    <section className="timeline-section" aria-labelledby="timeline-title">
      <div className="section-heading"><span className="eyebrow">Tick by tick</span><h2 id="timeline-title">Timeline</h2></div>
      {!events.length ? <p className="muted">No events generated.</p> : <ol className="timeline-list">
        {events.map((event) => <li key={event.id} className={`timeline-event ${event.type}`}>
          <div className="tick-marker"><span>{event.tick}</span><small>{formatNumber(event.tick * 0.6, 1)}s</small></div>
          <div className="timeline-rail"><i /></div>
          <div className="event-card">
            <div><span className="event-type">{labels[event.type]}</span>{event.abilityName && <b>{event.abilityName}</b>}</div>
            <p>{event.message}</p>
            {event.damage !== undefined && <strong className="damage-value">−{formatNumber(event.damage)} HP</strong>}
            {event.adrenaline !== undefined && event.type === "ability_activated" && <span className="event-adrenaline">◆ {event.adrenaline}%</span>}
          </div>
        </li>)}
      </ol>}
    </section>
  );
}
