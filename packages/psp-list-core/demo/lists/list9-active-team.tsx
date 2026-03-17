import React from 'react';
import type { GridColDef } from '@mui/x-data-grid-pro';
import { PspList } from '../../src/components/PspList';
import type { PspListConfig } from '../../src/types/list-config';
import type { ActiveTeamPatientRecord } from '../../src/types/patient-record';
import { activeTeamSortOptions } from '../../src/utils/sort-comparators';

const leftColumns: GridColDef[] = [
  { field: 'wardCode2Disp', headerName: 'Ward', width: 65 },
  { field: 'bedNoDisp', headerName: 'Bed', width: 100 },
  { field: 'name', headerName: 'English Name', flex: 1, minWidth: 200 },
  { field: 'chineseNameDisp', headerName: 'Chinese Name', width: 160 },
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

const config: PspListConfig<ActiveTeamPatientRecord> = {
  servletUrl: 'activeteamservlet',
  dataRoot: 'cpiActiveTeamPatList',
  sortOptions: activeTeamSortOptions,
  defaultSortIndex: 0,
};

export interface List9Props {
  params: Record<string, string>;
  onPatientSelect: (patient: ActiveTeamPatientRecord) => void;
}

export function List9ActiveTeam({ params, onPatientSelect }: List9Props): React.ReactElement {
  return (
    <PspList config={config} params={params} onPatientSelect={onPatientSelect}>
      <PspList.SelectionPanel>
        <span>Active Patient by Team</span>
      </PspList.SelectionPanel>
      <PspList.DualGrid leftColumns={leftColumns} rightColumns={rightColumns} />
      <PspList.SortMenu sortLabels={activeTeamSortOptions.map((s) => s.label)} />
    </PspList>
  );
}
