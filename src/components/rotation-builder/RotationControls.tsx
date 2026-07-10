"use client";

export function RotationControls({ count, onClear }: { count: number; onClear: () => void }) {
  return <div className="rotation-controls"><span>{count} {count === 1 ? "step" : "steps"}</span><button onClick={onClear} disabled={!count}>Clear rotation</button></div>;
}
