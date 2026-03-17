import React from 'react';
import type { GridColDef } from '@mui/x-data-grid-pro';
import { PspList } from '../../src/components/PspList';
import type { PspListConfig } from '../../src/types/list-config';
import type { NormalPatientRecord } from '../../src/types/patient-record';
import { normalSortOptions } from '../../src/utils/sort-comparators';

const leftColumns: GridColDef[] = [
  { field: 'wardCodeDisp', headerName: 'Ward', width: 65 },
  { field: 'bedNoDisp', headerName: 'Bed', width: 100 },
  { field: 'name', headerName: 'English Name', flex: 1, minWidth: 200 },
  { field: 'chineseNameDisp', headerName: 'Chinese Name', width: 160 },
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

const config: PspListConfig<NormalPatientRecord> = {
  servletUrl: 'cpicaseservlet',
  dataRoot: 'cpiPatList',
  sortOptions: normalSortOptions,
  defaultSortIndex: 1,
};

export interface List0Props {
  params: Record<string, string>;
  onPatientSelect: (patient: NormalPatientRecord) => void;
}

export function List0Normal({ params, onPatientSelect }: List0Props): React.ReactElement {
  return (
    <PspList config={config} params={params} onPatientSelect={onPatientSelect}>
      <PspList.SelectionPanel>
        <span>Normal Patient List</span>
      </PspList.SelectionPanel>
      <PspList.DualGrid leftColumns={leftColumns} rightColumns={rightColumns} />
      <PspList.SortMenu sortLabels={normalSortOptions.map((s) => s.label)} />
    </PspList>
  );
}
