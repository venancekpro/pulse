import { create } from "zustand";
import type {
  NamedScenario,
  ScenarioFormData,
  SimulationResult,
  PhantomProject,
} from "@/types";

function createDefaultScenario(): NamedScenario {
  const id = crypto.randomUUID();
  return {
    id,
    label: "Scénario 1",
    formData: {
      name: "Nouveau module",
      code: "NEW",
      deadline: "",
      complexity: "moyenne",
      modules: [],
      allocations: {},
      roles: {},
    },
    result: null,
    createdAt: new Date().toISOString(),
  };
}

type SimulationStore = {
  // --- Multi-scenario ---
  scenarios: NamedScenario[];
  activeScenarioId: string | null;
  compareMode: boolean;

  // --- Phantom timeline ---
  phantomProject: PhantomProject | null;

  // --- Scenario actions ---
  addScenario: (label: string) => string;
  removeScenario: (id: string) => void;
  setActiveScenario: (id: string) => void;
  updateScenarioForm: (id: string, patch: Partial<ScenarioFormData>) => void;
  setScenarioResult: (id: string, result: SimulationResult) => void;
  renameScenario: (id: string, label: string) => void;
  toggleCompareMode: () => void;

  // --- Phantom actions ---
  setPhantomProject: (p: PhantomProject | null) => void;
  clearPhantom: () => void;

  // --- Backward compat ---
  lastResult: SimulationResult | null;
  setLastResult: (r: SimulationResult | null) => void;
};

const defaultScenario = createDefaultScenario();

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  scenarios: [defaultScenario],
  activeScenarioId: defaultScenario.id,
  compareMode: false,
  phantomProject: null,

  addScenario: (label) => {
    const id = crypto.randomUUID();
    const scenario: NamedScenario = {
      id,
      label,
      formData: {
        name: "Nouveau module",
        code: "NEW",
        deadline: "",
        complexity: "moyenne",
        modules: [],
        allocations: {},
        roles: {},
      },
      result: null,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      scenarios: [...state.scenarios, scenario],
      activeScenarioId: id,
    }));
    return id;
  },

  removeScenario: (id) =>
    set((state) => {
      const filtered = state.scenarios.filter((s) => s.id !== id);
      if (filtered.length === 0) {
        const fresh = createDefaultScenario();
        return { scenarios: [fresh], activeScenarioId: fresh.id };
      }
      const activeGone = state.activeScenarioId === id;
      return {
        scenarios: filtered,
        activeScenarioId: activeGone ? filtered[0].id : state.activeScenarioId,
      };
    }),

  setActiveScenario: (id) => set({ activeScenarioId: id }),

  updateScenarioForm: (id, patch) =>
    set((state) => ({
      scenarios: state.scenarios.map((s) =>
        s.id === id ? { ...s, formData: { ...s.formData, ...patch } } : s,
      ),
    })),

  setScenarioResult: (id, result) =>
    set((state) => ({
      scenarios: state.scenarios.map((s) =>
        s.id === id ? { ...s, result } : s,
      ),
    })),

  renameScenario: (id, label) =>
    set((state) => ({
      scenarios: state.scenarios.map((s) =>
        s.id === id ? { ...s, label } : s,
      ),
    })),

  toggleCompareMode: () => set((state) => ({ compareMode: !state.compareMode })),

  setPhantomProject: (p) => set({ phantomProject: p }),
  clearPhantom: () => set({ phantomProject: null }),

  // Backward compat
  get lastResult() {
    const state = get();
    const active = state.scenarios.find((s) => s.id === state.activeScenarioId);
    return active?.result ?? null;
  },
  setLastResult: (r) => {
    const state = get();
    if (state.activeScenarioId && r) {
      state.setScenarioResult(state.activeScenarioId, r);
    }
  },
}));
