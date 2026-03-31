import React, { useRef, useCallback, useEffect, startTransition } from "react";
import { DataGridPro } from "@mui/x-data-grid-pro";
import type { GridColDef, GridRowParams } from "@mui/x-data-grid-pro";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { usePspList } from "../context/PspListContext";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import type { RowColorScheme } from "../utils/row-styling";
import { getRowClass } from "../utils/row-styling";
import { tokens } from "../theme/pspTokens";

/** Default row height when `rowHeight` is omitted. Keep in sync with demo `DEMO_ROW_HEIGHT_BASE`. */
const DEFAULT_ROW_HEIGHT = 41;

export interface DualGridProps {
  leftColumns: GridColDef[];
  rightColumns: GridColDef[];
  defaultSplit?: number;
  rowHeight?: number;
  /**
   * Alternating row colors. Defaults to `'gray'` (PSP-style striping).
   * Use `resolveColorScheme()` for legacy `psp_*` params, or `'none'` for a flat grid.
   */
  colorScheme?: RowColorScheme;
  /** Additional custom row class names (composed with library's color classes) */
  getRowClassName?: (params: GridRowParams) => string;
  onRowDoubleClick?: () => void;
}

/**
 * Dual DataGridPro with shared vertical scroll, selection sync, and keyboard nav.
 * Left grid = patient identifiers, Right grid = clinical details.
 */
export function DualGrid({
  leftColumns,
  rightColumns,
  defaultSplit = 35,
  rowHeight = DEFAULT_ROW_HEIGHT,
  colorScheme = "gray",
  getRowClassName: customGetRowClassName,
  onRowDoubleClick,
}: DualGridProps): React.ReactElement {
  const { rows, selectedRowId, setSelectedRowId, sortModel, setSortModel } = usePspList();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedIndex =
    selectedRowId !== null
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

  const highlightRowVisually = useCallback(
    (rowId: string) => {
      const container = scrollContainerRef.current;
      if (!container) return;
      container.querySelectorAll('.MuiDataGrid-row.Mui-selected').forEach((el) => {
        el.classList.remove('Mui-selected');
      });
      container.querySelectorAll(`.MuiDataGrid-row[data-id="${rowId}"]`).forEach((el) => {
        el.classList.add('Mui-selected');
      });
    },
    [scrollContainerRef],
  );

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const onMouseDown = (e: MouseEvent) => {
      const row = (e.target as HTMLElement).closest('.MuiDataGrid-row');
      const rowId = row?.getAttribute('data-id');
      if (rowId) highlightRowVisually(rowId);
    };
    container.addEventListener('mousedown', onMouseDown);
    return () => container.removeEventListener('mousedown', onMouseDown);
  }, [highlightRowVisually]);

  const handleRowClick = useCallback(
    (params: GridRowParams) => {
      highlightRowVisually(String(params.id));
      startTransition(() => setSelectedRowId(params.id));
    },
    [setSelectedRowId, highlightRowVisually],
  );

  const handleDoubleClick = useCallback(() => {
    onRowDoubleClick?.();
  }, [onRowDoubleClick]);

  const selectionModel = selectedRowId !== null ? [selectedRowId] : [];

  const handleSortModelChange = useCallback(
    (newModel: Parameters<typeof setSortModel>[0]) => {
      setSortModel(newModel);
    },
    [setSortModel],
  );

  const composedGetRowClassName = useCallback(
    (params: { indexRelativeToCurrentPage: number } & GridRowParams) => {
      const colorClass = getRowClass(params.indexRelativeToCurrentPage, colorScheme);
      const customClass = customGetRowClassName?.(params) ?? '';
      return [colorClass, customClass].filter(Boolean).join(' ');
    },
    [colorScheme, customGetRowClassName],
  );

  const sharedGridProps = {
    rows,
    rowHeight,
    autoHeight: true,
    hideFooter: true,
    disableColumnMenu: true,
    disableColumnFilter: true,
    disableColumnSelector: true,
    disableColumnSorting: false,
    sortingMode: 'client' as const,
    sortModel,
    onSortModelChange: handleSortModelChange,
    selectionModel,
    onRowClick: handleRowClick,
    onRowDoubleClick: handleDoubleClick,
    getRowClassName: composedGetRowClassName,
    componentsProps: {
      row: { style: { cursor: "pointer" } },
    },
  };

  const contentMinHeight = rows.length * rowHeight;

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
      }}
      data-testid="dual-grid-wrapper"
    >
      <div
        ref={scrollContainerRef}
        style={{ overflowY: "auto", flex: 1, minHeight: 0, outline: "none" }}
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
                width: 5.5,
                backgroundColor: tokens.color.divider,
                cursor: "col-resize",
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
