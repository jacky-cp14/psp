import React, { useRef, useCallback, startTransition } from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import type { GridColDef, GridRowParams } from '@mui/x-data-grid-pro';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { usePspList } from '../context/PspListContext';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';

export interface DualGridProps {
  leftColumns: GridColDef[];
  rightColumns: GridColDef[];
  defaultSplit?: number;
  rowHeight?: number;
  getRowClassName?: (params: GridRowParams) => string;
  onRowDoubleClick?: () => void;
}

const ROW_HEIGHT = 28;

/**
 * Dual DataGridPro with shared vertical scroll, selection sync, and keyboard nav.
 * Left grid = patient identifiers, Right grid = clinical details.
 */
export function DualGrid({
  leftColumns,
  rightColumns,
  defaultSplit = 35,
  rowHeight = ROW_HEIGHT,
  getRowClassName,
  onRowDoubleClick,
}: DualGridProps): React.ReactElement {
  const { rows, selectedRowId, setSelectedRowId } = usePspList();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedIndex = selectedRowId !== null
    ? rows.findIndex((r) => r.id === String(selectedRowId))
    : -1;

  const { handleKeyDown } = useKeyboardNavigation({
    rowCount: rows.length,
    selectedIndex,
    onSelectionChange: (index: number) => {
      const row = rows[index];
      if (row) startTransition(() => setSelectedRowId(row.id));
    },
    onSubmit: () => onRowDoubleClick?.(),
    scrollContainerRef: scrollContainerRef as React.RefObject<HTMLDivElement>,
    rowHeight,
    scrollOffset: 57,
  });

  const handleRowClick = useCallback(
    (params: GridRowParams) => {
      startTransition(() => setSelectedRowId(params.id));
    },
    [setSelectedRowId],
  );

  const handleDoubleClick = useCallback(() => {
    onRowDoubleClick?.();
  }, [onRowDoubleClick]);

  const selectionModel = selectedRowId !== null ? [selectedRowId] : [];

  const sharedGridProps = {
    rows,
    rowHeight,
    autoHeight: true,
    hideFooter: true,
    disableColumnMenu: true,
    disableColumnFilter: true,
    disableColumnSelector: true,
    sortModel: [] as [],
    rowSelectionModel: selectionModel,
    onRowClick: handleRowClick,
    onRowDoubleClick: handleDoubleClick,
    getRowClassName,
    componentsProps: {
      row: { style: { cursor: 'pointer' } },
    },
  };

  const contentMinHeight = rows.length * rowHeight;

  return (
    <div
      style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}
      data-testid="dual-grid-wrapper"
    >
      <div
        ref={scrollContainerRef}
        style={{ overflowY: 'auto', flex: 1, minHeight: 0, outline: 'none' }}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        data-testid="dual-grid-container"
      >
        <div style={{ minHeight: contentMinHeight }}>
          <PanelGroup direction="horizontal">
            <Panel defaultSize={defaultSplit}>
              <DataGridPro
                {...sharedGridProps}
                columns={leftColumns}
                data-testid="left-grid"
              />
            </Panel>
            <PanelResizeHandle
              style={{
                width: 4,
                backgroundColor: '#e0e0e0',
                cursor: 'col-resize',
              }}
            />
            <Panel>
              <DataGridPro
                {...sharedGridProps}
                columns={rightColumns}
                data-testid="right-grid"
              />
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </div>
  );
}
