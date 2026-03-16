import React from 'react';
import type { GridColDef } from '@mui/x-data-grid-pro';
import { PspList } from '../../src/components/PspList';
import type { PspListConfig } from '../../src/types/list-config';
import type { MoInChargePatientRecord } from '../../src/types/patient-record';
import { moInChargeSortOptions } from '../../src/utils/sort-comparators';

const leftColumns: GridColDef[] = [
  { field: 'bed', headerName: 'Bed', width: 100 },
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
  { field: 'moic', headerName: 'MO In-Charge', width: 140 },
];

const config: PspListConfig<MoInChargePatientRecord> = {
  servletUrl: 'moinchargeservlet',
  dataRoot: 'moPatList',
  sortOptions: moInChargeSortOptions,
  defaultSortIndex: 0,
  pageSize: 7,
};

export interface List3Props {
  params: Record<string, string>;
  onPatientSelect: (patient: MoInChargePatientRecord) => void;
}

export function List3MoInCharge({ params, onPatientSelect }: List3Props): React.ReactElement {
  return (
    <PspList config={config} params={params} onPatientSelect={onPatientSelect}>
      <PspList.SelectionPanel>
        <span>MO In-Charge Patient List</span>
      </PspList.SelectionPanel>
      <PspList.DualGrid leftColumns={leftColumns} rightColumns={rightColumns} />
      <PspList.SortMenu sortLabels={moInChargeSortOptions.map((s) => s.label)} />
    </PspList>
  );
}
