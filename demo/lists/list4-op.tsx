import React from 'react';
import type { GridColDef } from '@mui/x-data-grid-pro';
import { PspList } from '@psp/core';
import type { OpPatientRecord, PspListConfig, SortOption } from '@psp/core';

const leftColumns: GridColDef[] = [
  { field: 'slotDatetime', headerName: 'Slot Date/Time', width: 190 },
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
    { field: 'slotDatetime', direction: 'ASC', type: 'date' },
    { field: 'priorityValue', direction: 'ASC', type: 'numeric' },
    { field: 'type', direction: 'ASC' },
  ]},
  { label: 'By Name, Slot Date/Time', keys: [
    { field: 'name', direction: 'ASC' },
    { field: 'slotDatetime', direction: 'ASC', type: 'date' },
    { field: 'priorityValue', direction: 'ASC', type: 'numeric' },
    { field: 'type', direction: 'ASC' },
  ]},
  { label: 'By Appt Case Type', keys: [
    { field: 'type', direction: 'ASC' },
    { field: 'slotDatetime', direction: 'ASC', type: 'date' },
    { field: 'priorityValue', direction: 'ASC', type: 'numeric' },
  ]},
  { label: 'By Case No, Slot Date/Time', keys: [
    { field: 'episode', direction: 'ASC' },
    { field: 'slotDatetime', direction: 'ASC', type: 'date' },
    { field: 'priorityValue', direction: 'ASC', type: 'numeric' },
    { field: 'type', direction: 'ASC' },
  ]},
  { label: 'By HKID, Slot Date/Time', keys: [
    { field: 'hkid', direction: 'ASC' },
    { field: 'slotDatetime', direction: 'ASC', type: 'date' },
    { field: 'priorityValue', direction: 'ASC', type: 'numeric' },
    { field: 'type', direction: 'ASC' },
  ]},
];

const config: PspListConfig = {
  servletUrl: 'opservlet',
  dataRoot: 'opPatList',
  sortOptions,
  defaultSortIndex: 0,
  selectionMode: 'hkidSearch',
};

interface List4Props {
  params: Record<string, string>;
  onPatientSelect: (patient: OpPatientRecord) => void;
}

export function List4Op({ params, onPatientSelect }: List4Props): React.ReactElement {
  return (
    <PspList config={config} params={params} onPatientSelect={onPatientSelect}>
      <PspList.SelectionPanel>
        <span>OP Appointment List</span>
      </PspList.SelectionPanel>
      <PspList.SortMenu sortLabels={sortOptions.map((s) => s.label)}>
        <PspList.DualGrid leftColumns={leftColumns} rightColumns={rightColumns} />
      </PspList.SortMenu>
    </PspList>
  );
}
