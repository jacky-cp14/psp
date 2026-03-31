import React, { useState, useRef, useMemo, startTransition } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { DataGridPro } from "@mui/x-data-grid-pro";
import type { GridColDef, GridRowParams } from "@mui/x-data-grid-pro";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { useKeyboardNavigation } from "../../packages/psp-list-core/src/hooks/useKeyboardNavigation";
import { pspTheme } from "../../packages/psp-list-core/src/theme/pspTheme";
import { tokens } from "../../packages/psp-list-core/src/theme/pspTokens";
import type { NormalPatientRecord } from "../types/patient-record";
import { cpiPatList } from "../dummyData";
import { List0Normal } from "./list0-normal";
import {
  orderLeadSexAgeEnZh,
  scaleGridColumns,
  scaleW,
  useDemoPspLayout,
} from "../hooks/useDemoPspLayout";
import type { LangMode } from "@psp/core";

const ROWS = cpiPatList;

/** Must match `DualGrid` / pspTheme column header height + 1px grid top border. */
const SCROLL_HEADER_OFFSET = 1 + tokens.typography.headerRowHeight;

/** Single-grid layers: ward + bed → Sex/Age + names (per lang) + episode/spec. */
function buildPerfLabAllColumns(
  langMode: LangMode,
  factor: number,
): GridColDef[] {
  const ward: GridColDef = {
    field: "wardCode",
    headerName: "Ward",
    width: scaleW(65, factor),
  };
  const bed: GridColDef = {
    field: "bed",
    headerName: "Bed",
    width: scaleW(100, factor),
  };
  const left = orderLeadSexAgeEnZh(langMode, [ward], factor, bed);
  const tail = scaleGridColumns(
    [
      { field: "caseNo", headerName: "Episode", width: 152 },
      { field: "specCode", headerName: "Spec", width: 62 },
    ],
    factor,
  );
  return [...left, ...tail];
}

const RIGHT_COLS_BASE: GridColDef[] = [
  { field: "caseNo", headerName: "Episode", width: 152 },
  { field: "specCode", headerName: "Spec", width: 62 },
  { field: "sourceCode", headerName: "Source", width: 80 },
];

/* ─── Layer 0: Vanilla DataGridPro (built-in keyboard, virtualization ON) ─── */
function Layer0(): React.ReactElement {
  const { langMode, rowHeight, columnScale } = useDemoPspLayout();
  const columns = useMemo(
    () => buildPerfLabAllColumns(langMode, columnScale),
    [langMode, columnScale],
  );

  return (
    <div style={{ flex: 1, minHeight: 0 }}>
      <DataGridPro
        rows={ROWS}
        columns={columns}
        rowHeight={rowHeight}
        hideFooter
        disableColumnMenu
      />
    </div>
  );
}

/* ─── Layer 1: autoHeight (virtualization OFF, DataGrid internal keyboard) ─── */
function Layer1(): React.ReactElement {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { langMode, rowHeight, columnScale } = useDemoPspLayout();
  const columns = useMemo(
    () => buildPerfLabAllColumns(langMode, columnScale),
    [langMode, columnScale],
  );

  return (
    <div ref={scrollRef} style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
      <DataGridPro
        rows={ROWS}
        columns={columns}
        rowHeight={rowHeight}
        hideFooter
        autoHeight
        disableColumnMenu
      />
    </div>
  );
}

/* ─── Layer 2: autoHeight + external selection + useKeyboardNavigation ─── */
function Layer2(): React.ReactElement {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { langMode, rowHeight, columnScale } = useDemoPspLayout();
  const columns = useMemo(
    () => buildPerfLabAllColumns(langMode, columnScale),
    [langMode, columnScale],
  );

  const selectedIndex = selectedId
    ? ROWS.findIndex((r) => r.id === selectedId)
    : -1;

  const { handleKeyDown } = useKeyboardNavigation({
    rowCount: ROWS.length,
    selectedIndex,
    onSelectionChange: (index: number) => {
      const row = ROWS[index];
      if (row) startTransition(() => setSelectedId(row.id));
    },
    onSubmit: () => {},
    scrollContainerRef: scrollRef as React.RefObject<HTMLDivElement>,
    rowHeight,
    scrollOffset: SCROLL_HEADER_OFFSET,
  });

  return (
    <ThemeProvider theme={pspTheme}>
      <div
        ref={scrollRef}
        style={{ flex: 1, minHeight: 0, overflowY: "auto", outline: "none" }}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <DataGridPro
          rows={ROWS}
          columns={columns}
          rowHeight={rowHeight}
          hideFooter
          autoHeight
          disableColumnMenu
          disableColumnFilter
          disableColumnSelector
          sortModel={[] as []}
          selectionModel={selectedId ? [selectedId] : []}
          onRowClick={(params: GridRowParams) =>
            startTransition(() => setSelectedId(String(params.id)))
          }
        />
      </div>
    </ThemeProvider>
  );
}

