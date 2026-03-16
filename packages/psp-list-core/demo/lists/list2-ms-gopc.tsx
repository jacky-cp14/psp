import React from 'react';
import type { GridColDef } from '@mui/x-data-grid-pro';
import { PspList } from '../../src/components/PspList';
import type { PspListConfig } from '../../src/types/list-config';
import type { GopcPatientRecord } from '../../src/types/patient-record';
import { gopcSortOptions } from '../../src/utils/sort-comparators';

const leftColumns: GridColDef[] = [
  { field: 'slotDatetime', headerName: 'Slot Date/Time', width: 190 },
  { field: 'name', headerName: 'English Name', flex: 1, minWidth: 200 },
  { field: 'chineseNameDisp', headerName: 'Chinese Name', width: 160 },
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

const config: PspListConfig<GopcPatientRecord> = {
  servletUrl: 'msgopcservlet',
  dataRoot: 'msGopcPatList',
  sortOptions: gopcSortOptions,
  defaultSortIndex: 0,
  selectionMode: 'hkidSearch',
};

export interface List2Props {
  params: Record<string, string>;
  onPatientSelect: (patient: GopcPatientRecord) => void;
}

export function List2MsGopc({ params, onPatientSelect }: List2Props): React.ReactElement {
  return (
    <PspList config={config} params={params} onPatientSelect={onPatientSelect}>
      <PspList.SelectionPanel>
        <span>MS GOPC Appointment List</span>
      </PspList.SelectionPanel>
      <PspList.DualGrid leftColumns={leftColumns} rightColumns={rightColumns} />
      <PspList.SortMenu sortLabels={gopcSortOptions.map((s) => s.label)} />
    </PspList>
  );
}
