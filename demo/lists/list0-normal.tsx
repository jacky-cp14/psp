import React from 'react';
import type { GridColDef } from '@mui/x-data-grid-pro';
import { PspList, SelectionPanel } from '@psp/core';
import type { SortOption } from '@psp/core';
import type { NormalPatientRecord } from '../types/patient-record';
import { useListData } from '../hooks/useListData';

const leftColumns: GridColDef[] = [
  { field: 'wardCode', headerName: 'Ward', width: 65 },
  { field: 'bed', headerName: 'Bed', width: 100 },
  { field: 'name', headerName: 'English Name', flex: 1, minWidth: 200 },
  { field: 'chineseName', headerName: 'Chinese Name', width: 160 },
];

const rightColumns: GridColDef[] = [
  { field: 'caseNo', headerName: 'Episode', width: 152 },
  { field: 'specCode', headerName: 'Spec.', width: 62 },
  { field: 'admissionDtm', headerName: 'Admission Date/Time', type: 'dateTime', width: 202 },
  { field: 'sexAge', headerName: 'Sex/Age', width: 82 },
  { field: 'sourceCode', headerName: 'Source Code', width: 122 },
  { field: 'hkid', headerName: 'HKID', width: 124 },
  { field: 'mrn', headerName: 'MRN', width: 92 },
];

const sortOptions: SortOption[] = [
  { label: 'By Admission Date/Time', keys: [
    { field: 'admissionDtm', direction: 'ASC' },
    { field: 'wardCode', direction: 'ASC' },
    { field: 'bedNo', direction: 'ASC' },
    { field: 'name', direction: 'ASC' },
  ]},
  { label: 'By Bed, Name', keys: [
    { field: 'bedNo', direction: 'ASC' },
    { field: 'name', direction: 'ASC' },
  ]},
  { label: 'By Case No.', keys: [
    { field: 'caseNo', direction: 'ASC' },
    { field: 'wardCode', direction: 'ASC' },
    { field: 'bedNo', direction: 'ASC' },
    { field: 'name', direction: 'ASC' },
  ]},
  { label: 'By HKID', keys: [
    { field: 'hkid', direction: 'ASC' },
    { field: 'wardCode', direction: 'ASC' },
    { field: 'bedNo', direction: 'ASC' },
    { field: 'name', direction: 'ASC' },
  ]},
  { label: 'By Name, Bed', keys: [
    { field: 'name', direction: 'ASC' },
    { field: 'wardCode', direction: 'ASC' },
    { field: 'bedNo', direction: 'ASC' },
  ]},
  { label: 'By Source Hospital', keys: [
    { field: 'sourceCode', direction: 'ASC' },
    { field: 'wardCode', direction: 'ASC' },
    { field: 'bedNo', direction: 'ASC' },
    { field: 'name', direction: 'ASC' },
  ]},
  { label: 'By Specialty', keys: [
    { field: 'specCode', direction: 'ASC' },
    { field: 'wardCode', direction: 'ASC' },
    { field: 'bedNo', direction: 'ASC' },
    { field: 'name', direction: 'ASC' },
  ]},
  { label: 'By Source Hospital, Specialty', keys: [
    { field: 'sourceCode', direction: 'ASC' },
    { field: 'specCode', direction: 'ASC' },
    { field: 'wardCode', direction: 'ASC' },
    { field: 'bedNo', direction: 'ASC' },
    { field: 'name', direction: 'ASC' },
  ]},
];

interface List0Props {
  params: Record<string, string>;
  onPatientSelect: (patient: NormalPatientRecord) => void;
}

export function List0Normal({ params, onPatientSelect }: List0Props): React.ReactElement {
  const { rows } = useListData<NormalPatientRecord>({
    servletUrl: 'cpicaseservlet',
    dataRoot: 'cpiPatList',
    params,
  });

  return (
    <>
      <SelectionPanel>Normal Patient List</SelectionPanel>
      <PspList
        rows={rows}
        leftColumns={leftColumns}
        rightColumns={rightColumns}
        sortOptions={sortOptions}
        defaultSortIndex={1}
        onPatientSelect={onPatientSelect}
      />
    </>
  );
}
