import React, { createContext, useContext } from 'react';
import type { PatientRecord } from '../types/patient-record';
import type { GridRowId, GridSortModel } from '@mui/x-data-grid-pro';

export interface PspListContextValue {
  /** Sorted rows ready for rendering */
  rows: PatientRecord[];
  /** Currently selected row ID (null if none) */
  selectedRowId: GridRowId | null;
  /** Current sort option index (context menu), or null when unsorted */
  currentSortIndex: number | null;
  /** Column header sort model — when non-empty, grid sorts by this and shows header indicators */
  sortModel: GridSortModel;
  /** Set column header sort model (from header click) */
  setSortModel: (model: GridSortModel) => void;
  /** Language mode: 0 = English, 1 = Chinese */
  langMode: 0 | 1;
  /** Frame mode: 0 = Expand, 1 = Reduce */
  frameMode: 0 | 1;
  /** Set selected row (from row click) */
  setSelectedRowId: (id: GridRowId | null) => void;
  /** Set sort option index (context menu; clears sortModel so menu sort applies). null = unsorted. */
  setSortIndex: (index: number | null) => void;
  /** Toggle language mode */
  toggleLang: () => void;
  /** Toggle frame mode */
  toggleFrame: () => void;
}

const PspListContext = createContext<PspListContextValue | null>(null);

interface PspListProviderProps {
  value: PspListContextValue;
  children: React.ReactNode;
}

export function PspListProvider({ value, children }: PspListProviderProps): React.ReactElement {
  return (
    <PspListContext.Provider value={value}>
      {children}
    </PspListContext.Provider>
  );
}

export function usePspList(): PspListContextValue {
  const ctx = useContext(PspListContext);
  if (!ctx) {
    throw new Error('usePspList must be used within PspListProvider');
  }
  return ctx;
}
