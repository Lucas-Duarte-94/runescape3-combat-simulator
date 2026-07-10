"use client";

import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { abilities, useSimulatorStore } from "@/stores/simulator-store";
import { RotationControls } from "./RotationControls";
import { RotationItem } from "./RotationItem";

export function RotationBuilder() {
  const rotation = useSimulatorStore((state) => state.rotation);
  const removeAbility = useSimulatorStore((state) => state.removeAbility);
  const moveAbility = useSimulatorStore((state) => state.moveAbility);
  const clearRotation = useSimulatorStore((state) => state.clearRotation);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const oldIndex = rotation.findIndex((step) => step.id === active.id);
    const newIndex = rotation.findIndex((step) => step.id === over.id);
    moveAbility(oldIndex, newIndex);
  };

  return (
    <section className="panel rotation-panel" aria-labelledby="rotation-title">
      <div className="section-heading row-heading"><div><span className="eyebrow">Sequence</span><h2 id="rotation-title">Your rotation</h2></div><span className="live-dot">● editable</span></div>
      <RotationControls count={rotation.length} onClear={clearRotation} />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={rotation.map((step) => step.id)} strategy={verticalListSortingStrategy}>
          {rotation.length ? <ol className="rotation-list">{rotation.map((step, index) => <RotationItem key={step.id} step={step} index={index} ability={abilities.find((ability) => ability.id === step.abilityId)} onRemove={() => removeAbility(step.id)} />)}</ol> : <div className="empty-state"><span>⚔</span><h3>Build your first rotation</h3><p>Add abilities from the arsenal, then drag them to reorder.</p></div>}
        </SortableContext>
      </DndContext>
    </section>
  );
}
