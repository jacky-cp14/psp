import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  startTransition,
} from "react";
import { DataGridPro } from "@mui/x-data-grid-pro";
import type { GridColDef, GridRowParams } from "@mui/x-data-grid-pro";
import { usePspList } from "../context/PspListContext";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import type { RowColorScheme } from "../utils/row-styling";
import { getRowClass } from "../utils/row-styling";
import { tokens } from "../theme/pspTokens";

/** Default row height when `rowHeight` is omitted. Keep in sync with demo `DEMO_ROW_HEIGHT_BASE`. */
const DEFAULT_ROW_HEIGHT = 38;

/** DataGrid root top border (1px) + column header row — must match `tokens.typography.headerRowHeight`. */
const SCROLL_HEADER_OFFSET = 1 + tokens.typography.headerRowHeight;

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
  const { rows, selectedRowId, setSelectedRowId, sortModel, setSortModel } =
    usePspList();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const leftGridHostRef = useRef<HTMLDivElement>(null);
  const rightGridHostRef = useRef<HTMLDivElement>(null);
  const leftBarRef = useRef<HTMLDivElement>(null);
  const rightBarRef = useRef<HTMLDivElement>(null);
  const leftBarContentRef = useRef<HTMLDivElement>(null);
  const rightBarContentRef = useRef<HTMLDivElement>(null);
  const [leftPct, setLeftPct] = useState(defaultSplit);
  const draggingRef = useRef(false);

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
    scrollOffset: SCROLL_HEADER_OFFSET,
  });

  const highlightRowVisually = useCallback(
    (rowId: string) => {
      const container = scrollContainerRef.current;
      if (!container) return;
      container
        .querySelectorAll(".MuiDataGrid-row.Mui-selected")
        .forEach((el) => {
          el.classList.remove("Mui-selected");
        });
      container
        .querySelectorAll(`.MuiDataGrid-row[data-id="${rowId}"]`)
        .forEach((el) => {
          el.classList.add("Mui-selected");
        });
    },
    [scrollContainerRef],
  );

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const onMouseDown = (e: MouseEvent) => {
      const row = (e.target as HTMLElement).closest(".MuiDataGrid-row");
      const rowId = row?.getAttribute("data-id");
      if (rowId) highlightRowVisually(rowId);
    };
    container.addEventListener("mousedown", onMouseDown);
    return () => container.removeEventListener("mousedown", onMouseDown);
  }, [highlightRowVisually]);

  useEffect(() => {
    const syncPanelScroll = (
      hostRef: React.RefObject<HTMLDivElement>,
      barRef: React.RefObject<HTMLDivElement>,
      barContentRef: React.RefObject<HTMLDivElement>,
    ) => {
      const host = hostRef.current;
      const bar = barRef.current;
      const barContent = barContentRef.current;
      if (!host || !bar || !barContent) return () => {};

      const gridScroller = host.querySelector<HTMLElement>(
        ".MuiDataGrid-virtualScroller",
      );
      if (!gridScroller) return () => {};

      let syncingFromBar = false;
      let syncingFromGrid = false;

      const syncWidths = () => {
        const scrollWidth = gridScroller.scrollWidth;
        const clientWidth = gridScroller.clientWidth;
        barContent.style.width = `${scrollWidth}px`;
        bar.style.visibility = scrollWidth > clientWidth ? "visible" : "hidden";
        if (!syncingFromGrid) {
          bar.scrollLeft = gridScroller.scrollLeft;
        }
      };

      const onBarScroll = () => {
        if (syncingFromGrid) return;
        syncingFromBar = true;
        gridScroller.scrollLeft = bar.scrollLeft;
        syncingFromBar = false;
      };

      const onGridScroll = () => {
        if (syncingFromBar) return;
        syncingFromGrid = true;
        bar.scrollLeft = gridScroller.scrollLeft;
        syncingFromGrid = false;
      };

      bar.addEventListener("scroll", onBarScroll, { passive: true });
      gridScroller.addEventListener("scroll", onGridScroll, { passive: true });

      const resizeObserver = new ResizeObserver(() => {
        syncWidths();
      });
      resizeObserver.observe(gridScroller);
      const virtualContent = gridScroller.querySelector<HTMLElement>(
        ".MuiDataGrid-virtualScrollerContent",
      );
      if (virtualContent) resizeObserver.observe(virtualContent);

      syncWidths();

      return () => {
        bar.removeEventListener("scroll", onBarScroll);
        gridScroller.removeEventListener("scroll", onGridScroll);
        resizeObserver.disconnect();
      };
    };

    const cleanups = [
      syncPanelScroll(leftGridHostRef, leftBarRef, leftBarContentRef),
      syncPanelScroll(rightGridHostRef, rightBarRef, rightBarContentRef),
    ];

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [leftColumns, rightColumns, leftPct, rows.length, rowHeight]);

  const onDividerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    draggingRef.current = true;
    const container = scrollContainerRef.current;
    if (!container) return;

    const onMouseMove = (ev: MouseEvent) => {
      if (!draggingRef.current) return;
      const rect = container.getBoundingClientRect();
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      setLeftPct(Math.min(80, Math.max(10, pct)));
    };
    const onMouseUp = () => {
      draggingRef.current = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

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
      const colorClass = getRowClass(
        params.indexRelativeToCurrentPage,
        colorScheme,
      );
      const customClass = customGetRowClassName?.(params) ?? "";
      return [colorClass, customClass].filter(Boolean).join(" ");
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
    sortingMode: "client" as const,
    sortModel,
    onSortModelChange: handleSortModelChange,
    selectionModel,
    onRowClick: handleRowClick,
    onRowDoubleClick: handleDoubleClick,
    getRowClassName: composedGetRowClassName,
    componentsProps: {
      row: { style: { cursor: "pointer" } },
    },
    sx: {
      width: "100%",
      "& .MuiDataGrid-virtualScroller": {
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          height: 0,
        },
      },
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
        style={{
          overflowY: "auto",
          overflowX: "hidden",
          flex: 1,
          minHeight: 0,
          outline: "none",
        }}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        data-testid="dual-grid-container"
      >
        <div
          style={{
            minHeight: contentMinHeight,
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div style={{ width: `${leftPct}%`, minWidth: 0 }}>
            <div ref={leftGridHostRef}>
              <DataGridPro
                {...sharedGridProps}
                columns={leftColumns}
                data-testid="left-grid"
              />
            </div>
          </div>
          <div
            onMouseDown={onDividerMouseDown}
            style={{
              width: 5.5,
              flexShrink: 0,
              backgroundColor: tokens.color.divider,
              cursor: "col-resize",
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div ref={rightGridHostRef}>
              <DataGridPro
                {...sharedGridProps}
                columns={rightColumns}
                data-testid="right-grid"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexShrink: 0,
          backgroundColor: tokens.color.outer,
        }}
      >
        <div style={{ width: `${leftPct}%`, minWidth: 0 }}>
          <div
            ref={leftBarRef}
            style={{
              overflowX: "auto",
              overflowY: "hidden",
              height: 14,
            }}
          >
            <div ref={leftBarContentRef} style={{ height: 1 }} />
          </div>
        </div>
        <div
          style={{
            width: 5.5,
            flexShrink: 0,
            backgroundColor: tokens.color.divider,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            ref={rightBarRef}
            style={{
              overflowX: "auto",
              overflowY: "hidden",
              height: 14,
            }}
          >
            <div ref={rightBarContentRef} style={{ height: 1 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
