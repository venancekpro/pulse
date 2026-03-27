import { create } from "zustand";
import type { SimulationResult } from "@/types";

type SimulationStore = {
  lastResult: SimulationResult | null;
  setLastResult: (r: SimulationResult | null) => void;
};

export const useSimulationStore = create<SimulationStore>((set) => ({
  lastResult: null,
  setLastResult: (lastResult) => set({ lastResult }),
}));
