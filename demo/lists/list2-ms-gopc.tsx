import React from 'react';
import type { GridColDef } from '@mui/x-data-grid-pro';
import { PspList, SelectionPanel } from '@psp/core';
import type { GopcPatientRecord, SortOption } from '@psp/core';
import { useListData } from '../hooks/useListData';

const leftColumns: GridColDef[] = [
  { field: 'slotDatetime', headerName: 'Slot Date/Time', type: 'dateTime', width: 190 },
  { field: 'name', headerName: 'English Name', flex: 1, minWidth: 200 },
  { field: 'chineseName', headerName: 'Chinese Name', width: 160 },
];

const rightColumns: GridColDef[] = [
  { field: 'priority', headerName: 'Priority', width: 80 },
  { field: 'assmt', headerName: 'Assmt.', width: 80 },
  { field: 'consult', headerName: 'Consult.', width: 80 },
  { field: 'apptType', headerName: 'Appt. Type', width: 100 },
  { field: 'attendStatus', headerName: 'Attend Status', width: 110 },
  { field: 'attendTime', headerName: 'Attend Time', width: 120 },
  { field: 'episode', headerName: 'Episode', width: 152 },
  { field: 'bookDatetime', headerName: 'Book Date/Time', width: 170 },
  { field: 'subSpec', headerName: 'Sub. Spec.', width: 100 },
  { field: 'sexAge', headerName: 'Sex/Age', width: 82 },
  { field: 'hkid', headerName: 'HKID', width: 124 },
  { field: 'mrn', headerName: 'MRN', width: 170 },
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

interface List2Props {
  params: Record<string, string>;
  onPatientSelect: (patient: GopcPatientRecord) => void;
}

export function List2MsGopc({ params, onPatientSelect }: List2Props): React.ReactElement {
  const { rows } = useListData<GopcPatientRecord>({
    servletUrl: 'msgopcservlet',
    dataRoot: 'msGopcPatList',
    params,
  });

  return (
    <>
      <SelectionPanel>MS GOPC Appointment List</SelectionPanel>
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
