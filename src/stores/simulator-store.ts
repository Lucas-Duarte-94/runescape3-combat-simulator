"use client";

import abilitiesData from "@/data/melee-abilities.json";
import { additionalAbilities } from "@/data/additional-abilities";
import equipmentData from "@/data/equipment.json";
import { simulateRotation } from "@/engine/simulate-rotation";
import type { Ability, Equipment, RotationStep, SimulationResult } from "@/engine/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const abilities = [...(abilitiesData as Ability[]), ...additionalAbilities];
export const equipment = equipmentData as Equipment[];

interface SimulatorStore {
  abilityDamage: number;
  startingAdrenaline: number;
  rotation: RotationStep[];
  result: SimulationResult | null;
  selectedAbilityId: string | null;
  selectedEquipmentIds: string[];
  setAbilityDamage: (value: number) => void;
  setStartingAdrenaline: (value: number) => void;
  setSelectedAbilityId: (id: string | null) => void;
  toggleEquipment: (equipmentId: string) => void;
  addAbility: (abilityId: string) => void;
  removeAbility: (stepId: string) => void;
  moveAbility: (from: number, to: number) => void;
  clearRotation: () => void;
  setResult: (result: SimulationResult | null) => void;
  runSimulation: () => void;
}

const makeStepId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `step-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const useSimulatorStore = create<SimulatorStore>()(
  persist(
    (set, get) => ({
      abilityDamage: 2500,
      startingAdrenaline: 100,
      rotation: [],
      result: null,
      selectedAbilityId: null,
      selectedEquipmentIds: [],
      setAbilityDamage: (abilityDamage) => set({ abilityDamage, result: null }),
      setStartingAdrenaline: (startingAdrenaline) => set({ startingAdrenaline, result: null }),
      setSelectedAbilityId: (selectedAbilityId) => set({ selectedAbilityId }),
      toggleEquipment: (equipmentId) => set((state) => {
        if (state.selectedEquipmentIds.includes(equipmentId)) {
          return { selectedEquipmentIds: state.selectedEquipmentIds.filter((id) => id !== equipmentId) };
        }

        const item = equipment.find((entry) => entry.id === equipmentId);
        if (!item) return state;
        const currentlyEquipped = state.selectedEquipmentIds
          .map((id) => equipment.find((entry) => entry.id === id))
          .filter((entry): entry is Equipment => Boolean(entry));
        const conflictingIds = new Set<string>();

        if (item.slot === "weapon" && item.handedness === "two_handed") {
          currentlyEquipped.filter((entry) => entry.slot === "weapon" || entry.slot === "off_hand").forEach((entry) => conflictingIds.add(entry.id));
        } else if (item.slot === "weapon") {
          currentlyEquipped.filter((entry) => entry.slot === "weapon").forEach((entry) => conflictingIds.add(entry.id));
        } else if (item.slot === "off_hand") {
          currentlyEquipped.filter((entry) => entry.slot === "off_hand" || entry.handedness === "two_handed").forEach((entry) => conflictingIds.add(entry.id));
        } else {
          currentlyEquipped.filter((entry) => entry.slot === item.slot).forEach((entry) => conflictingIds.add(entry.id));
        }

        return { selectedEquipmentIds: [...state.selectedEquipmentIds.filter((id) => !conflictingIds.has(id)), equipmentId] };
      }),
      addAbility: (abilityId) => set((state) => ({
        rotation: [...state.rotation, { id: makeStepId(), abilityId }],
        selectedAbilityId: abilityId,
        result: null,
      })),
      removeAbility: (stepId) => set((state) => ({ rotation: state.rotation.filter((step) => step.id !== stepId), result: null })),
      moveAbility: (from, to) => set((state) => {
        if (from === to || from < 0 || to < 0 || from >= state.rotation.length || to >= state.rotation.length) return state;
        const rotation = [...state.rotation];
        const [moved] = rotation.splice(from, 1);
        rotation.splice(to, 0, moved);
        return { rotation, result: null };
      }),
      clearRotation: () => set({ rotation: [], result: null, selectedAbilityId: null }),
      setResult: (result) => set({ result }),
      runSimulation: () => {
        const state = get();
        set({ result: simulateRotation({
          rotation: state.rotation,
          abilities,
          abilityDamage: state.abilityDamage,
          startingAdrenaline: state.startingAdrenaline,
        }) });
      },
    }),
    {
      name: "rs3-combat-simulator",
      partialize: (state) => ({
        abilityDamage: state.abilityDamage,
        startingAdrenaline: state.startingAdrenaline,
        rotation: state.rotation,
        selectedEquipmentIds: state.selectedEquipmentIds,
      }),
    },
  ),
);
