import React, { useState, useMemo, useCallback } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import type { GridColDef, GridRowId, GridRowParams, GridSortModel } from '@mui/x-data-grid-pro';
import { pspTheme } from '../theme/pspTheme';
import type { SortOption } from '../utils/sort-comparators';
import { buildFieldCompareMap } from '../utils/sort-comparators';
import type { RowColorScheme } from '../utils/row-styling';
import type { PspListContextValue } from '../context/PspListContext';
import { PspListProvider } from '../context/PspListContext';
import { useSort } from '../hooks/useSort';
import { usePatientSelection } from '../hooks/usePatientSelection';
import { emitPatientSelect } from '../events/pspEventBus';
import { DualGrid } from './DualGrid';
import { SortMenu } from './SortMenu';

export interface PspListProps<T extends { id: string } = { id: string }> {
  /** Rows — consumer fetches and optionally filters before passing in. */
  rows: T[];
  /** Left grid columns (identifiers). */
  leftColumns: GridColDef[];
  /** Right grid columns (details). */
  rightColumns: GridColDef[];
  /** Sort presets for the right-click context menu. */
  sortOptions: SortOption[];
  /** Index into sortOptions for initial sort. null = preserve server order. */
  defaultSortIndex?: number | null;
  /** Optional local callback on double-click or Enter. The event bus is always notified. */
  onPatientSelect?: (patient: T) => void;
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
}

/**
 * Flat, prop-driven list — mirrors MUI DataGrid's API contract:
 * data in, UI out, callbacks for interaction.
 *
 * Internally composes SortMenu (right-click context menu) and
 * DualGrid (split DataGridPro pair with keyboard nav).
 *
 * Toolbar/title is the consumer's layout concern — use `SelectionPanel`
 * above `PspList` for the standard toolbar look.
 */
export function PspList<T extends { id: string }>({
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
}: PspListProps<T>): React.ReactElement {
  const fieldCompares = useMemo(
    () => buildFieldCompareMap([...leftColumns, ...rightColumns]),
    [leftColumns, rightColumns],
  );

  const { currentSortIndex, setSortIndex, sortRows } = useSort<T>(
    sortOptions,
    defaultSortIndex,
    fieldCompares,
  );

  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const processedRows = useMemo(() => {
    if (sortModel.length > 0) {
      return rows;
    }
    return sortRows(rows);
  }, [rows, sortRows, sortModel.length]);

  const handleSetSortIndex = useCallback(
    (index: number | null) => {
      setSortModel([]);
      setSortIndex(index);
    },
    [setSortIndex],
  );

  const handlePatientSelect = useCallback(
    (patient: T) => {
      onPatientSelect?.(patient);
      emitPatientSelect(patient);
    },
    [onPatientSelect],
  );

  const { selectedRowId, setSelectedRowId, onPatientSubmit } = usePatientSelection<T>({
    rows: processedRows,
    onPatientSelect: handlePatientSelect,
  });

  const contextValue: PspListContextValue = useMemo(
    () => ({
      rows: processedRows,
      selectedRowId,
      currentSortIndex,
      sortModel,
      setSortModel,
      setSelectedRowId: setSelectedRowId as (id: GridRowId | null) => void,
      setSortIndex: handleSetSortIndex,
    }),
    [
      processedRows, selectedRowId, currentSortIndex, sortModel,
      setSelectedRowId, handleSetSortIndex,
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
