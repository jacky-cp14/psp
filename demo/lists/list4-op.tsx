import React, { useMemo } from 'react';
import type { GridColDef } from '@mui/x-data-grid-pro';
import { PspList, SelectionPanel } from '@psp/core';
import type { SortOption } from '@psp/core';
import type { OpPatientRecord } from '../types/patient-record';
import type { DemoContextMenuProps } from '../types/demo-context-menu';
import { useListData } from '../hooks/useListData';
import { orderLeadSexAgeEnZh, scaleGridColumns, scaleW, useDemoPspLayout } from '../hooks/useDemoPspLayout';

const RIGHT_BASE: GridColDef[] = [
  { field: 'episode', headerName: 'Episode', width: 152 },
  { field: 'priority', headerName: 'Priority', width: 80 },
  { field: 'type', headerName: 'Type', width: 80 },
  { field: 'attendTime', headerName: 'Attend Time', width: 120 },
  { field: 'hkid', headerName: 'HKID', width: 124 },
  { field: 'mrn', headerName: 'MRN', width: 150 },
  { field: 'prIndicator', headerName: 'PR Indicator', width: 150 },
];

const sortOptions: SortOption[] = [
  { label: 'By Slot Date/Time, Priority', keys: [
    { field: 'slotDatetime', direction: 'ASC' },
    { field: 'priorityValue', direction: 'ASC', compare: 'numeric' },
    { field: 'type', direction: 'ASC' },
  ]},
  { label: 'By Name, Slot Date/Time', keys: [
    { field: 'name', direction: 'ASC' },
    { field: 'slotDatetime', direction: 'ASC' },
    { field: 'priorityValue', direction: 'ASC', compare: 'numeric' },
    { field: 'type', direction: 'ASC' },
  ]},
  { label: 'By Appt Case Type', keys: [
    { field: 'type', direction: 'ASC' },
    { field: 'slotDatetime', direction: 'ASC' },
    { field: 'priorityValue', direction: 'ASC', compare: 'numeric' },
  ]},
  { label: 'By Case No, Slot Date/Time', keys: [
    { field: 'episode', direction: 'ASC' },
    { field: 'slotDatetime', direction: 'ASC' },
    { field: 'priorityValue', direction: 'ASC', compare: 'numeric' },
    { field: 'type', direction: 'ASC' },
  ]},
  { label: 'By HKID, Slot Date/Time', keys: [
    { field: 'hkid', direction: 'ASC' },
    { field: 'slotDatetime', direction: 'ASC' },
    { field: 'priorityValue', direction: 'ASC', compare: 'numeric' },
    { field: 'type', direction: 'ASC' },
  ]},
];

interface List4Props extends DemoContextMenuProps {
  params: Record<string, string>;
  onPatientSelect: (patient: OpPatientRecord) => void;
}

export function List4Op({
  params,
  onPatientSelect,
  onPatCountBySpecialty,
  onPluginListSelect,
}: List4Props): React.ReactElement {
  const { langMode, rowHeight, columnScale, defaultSplit } = useDemoPspLayout();

  const { rows } = useListData<OpPatientRecord>({
    servletUrl: 'opservlet',
    dataRoot: 'opPatList',
    params,
  });

  const leftColumns = useMemo(() => {
    const slot: GridColDef = {
      field: 'slotDatetime',
      headerName: 'Slot Date/Time',
      type: 'dateTime',
      width: scaleW(190, columnScale),
    };
    return orderLeadSexAgeEnZh(langMode, [], columnScale, slot);
  }, [langMode, columnScale]);

  const rightColumns = useMemo(
    () => scaleGridColumns(RIGHT_BASE, columnScale),
    [columnScale],
  );

  return (
    <>
      <SelectionPanel>OP Appointment List</SelectionPanel>
      <PspList
        rows={rows}
        leftColumns={leftColumns}
        rightColumns={rightColumns}
        sortOptions={sortOptions}
        defaultSortIndex={0}
        onPatientSelect={onPatientSelect}
        onPatCountBySpecialty={onPatCountBySpecialty}
        onPluginListSelect={onPluginListSelect}
        rowHeight={rowHeight}
        defaultSplit={defaultSplit}
      />
    </>
  );
}
