/**
 * PSP Global Store — singleton Zustand store shared across all
 * plugins in the Module Federation host.
 *
 * Created at module scope. Because `@psp/core` is marked
 * `singleton: true` in the federation config, `create()` runs
 * exactly once — every plugin shares the same store instance.
 */

import { create } from "zustand";

/** Display language — `'en'` (English) | `'zh'` (Chinese) */
export type LangMode = "en" | "zh";

/** Layout width — `'expanded'` (full-width) | `'reduced'` (narrow) */
export type FrameMode = "expanded" | "reduced";

export interface PspGlobalState {
  langMode: LangMode;
  frameMode: FrameMode;

  /**
   * User's login ward, fetched once at PSP init.
   * Replaces ExtJS `top.parent.pspCurrentWard` (the initial read)
   * and the per-list `defaultWard` prototype property.
   */
  defaultWard: string;

  /**
   * Active ward selection, shared across all lists.
   * Replaces ExtJS `currentWardInfo.ward`, `top.parent.pspCurrentWard`
   * (write-back), and per-list `this.currentWard`.
   * Updated when user picks a ward in the combo on any list.
   */
  currentWard: string;

  /** Available plugin lists registered by federated plugins. */
  pluginLists: { id: string; label: string }[];
}

export interface PspGlobalActions {
  /** Merge any partial state. The only setter you need. */
  setPspState: (patch: Partial<PspGlobalState>) => void;
  toggleLang: () => void;
  toggleFrame: () => void;
  /** Set defaultWard and reset currentWard to match. Called once by the consuming app at PSP init. */
  setDefaultWard: (ward: string) => void;
  /** Update the active ward (ward combo select). */
  setCurrentWard: (ward: string) => void;
  /** Replace the full plugin list array. */
  setPluginLists: (lists: PspGlobalState['pluginLists']) => void;
}

export type PspGlobalStore = PspGlobalState & PspGlobalActions;

export const usePspGlobal = create<PspGlobalStore>()((set) => ({
  langMode: "en",
  frameMode: "expanded",
  defaultWard: "",
  currentWard: "",
  pluginLists: [],

  setPspState: (patch) => set(patch),
  toggleLang: () =>
    set((s) => ({ langMode: s.langMode === "en" ? "zh" : "en" })),
  toggleFrame: () =>
    set((s) => ({
      frameMode: s.frameMode === "expanded" ? "reduced" : "expanded",
    })),
  setDefaultWard: (ward) => set({ defaultWard: ward, currentWard: ward }),
  setCurrentWard: (ward) => set({ currentWard: ward }),
  setPluginLists: (lists) => set({ pluginLists: lists }),
}));