/* ─── Layer 3: Dual grids in PanelGroup (mirrors DualGrid.tsx structure) ─── */
function Layer3(): React.ReactElement {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { langMode, rowHeight, columnScale, defaultSplit } = useDemoPspLayout();
  const leftCols = useMemo(() => {
    const f = columnScale;
    const ward: GridColDef = {
      field: "wardCode",
      headerName: "Ward",
      width: scaleW(65, f),
    };
    const bed: GridColDef = {
      field: "bed",
      headerName: "Bed",
      width: scaleW(100, f),
    };
    return orderLeadSexAgeEnZh(langMode, [ward], f, bed);
  }, [langMode, columnScale]);
  const rightCols = useMemo(
    () => scaleGridColumns(RIGHT_COLS_BASE, columnScale),
    [columnScale],
  );

  const selectedIndex = selectedId
    ? ROWS.findIndex((r) => r.id === selectedId)
    : -1;

  const { handleKeyDown } = useKeyboardNavigation({
    rowCount: ROWS.length,
    selectedIndex,
    onSelectionChange: (index: number) => {
      const row = ROWS[index];
      if (row) startTransition(() => setSelectedId(row.id));
    },
    onSubmit: () => {},
    scrollContainerRef: scrollRef as React.RefObject<HTMLDivElement>,
    rowHeight,
    scrollOffset: SCROLL_HEADER_OFFSET,
  });

  const selectionModel = selectedId ? [selectedId] : [];
  const sharedProps = {
    rows: ROWS,
    rowHeight,
    hideFooter: true,
    autoHeight: true,
    disableColumnMenu: true,
    disableColumnFilter: true,
    disableColumnSelector: true,
    sortModel: [] as [],
    selectionModel,
    onRowClick: (params: GridRowParams) =>
      startTransition(() => setSelectedId(String(params.id))),
  };

  const contentHeight = ROWS.length * rowHeight;

  return (
    <ThemeProvider theme={pspTheme}>
      <div
        ref={scrollRef}
        style={{ flex: 1, minHeight: 0, overflowY: "auto", outline: "none" }}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div style={{ minHeight: contentHeight }}>
          <PanelGroup direction="horizontal">
            <Panel defaultSize={defaultSplit} style={{ minWidth: 0 }}>
              <div
                style={{
                  minWidth: 0,
                  overflowX: "auto",
                  width: "100%",
                  height: "100%",
                }}
              >
                <DataGridPro {...sharedProps} columns={leftCols} />
              </div>
            </Panel>
            <PanelResizeHandle
              style={{
                width: 4,
                backgroundColor: "#e0e0e0",
                cursor: "col-resize",
              }}
            />
            <Panel style={{ minWidth: 0 }}>
              <div
                style={{
                  minWidth: 0,
                  overflowX: "auto",
                  width: "100%",
                  height: "100%",
                }}
              >
                <DataGridPro {...sharedProps} columns={rightCols} />
              </div>
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </ThemeProvider>
  );
}

/* ─── Layer 4: Full PspList compound component (context + all hooks) ─── */
function Layer4({
  onPatientSelect,
}: {
  onPatientSelect: (p: NormalPatientRecord) => void;
}): React.ReactElement {
  return (
    <List0Normal
      params={{ hospCode: "QMH", wardCode: "WARD_A" }}
      onPatientSelect={onPatientSelect}
    />
  );
}

/* ─── PerfLab: Tab switcher across layers ─── */
interface PerfLabProps {
  params: Record<string, string>;
  onPatientSelect: (patient: NormalPatientRecord) => void;
}

const LAYERS = [
  { id: 0, label: "L0: Vanilla" },
  { id: 1, label: "L1: autoHeight" },
  { id: 2, label: "L2: +Hook" },
  { id: 3, label: "L3: +DualGrid" },
  { id: 4, label: "L4: Full PspList" },
] as const;

export function PerfLab({ onPatientSelect }: PerfLabProps): React.ReactElement {
  const [layer, setLayer] = useState(0);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          display: "flex",
          gap: 4,
          padding: "4px 8px",
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        {LAYERS.map((l) => (
          <button
            key={l.id}
            onClick={() => setLayer(l.id)}
            style={{
              padding: "2px 8px",
              backgroundColor: layer === l.id ? "#1976d2" : "#fff",
              color: layer === l.id ? "#fff" : "#333",
              border: "1px solid #ccc",
              borderRadius: 3,
              cursor: "pointer",
              fontSize: 11,
              fontFamily: "monospace",
            }}
          >
            {l.label}
          </button>
        ))}
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {layer === 0 && <Layer0 />}
        {layer === 1 && <Layer1 />}
        {layer === 2 && <Layer2 />}
        {layer === 3 && <Layer3 />}
        {layer === 4 && <Layer4 onPatientSelect={onPatientSelect} />}
      </div>
    </div>
  );
}
