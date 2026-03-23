import React from 'react';
import type { GridColDef } from '@mui/x-data-grid-pro';
import { PspList } from '@psp/core';
import type { ActiveTeamPatientRecord, PspListConfig, SortOption } from '@psp/core';
import { useListData } from '../hooks/useListData';

const leftColumns: GridColDef[] = [
  { field: 'wardCode2Disp', headerName: 'Ward', width: 65 },
  { field: 'bed', headerName: 'Bed', width: 100 },
  { field: 'name', headerName: 'English Name', flex: 1, minWidth: 200 },
  { field: 'chineseName', headerName: 'Chinese Name', width: 160 },
  { field: 'sexAge', headerName: 'Sex/Age', width: 90 },
  { field: 'hkid', headerName: 'HKID', width: 140 },
];

const rightColumns: GridColDef[] = [
  { field: 'caseNo', headerName: 'Episode', width: 152 },
  { field: 'specCode', headerName: 'Spec.', width: 62 },
  { field: 'teamCode', headerName: 'Team', width: 120 },
  { field: 'specIC', headerName: 'Specialist I/C', width: 200 },
  { field: 'admissionDtm', headerName: 'Admission Date/Time', width: 202 },
  { field: 'sourceCode', headerName: 'Source Code', width: 122 },
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
  { label: 'By Ward, Bed, Name', keys: [
    { field: 'wardCode', direction: 'ASC' },
    { field: 'bedNo', direction: 'ASC' },
    { field: 'name', direction: 'ASC' },
  ]},
  { label: 'By Ward, Bed, Specialty', keys: [
    { field: 'wardCode', direction: 'ASC' },
    { field: 'bedNo', direction: 'ASC' },
    { field: 'specCode', direction: 'ASC' },
  ]},
  { label: 'By Team', keys: [
    { field: 'teamCode', direction: 'ASC' },
    { field: 'wardCode', direction: 'ASC' },
    { field: 'bedNo', direction: 'ASC' },
    { field: 'name', direction: 'ASC' },
  ]},
];

const config: PspListConfig = {
  sortOptions,
  defaultSortIndex: 8,
};

interface List9Props {
  params: Record<string, string>;
  onPatientSelect: (patient: ActiveTeamPatientRecord) => void;
}

export function List9ActiveTeam({ params, onPatientSelect }: List9Props): React.ReactElement {
  const { rows } = useListData<ActiveTeamPatientRecord>({
    servletUrl: 'activeteamservlet',
    dataRoot: 'cpiActiveTeamPatList',
    params,
  });

  return (
    <PspList rows={rows} config={config} onPatientSelect={onPatientSelect}>
      <PspList.SelectionPanel>
        <span>Active Patient by Team</span>
      </PspList.SelectionPanel>
      <PspList.SortMenu sortLabels={sortOptions.map((s) => s.label)}>
        <PspList.DualGrid leftColumns={leftColumns} rightColumns={rightColumns} />
      </PspList.SortMenu>
    </PspList>
  );
}
