"use client";

import type { Ability, RotationStep } from "@/engine/types";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import Image from "next/image";

export function RotationItem({ step, ability, index, onRemove }: { step: RotationStep; ability?: Ability; index: number; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: step.id });
  return (
    <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={`rotation-item ${isDragging ? "dragging" : ""}`}>
      <button className="drag-handle" {...attributes} {...listeners} aria-label={`Move ${ability?.name ?? step.abilityId}`}>⠿</button>
      <span className="step-number">{String(index + 1).padStart(2, "0")}</span>
      <span className={`mini-icon ${ability?.category ?? "basic"}`}>{ability ? <Image src={ability.image} alt="" width={36} height={36} unoptimized={ability.image.endsWith(".svg")} /> : "?"}</span>
      <span className="rotation-name"><b>{ability?.name ?? "Unknown ability"}</b><small>{ability ? `${ability.globalCooldownTicks * 0.6}s GCD · ${ability.category}` : step.abilityId}</small></span>
      <button className="remove-button" onClick={onRemove} aria-label={`Remove ${ability?.name ?? step.abilityId}`}>×</button>
    </li>
  );
}
