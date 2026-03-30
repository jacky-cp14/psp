/**
 * PSP Global Store — singleton Zustand store shared across all
 * plugins in the Module Federation host.
 *
 * Created at module scope. Because `@psp/core` is marked
 * `singleton: true` in the federation config, `create()` runs
 * exactly once — every plugin shares the same store instance.
 */

import { create } from 'zustand';

/** Display language — `'en'` (English) | `'zh'` (Chinese) */
export type LangMode = 'en' | 'zh';

/** Layout width — `'expand'` (full-width) | `'compact'` (narrow) */
export type FrameMode = 'expand' | 'compact';

export interface PspGlobalState {
  langMode: LangMode;
  frameMode: FrameMode;
}

export interface PspGlobalActions {
  /** Merge any partial state. The only setter you need. */
  setPspState: (patch: Partial<PspGlobalState>) => void;
  toggleLang: () => void;
  toggleFrame: () => void;
}

export type PspGlobalStore = PspGlobalState & PspGlobalActions;

export const usePspGlobal = create<PspGlobalStore>()((set) => ({
  langMode: 'en',
  frameMode: 'expand',

  setPspState: (patch) => set(patch),
  toggleLang: () => set((s) => ({ langMode: s.langMode === 'en' ? 'zh' : 'en' })),
  toggleFrame: () => set((s) => ({ frameMode: s.frameMode === 'expand' ? 'compact' : 'expand' })),
}));
