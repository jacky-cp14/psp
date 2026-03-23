import React from 'react';
import type { GridColDef } from '@mui/x-data-grid-pro';
import { PspList } from '../../src/components/PspList';
import type { PspListConfig } from '../../src/types/list-config';
import type { NormalPatientRecord } from '../../src/types/patient-record';
import type { SortOption } from '../../src/utils/sort-comparators';

const leftColumns: GridColDef[] = [
  { field: 'wardCode', headerName: 'Ward', width: 65 },
  { field: 'name', headerName: 'English Name', flex: 1, minWidth: 200 },
  { field: 'chineseName', headerName: 'Chinese Name', width: 160 },
];

const rightColumns: GridColDef[] = [
  { field: 'caseNo', headerName: 'Episode', width: 152 },
  { field: 'specCode', headerName: 'Spec.', width: 62 },
  { field: 'admissionDtm', headerName: 'Admission Date/Time', width: 202 },
  { field: 'sexAge', headerName: 'Sex/Age', width: 82 },
  { field: 'sourceCode', headerName: 'Source Code', width: 122 },
  { field: 'hkid', headerName: 'HKID', width: 124 },
  { field: 'mrn', headerName: 'MRN', width: 92 },
];

const sortOptions: SortOption[] = [
  { label: 'By Admission Date/Time', keys: [
    { field: 'admissionDtm', direction: 'ASC', type: 'date' },
    { field: 'wardCode', direction: 'ASC' },
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
  { label: 'By Name, Slot Date/Time', keys: [
    { field: 'name', direction: 'ASC' },
    { field: 'caseType', direction: 'ASC' },
  ]},
  { label: 'By Ward, Bed, Name', keys: [
    { field: 'wardCode', direction: 'ASC' },
    { field: 'bedNo', direction: 'ASC' },
    { field: 'name', direction: 'ASC' },
  ]},
];

const config: PspListConfig = {
  servletUrl: 'absentservlet',
  dataRoot: 'cpiAbsPatList',
  sortOptions,
  defaultSortIndex: 7,
};

interface List6Props {
  params: Record<string, string>;
  onPatientSelect: (patient: NormalPatientRecord) => void;
}

export function List6Absent({ params, onPatientSelect }: List6Props): React.ReactElement {
  return (
    <PspList config={config} params={params} onPatientSelect={onPatientSelect}>
      <PspList.SelectionPanel>
        <span>Absent Patient List</span>
      </PspList.SelectionPanel>
      <PspList.SortMenu sortLabels={sortOptions.map((s) => s.label)}>
        <PspList.DualGrid leftColumns={leftColumns} rightColumns={rightColumns} />
      </PspList.SortMenu>
    </PspList>
  );
}
