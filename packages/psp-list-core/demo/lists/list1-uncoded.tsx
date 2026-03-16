import React from 'react';
import type { GridColDef } from '@mui/x-data-grid-pro';
import { PspList } from '../../src/components/PspList';
import type { PspListConfig } from '../../src/types/list-config';
import type { UncodedPatientRecord } from '../../src/types/patient-record';
import { uncodedSortOptions } from '../../src/utils/sort-comparators';

const leftColumns: GridColDef[] = [
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
  { field: 'dischargeDtm', headerName: 'Discharge Date/Time', width: 202 },
  { field: 'hkid', headerName: 'HKID', width: 124 },
];

const config: PspListConfig<UncodedPatientRecord> = {
  servletUrl: 'uncodeservlet',
  dataRoot: 'cpiUnCodePatList',
  sortOptions: uncodedSortOptions,
  defaultSortIndex: 0,
};

export interface List1Props {
  params: Record<string, string>;
  onPatientSelect: (patient: UncodedPatientRecord) => void;
}

export function List1Uncoded({ params, onPatientSelect }: List1Props): React.ReactElement {
  return (
    <PspList config={config} params={params} onPatientSelect={onPatientSelect}>
      <PspList.SelectionPanel>
        <span>Uncoded Patient List</span>
      </PspList.SelectionPanel>
      <PspList.DualGrid leftColumns={leftColumns} rightColumns={rightColumns} />
      <PspList.SortMenu sortLabels={uncodedSortOptions.map((s) => s.label)} />
    </PspList>
  );
}
