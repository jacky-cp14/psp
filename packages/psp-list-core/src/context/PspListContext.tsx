import React, { createContext, useContext } from 'react';
import type { PatientRecord } from '../types/patient-record';
import type { FilterState } from '../types/list-config';
import type { GridRowId, GridSortModel } from '@mui/x-data-grid-pro';

export interface PspListContextValue {
  /** Fetched and filtered rows */
  rows: PatientRecord[];
  /** Currently selected row ID (null if none) */
  selectedRowId: GridRowId | null;
  /** Current sort option index (context menu) */
  currentSortIndex: number;
  /** Column header sort model — when non-empty, grid sorts by this and shows header indicators */
  sortModel: GridSortModel;
  /** Set column header sort model (from header click) */
  setSortModel: (model: GridSortModel) => void;
  /** Filter state — consuming app manages keys */
  filterState: FilterState;
  /** Language mode: 0 = English, 1 = Chinese */
  langMode: 0 | 1;
  /** Frame mode: 0 = Expand, 1 = Reduce */
  frameMode: 0 | 1;
  /** Loading state from TanStack Query */
  isLoading: boolean;
  /** Error from last fetch */
  error: Error | null;
  /** Refetch trigger */
  refetch: () => void;
  /** Set selected row (from row click) */
  setSelectedRowId: (id: GridRowId | null) => void;
  /** Set sort option index (context menu; clears sortModel so menu sort applies) */
  setSortIndex: (index: number) => void;
  /** Update filter state */
  setFilterState: (state: FilterState | ((prev: FilterState) => FilterState)) => void;
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
