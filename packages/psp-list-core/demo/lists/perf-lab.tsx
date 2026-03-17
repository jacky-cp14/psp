import React, { useState, useRef, startTransition } from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import type { GridColDef, GridRowParams } from '@mui/x-data-grid-pro';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { useKeyboardNavigation } from '../../src/hooks/useKeyboardNavigation';
import { cpiPatList } from '../dummyData';
import type { NormalPatientRecord } from '../../src/types/patient-record';
import { List0Normal } from './list0-normal';

const ROW_HEIGHT = 28;
const ROWS = cpiPatList;

const allCols: GridColDef[] = [
  { field: 'wardCode', headerName: 'Ward', width: 65 },
  { field: 'bed', headerName: 'Bed', width: 100 },
  { field: 'name', headerName: 'Name', flex: 1, minWidth: 200 },
  { field: 'caseNo', headerName: 'Episode', width: 152 },
  { field: 'specCode', headerName: 'Spec', width: 62 },
  { field: 'sexAge', headerName: 'Sex/Age', width: 82 },
];

const leftCols: GridColDef[] = [
  { field: 'wardCode', headerName: 'Ward', width: 65 },
  { field: 'bed', headerName: 'Bed', width: 100 },
  { field: 'name', headerName: 'Name', flex: 1, minWidth: 200 },
];

const rightCols: GridColDef[] = [
  { field: 'caseNo', headerName: 'Episode', width: 152 },
  { field: 'specCode', headerName: 'Spec', width: 62 },
  { field: 'sexAge', headerName: 'Sex/Age', width: 82 },
  { field: 'sourceCode', headerName: 'Source', width: 80 },
];

/* ─── Layer 0: Vanilla DataGridPro (built-in keyboard, virtualization ON) ─── */
function Layer0(): React.ReactElement {
  return (
    <div style={{ flex: 1, minHeight: 0 }}>
      <DataGridPro
        rows={ROWS}
        columns={allCols}
        rowHeight={ROW_HEIGHT}
        hideFooter
        disableColumnMenu
      />
    </div>
  );
}

/* ─── Layer 1: autoHeight (virtualization OFF, DataGrid internal keyboard) ─── */
function Layer1(): React.ReactElement {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={scrollRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
      <DataGridPro
        rows={ROWS}
        columns={allCols}
        rowHeight={ROW_HEIGHT}
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
    rowHeight: ROW_HEIGHT,
    scrollOffset: 57,
  });

  return (
    <div
      ref={scrollRef}
      style={{ flex: 1, minHeight: 0, overflowY: 'auto', outline: 'none' }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <DataGridPro
        rows={ROWS}
        columns={allCols}
        rowHeight={ROW_HEIGHT}
        hideFooter
        autoHeight
        disableColumnMenu
        disableColumnFilter
        disableColumnSelector
        sortModel={[] as []}
        selectionModel={selectedId ? [selectedId] : []}
        onRowClick={(params: GridRowParams) => startTransition(() => setSelectedId(String(params.id)))}
      />
    </div>
  );
}

/* ─── Layer 3: Dual grids in PanelGroup (mirrors DualGrid.tsx structure) ─── */
function Layer3(): React.ReactElement {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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
    rowHeight: ROW_HEIGHT,
    scrollOffset: 57,
  });

  const selectionModel = selectedId ? [selectedId] : [];
  const sharedProps = {
    rows: ROWS,
    rowHeight: ROW_HEIGHT,
    hideFooter: true,
    autoHeight: true,
    disableColumnMenu: true,
    disableColumnFilter: true,
    disableColumnSelector: true,
    sortModel: [] as [],
    selectionModel,
    onRowClick: (params: GridRowParams) => startTransition(() => setSelectedId(String(params.id))),
  };

  const contentHeight = ROWS.length * ROW_HEIGHT;

  return (
    <div
      ref={scrollRef}
      style={{ flex: 1, minHeight: 0, overflowY: 'auto', outline: 'none' }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div style={{ minHeight: contentHeight }}>
        <PanelGroup direction="horizontal">
          <Panel defaultSize={35} style={{ minWidth: 0 }}>
            <div style={{ minWidth: 0, overflowX: 'auto', width: '100%', height: '100%' }}>
              <DataGridPro {...sharedProps} columns={leftCols} />
            </div>
          </Panel>
          <PanelResizeHandle style={{ width: 4, backgroundColor: '#e0e0e0', cursor: 'col-resize' }} />
          <Panel style={{ minWidth: 0 }}>
            <div style={{ minWidth: 0, overflowX: 'auto', width: '100%', height: '100%' }}>
              <DataGridPro {...sharedProps} columns={rightCols} />
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

/* ─── Layer 4: Full PspList compound component (context + all hooks) ─── */
function Layer4({ onPatientSelect }: { onPatientSelect: (p: NormalPatientRecord) => void }): React.ReactElement {
  return (
    <List0Normal
      params={{ hospCode: 'QMH', wardCode: 'WARD_A' }}
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
  { id: 0, label: 'L0: Vanilla' },
  { id: 1, label: 'L1: autoHeight' },
  { id: 2, label: 'L2: +Hook' },
  { id: 3, label: 'L3: +DualGrid' },
  { id: 4, label: 'L4: Full PspList' },
] as const;

export function PerfLab({ onPatientSelect }: PerfLabProps): React.ReactElement {
  const [layer, setLayer] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', gap: 4, padding: '4px 8px', backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
        {LAYERS.map((l) => (
          <button
            key={l.id}
            onClick={() => setLayer(l.id)}
            style={{
              padding: '2px 8px',
              backgroundColor: layer === l.id ? '#1976d2' : '#fff',
              color: layer === l.id ? '#fff' : '#333',
              border: '1px solid #ccc',
              borderRadius: 3,
              cursor: 'pointer',
              fontSize: 11,
              fontFamily: 'monospace',
            }}
          >
            {l.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {layer === 0 && <Layer0 />}
        {layer === 1 && <Layer1 />}
        {layer === 2 && <Layer2 />}
        {layer === 3 && <Layer3 />}
        {layer === 4 && <Layer4 onPatientSelect={onPatientSelect} />}
      </div>
    </div>
  );
}
