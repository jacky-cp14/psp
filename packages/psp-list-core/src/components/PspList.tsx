import React, { useState, useMemo, useCallback } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { pspTheme } from '../theme';
import type { PatientRecord } from '../types/patient-record';
import type { PspListConfig } from '../types/list-config';
import type { PspListContextValue } from '../context/PspListContext';
import { PspListProvider } from '../context/PspListContext';
import { useSort } from '../hooks/useSort';
import { usePatientSelection } from '../hooks/usePatientSelection';
import { DualGrid } from './DualGrid';
import { SelectionPanel } from './SelectionPanel';
import { SortMenu } from './SortMenu';
import { PrintDialog } from './PrintDialog';
import type { GridRowId, GridSortModel } from '@mui/x-data-grid-pro';

export interface PspListProps<T extends PatientRecord = PatientRecord> {
  /** Patient rows — consumer fetches (via useListData) and optionally filters before passing in. */
  rows: T[];
  config: PspListConfig;
  onPatientSelect: (patient: T) => void;
  children: React.ReactNode;
}

/**
 * Pure UI compound component. Handles sorting, selection, and layout.
 * Data fetching and filtering are the consumer's responsibility.
 * Sub-components: PspList.DualGrid, PspList.SelectionPanel, PspList.SortMenu, PspList.PrintDialog
 */
function PspListRoot<T extends PatientRecord>({
  rows,
  config,
  onPatientSelect,
  children,
}: PspListProps<T>): React.ReactElement {
  const { currentSortIndex, setSortIndex, sortRows } = useSort<PatientRecord>(
    config.sortOptions,
    config.defaultSortIndex,
  );

  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const processedRows = useMemo(() => {
    const inputRows = rows as PatientRecord[];
    if (sortModel.length > 0) {
      return inputRows;
    }
    return sortRows(inputRows);
  }, [rows, sortRows, sortModel.length]);

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

  const toggleLang = useCallback(() => setLangMode((p) => (p === 0 ? 1 : 0)), []);
  const toggleFrame = useCallback(() => setFrameMode((p) => (p === 0 ? 1 : 0)), []);

  const contextValue: PspListContextValue = useMemo(
    () => ({
      rows: processedRows,
      selectedRowId,
      currentSortIndex,
      sortModel,
      setSortModel,
      langMode,
      frameMode,
      setSelectedRowId: setSelectedRowId as (id: GridRowId | null) => void,
      setSortIndex: handleSetSortIndex,
      toggleLang,
      toggleFrame,
    }),
    [
      processedRows, selectedRowId, currentSortIndex, sortModel,
      langMode, frameMode,
      setSelectedRowId, handleSetSortIndex, toggleLang, toggleFrame,
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
