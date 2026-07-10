"use client";

import { useSimulatorStore } from "@/stores/simulator-store";

export function useSimulation() {
  const runSimulation = useSimulatorStore((state) => state.runSimulation);
  const result = useSimulatorStore((state) => state.result);
  return { runSimulation, result };
}

