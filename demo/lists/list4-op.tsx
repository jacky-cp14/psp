import React from 'react';
import type { GridColDef } from '@mui/x-data-grid-pro';
import { PspList, SelectionPanel } from '@psp/core';
import type { OpPatientRecord, SortOption } from '@psp/core';
import { useListData } from '../hooks/useListData';

const leftColumns: GridColDef[] = [
  { field: 'slotDatetime', headerName: 'Slot Date/Time', type: 'dateTime', width: 190 },
  { field: 'name', headerName: 'English Name', flex: 1, minWidth: 200 },
  { field: 'chineseName', headerName: 'Chinese Name', width: 160 },
];

const rightColumns: GridColDef[] = [
  { field: 'episode', headerName: 'Episode', width: 152 },
  { field: 'priority', headerName: 'Priority', width: 80 },
  { field: 'type', headerName: 'Type', width: 80 },
  { field: 'sexAge', headerName: 'Sex/Age', width: 82 },
  { field: 'attendTime', headerName: 'Attend Time', width: 120 },
  { field: 'hkid', headerName: 'HKID', width: 124 },
  { field: 'mrn', headerName: 'MRN', width: 150 },
  { field: 'prIndicator', headerName: 'PR Indicator', width: 150 },
];

const sortOptions: SortOption[] = [
  { label: 'By Slot Date/Time, Priority', keys: [
    { field: 'slotDatetime', direction: 'ASC' },
    { field: 'priorityValue', direction: 'ASC', type: 'numeric' },
    { field: 'type', direction: 'ASC' },
  ]},
  { label: 'By Name, Slot Date/Time', keys: [
    { field: 'name', direction: 'ASC' },
    { field: 'slotDatetime', direction: 'ASC' },
    { field: 'priorityValue', direction: 'ASC', type: 'numeric' },
    { field: 'type', direction: 'ASC' },
  ]},
  { label: 'By Appt Case Type', keys: [
    { field: 'type', direction: 'ASC' },
    { field: 'slotDatetime', direction: 'ASC' },
    { field: 'priorityValue', direction: 'ASC', type: 'numeric' },
  ]},
  { label: 'By Case No, Slot Date/Time', keys: [
    { field: 'episode', direction: 'ASC' },
    { field: 'slotDatetime', direction: 'ASC' },
    { field: 'priorityValue', direction: 'ASC', type: 'numeric' },
    { field: 'type', direction: 'ASC' },
  ]},
  { label: 'By HKID, Slot Date/Time', keys: [
    { field: 'hkid', direction: 'ASC' },
    { field: 'slotDatetime', direction: 'ASC' },
    { field: 'priorityValue', direction: 'ASC', type: 'numeric' },
    { field: 'type', direction: 'ASC' },
  ]},
];

interface List4Props {
  params: Record<string, string>;
  onPatientSelect: (patient: OpPatientRecord) => void;
}

export function List4Op({ params, onPatientSelect }: List4Props): React.ReactElement {
  const { rows } = useListData<OpPatientRecord>({
    servletUrl: 'opservlet',
    dataRoot: 'opPatList',
    params,
  });

  return (
    <>
      <SelectionPanel>OP Appointment List</SelectionPanel>
      <PspList
        rows={rows}
        leftColumns={leftColumns}
        rightColumns={rightColumns}
        sortOptions={sortOptions}
        defaultSortIndex={0}
        selectionMode="hkidSearch"
        onPatientSelect={onPatientSelect}
      />
    </>
  );
}
