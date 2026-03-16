import { useState, useCallback, useRef, useMemo } from 'react';
import type { GridRowId } from '@mui/x-data-grid-pro';
import type { PatientRecord } from '../types/patient-record';

export interface UsePatientSelectionConfig {
  rows: PatientRecord[];
  onPatientSelect: (patient: PatientRecord) => void;
  debounceMs?: number;
}

export interface UsePatientSelectionReturn {
  selectedRowId: GridRowId | null;
  selectedIndex: number;
  setSelectedRowId: (id: GridRowId | null) => void;
  onRowClick: (id: GridRowId) => void;
  onPatientSubmit: () => void;
}

/**
 * Row click = highlight (set selectedRowId).
 * Double-click or ENTER = submit (calls onPatientSelect with debounce).
 * Debounce default 1000ms matches original ExtJS dblclick behavior.
 */
export function usePatientSelection(
  config: UsePatientSelectionConfig,
): UsePatientSelectionReturn {
  const { rows, onPatientSelect, debounceMs = 1000 } = config;
  const [selectedRowId, setSelectedRowId] = useState<GridRowId | null>(null);
  const lastSubmitRef = useRef<number>(0);

  const selectedIndex = useMemo(() => {
    if (selectedRowId === null) return -1;
    return rows.findIndex((r) => r.id === String(selectedRowId));
  }, [rows, selectedRowId]);

  const onRowClick = useCallback((id: GridRowId) => {
    setSelectedRowId(id);
  }, []);

  const onPatientSubmit = useCallback(() => {
    const now = Date.now();
    if (now - lastSubmitRef.current < debounceMs) return;
    lastSubmitRef.current = now;

    if (selectedRowId === null) return;
    const patient = rows.find((r) => r.id === String(selectedRowId));
    if (patient) {
      onPatientSelect(patient);
    }
  }, [selectedRowId, rows, onPatientSelect, debounceMs]);

  return useMemo(
    () => ({ selectedRowId, selectedIndex, setSelectedRowId, onRowClick, onPatientSubmit }),
    [selectedRowId, selectedIndex, setSelectedRowId, onRowClick, onPatientSubmit],
  );
}
