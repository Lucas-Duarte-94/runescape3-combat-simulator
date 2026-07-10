import { beforeEach, describe, expect, it } from "vitest";
import { equipment, useSimulatorStore } from "@/stores/simulator-store";

describe("equipment loadout conflicts", () => {
  beforeEach(() => useSimulatorStore.setState({ selectedEquipmentIds: [] }));

  it("marks the specified weapons as two-handed", () => {
    const twoHanded = equipment.filter((item) => item.handedness === "two_handed").map((item) => item.id);
    expect(twoHanded).toEqual([
      "noxious-scythe", "masterwork-spear-annihilation", "zaros-godsword", "ek-zekkil", "tumekens-light", "masterwork-2h-sword", "noxious-longbow", "seren-godbow", "bow-last-guardian", "masterwork-bow", "fractured-staff-armadyl",
    ]);
  });

  it("equipping a two-handed weapon replaces both hands", () => {
    const store = useSimulatorStore.getState();
    store.toggleEquipment("dark-shard-leng");
    useSimulatorStore.getState().toggleEquipment("dark-sliver-leng");
    useSimulatorStore.getState().toggleEquipment("tumekens-light");
    expect(useSimulatorStore.getState().selectedEquipmentIds).toEqual(["tumekens-light"]);
  });

  it("equipping an off-hand removes an equipped two-handed weapon", () => {
    const store = useSimulatorStore.getState();
    store.toggleEquipment("fractured-staff-armadyl");
    useSimulatorStore.getState().toggleEquipment("seismic-singularity");
    expect(useSimulatorStore.getState().selectedEquipmentIds).toEqual(["seismic-singularity"]);
  });
});
