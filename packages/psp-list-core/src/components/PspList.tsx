import React, { useState, useMemo, useCallback } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { pspTheme } from '../theme';
import type { PatientRecord } from '../types/patient-record';
import type { PspListConfig, FilterState } from '../types/list-config';
import type { PspListContextValue } from '../context/PspListContext';
import { PspListProvider } from '../context/PspListContext';
import { useListData } from '../hooks/useListData';
import { useSort } from '../hooks/useSort';
import { useClientFilter } from '../hooks/useClientFilter';
import type { FilterPredicate } from '../hooks/useClientFilter';
import { usePatientSelection } from '../hooks/usePatientSelection';
import { DualGrid } from './DualGrid';
import { SelectionPanel } from './SelectionPanel';
import { SortMenu } from './SortMenu';
import { PrintDialog } from './PrintDialog';
import type { GridRowId, GridSortModel } from '@mui/x-data-grid-pro';

export interface PspListProps<T extends PatientRecord = PatientRecord> {
  config: PspListConfig;
  params: Record<string, string>;
  onPatientSelect: (patient: T) => void;
  filterPredicates?: Array<FilterPredicate<T>>;
  enabled?: boolean;
  children: React.ReactNode;
}

/**
 * Compound component root. Composes hooks and provides PspListContext to children.
 * Sub-components: PspList.DualGrid, PspList.SelectionPanel, PspList.SortMenu, PspList.PrintDialog
 */
function PspListRoot<T extends PatientRecord>({
  config,
  params,
  onPatientSelect,
  filterPredicates = [],
  enabled = true,
  children,
}: PspListProps<T>): React.ReactElement {
  const { rows: rawRows, isLoading, error, refetch } = useListData<T>({
    servletUrl: config.servletUrl,
    dataRoot: config.dataRoot,
    params,
    enabled,
  });

  const { currentSortIndex, setSortIndex, sortRows } = useSort<PatientRecord>(
    config.sortOptions,
    config.defaultSortIndex,
  );

  const { filterRows } = useClientFilter(
    filterPredicates as Array<FilterPredicate<PatientRecord>>,
  );

  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  /** When sortModel is set (header sort), pass filtered rows and grid sorts. When empty, use context menu sort. */
  const processedRows = useMemo(() => {
    const filtered = filterRows(rawRows as PatientRecord[]);
    if (sortModel.length > 0) {
      return filtered;
    }
    return sortRows(filtered);
  }, [rawRows, filterRows, sortRows, sortModel.length]);

  const handleSetSortIndex = useCallback(
    (index: number | null) => {
      setSortModel([]);
      setSortIndex(index);
    },
    [setSortIndex],
  );

  const { selectedRowId, setSelectedRowId, onPatientSubmit } = usePatientSelection({
    rows: processedRows,
    onPatientSelect: onPatientSelect as (p: PatientRecord) => void,
  });

  const [langMode, setLangMode] = useState<0 | 1>(0);
  const [frameMode, setFrameMode] = useState<0 | 1>(0);
  const [filterState, setFilterState] = useState<FilterState>({});

  const toggleLang = useCallback(() => setLangMode((p) => (p === 0 ? 1 : 0)), []);
  const toggleFrame = useCallback(() => setFrameMode((p) => (p === 0 ? 1 : 0)), []);

  const contextValue: PspListContextValue = useMemo(
    () => ({
      rows: processedRows,
      selectedRowId,
      currentSortIndex,
      sortModel,
      setSortModel,
      filterState,
      langMode,
      frameMode,
      isLoading,
      error: error ?? null,
      refetch,
      setSelectedRowId: setSelectedRowId as (id: GridRowId | null) => void,
      setSortIndex: handleSetSortIndex,
      setFilterState,
      toggleLang,
      toggleFrame,
    }),
    [
      processedRows, selectedRowId, currentSortIndex, sortModel,
      filterState, langMode, frameMode, isLoading, error, refetch,
      setSelectedRowId, handleSetSortIndex, setFilterState, toggleLang, toggleFrame,
    ],
  );

  return (
    <ThemeProvider theme={pspTheme}>
      <PspListProvider value={contextValue}>
        {children}
      </PspListProvider>
    </ThemeProvider>
  );
}

export const PspList = Object.assign(PspListRoot, {
  DualGrid,
  SelectionPanel,
  SortMenu,
  PrintDialog,
});
