import React from 'react';
import type { GridColDef } from '@mui/x-data-grid-pro';
import { PspList } from '../../src/components/PspList';
import type { PspListConfig } from '../../src/types/list-config';
import type { OpPatientRecord } from '../../src/types/patient-record';
import { opSortOptions } from '../../src/utils/sort-comparators';

const leftColumns: GridColDef[] = [
  { field: 'slotDatetime', headerName: 'Slot Date/Time', width: 190 },
  { field: 'name', headerName: 'English Name', flex: 1, minWidth: 200 },
  { field: 'chineseNameDisp', headerName: 'Chinese Name', width: 160 },
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

const config: PspListConfig<OpPatientRecord> = {
  servletUrl: 'opservlet',
  dataRoot: 'opPatList',
  sortOptions: opSortOptions,
  defaultSortIndex: 0,
  selectionMode: 'hkidSearch',
};

export interface List4Props {
  params: Record<string, string>;
  onPatientSelect: (patient: OpPatientRecord) => void;
}

export function List4Op({ params, onPatientSelect }: List4Props): React.ReactElement {
  return (
    <PspList config={config} params={params} onPatientSelect={onPatientSelect}>
      <PspList.SelectionPanel>
        <span>OP Appointment List</span>
      </PspList.SelectionPanel>
      <PspList.DualGrid leftColumns={leftColumns} rightColumns={rightColumns} />
      <PspList.SortMenu sortLabels={opSortOptions.map((s) => s.label)} />
    </PspList>
  );
}
