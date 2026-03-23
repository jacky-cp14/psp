import React, { useState, useMemo, useCallback } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import type { GridColDef, GridRowId, GridRowParams, GridSortModel } from '@mui/x-data-grid-pro';
import { pspTheme } from '../theme';
import type { PatientRecord } from '../types/patient-record';
import type { SelectionMode } from '../types/list-config';
import type { SortOption } from '../utils/sort-comparators';
import { buildFieldTypeMap } from '../utils/sort-comparators';
import type { RowColorScheme } from '../utils/row-styling';
import type { PspListContextValue } from '../context/PspListContext';
import { PspListProvider } from '../context/PspListContext';
import { useSort } from '../hooks/useSort';
import { usePatientSelection } from '../hooks/usePatientSelection';
import { DualGrid } from './DualGrid';
import { SortMenu } from './SortMenu';

export interface PspListProps<T extends PatientRecord = PatientRecord> {
  /** Patient rows — consumer fetches and optionally filters before passing in. */
  rows: T[];
  /** Left grid columns (patient identifiers). */
  leftColumns: GridColDef[];
  /** Right grid columns (clinical details). */
  rightColumns: GridColDef[];
  /** Sort presets for the right-click context menu. */
  sortOptions: SortOption[];
  /** Index into sortOptions for initial sort. null = preserve server order. */
  defaultSortIndex?: number | null;
  /** Called on double-click or Enter — the "submit" action. */
  onPatientSelect: (patient: T) => void;
  /** Initial left/right panel split percentage. */
  defaultSplit?: number;
  /** Row height in px (default 28). */
  rowHeight?: number;
  /** Alternating row color scheme (default 'gray'). */
  colorScheme?: RowColorScheme;
  /** Custom row class names (composed with library color classes). */
  getRowClassName?: (params: GridRowParams) => string;
  /** Page size for PgUp/PgDn (default 12). */
  pageSize?: number;
  /** Selection mode — affects empty-episode behavior. */
  selectionMode?: SelectionMode;
}

/**
 * Flat, prop-driven patient list — mirrors MUI DataGrid's API contract:
 * data in, UI out, callbacks for interaction.
 *
 * Internally composes SortMenu (right-click context menu) and
 * DualGrid (split DataGridPro pair with keyboard nav).
 *
 * Toolbar/title is the consumer's layout concern — use `SelectionPanel`
 * above `PspList` for the standard toolbar look.
 */
export function PspList<T extends PatientRecord>({
  rows,
  leftColumns,
  rightColumns,
  sortOptions,
  defaultSortIndex = null,
  onPatientSelect,
  defaultSplit,
  rowHeight,
  colorScheme,
  getRowClassName,
  pageSize: _pageSize,
  selectionMode: _selectionMode,
}: PspListProps<T>): React.ReactElement {
  const fieldTypes = useMemo(
    () => buildFieldTypeMap([...leftColumns, ...rightColumns]),
    [leftColumns, rightColumns],
  );

  const { currentSortIndex, setSortIndex, sortRows } = useSort<PatientRecord>(
    sortOptions,
    defaultSortIndex,
    fieldTypes,
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

  const sortLabels = useMemo(() => sortOptions.map((s) => s.label), [sortOptions]);

  return (
    <ThemeProvider theme={pspTheme}>
      <PspListProvider value={contextValue}>
        <SortMenu sortLabels={sortLabels}>
          <DualGrid
            leftColumns={leftColumns}
            rightColumns={rightColumns}
            defaultSplit={defaultSplit}
            rowHeight={rowHeight}
            colorScheme={colorScheme}
            getRowClassName={getRowClassName}
            onRowDoubleClick={onPatientSubmit}
          />
        </SortMenu>
      </PspListProvider>
    </ThemeProvider>
  );
}
