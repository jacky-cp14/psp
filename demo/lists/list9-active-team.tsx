import React, { useMemo } from 'react';
import type { GridColDef } from '@mui/x-data-grid-pro';
import { PspList, SelectionPanel } from '@psp/core';
import type { SortOption } from '@psp/core';
import type { ActiveTeamPatientRecord } from '../types/patient-record';
import type { DemoContextMenuProps } from '../types/demo-context-menu';
import { useListData } from '../hooks/useListData';
import { orderLeadSexAgeEnZh, scaleGridColumns, scaleW, useDemoPspLayout } from '../hooks/useDemoPspLayout';

const RIGHT_BASE: GridColDef[] = [
  { field: 'caseNo', headerName: 'Episode', width: 152 },
  { field: 'specCode', headerName: 'Spec.', width: 62 },
  { field: 'teamCode', headerName: 'Team', width: 120 },
  { field: 'specIC', headerName: 'Specialist I/C', width: 200 },
  {
    field: 'admissionDtm',
    headerName: 'Admission Date/Time',
    type: 'dateTime',
    width: 202,
  },
  { field: 'sourceCode', headerName: 'Source Code', width: 122 },
];

const sortOptions: SortOption[] = [
  { label: 'By Admission Date/Time', keys: [
    { field: 'admissionDtm', direction: 'ASC' },
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

interface List9Props extends DemoContextMenuProps {
  params: Record<string, string>;
  onPatientSelect: (patient: ActiveTeamPatientRecord) => void;
}

export function List9ActiveTeam({
  params,
  onPatientSelect,
  onPatCountBySpecialty,
  onPluginListSelect,
}: List9Props): React.ReactElement {
  const { langMode, rowHeight, columnScale, defaultSplit } = useDemoPspLayout();

  const { rows } = useListData<ActiveTeamPatientRecord>({
    servletUrl: 'activeteamservlet',
    dataRoot: 'cpiActiveTeamPatList',
    params,
  });

  const leftColumns = useMemo(() => {
    const f = columnScale;
    const ward: GridColDef = { field: 'wardCode2Disp', headerName: 'Ward', width: scaleW(65, f) };
    const bed: GridColDef = { field: 'bed', headerName: 'Bed', width: scaleW(100, f) };
    const hkid: GridColDef = { field: 'hkid', headerName: 'HKID', width: scaleW(140, f) };
    return orderLeadSexAgeEnZh(langMode, [ward], columnScale, bed, [hkid]);
  }, [langMode, columnScale]);

  const rightColumns = useMemo(
    () => scaleGridColumns(RIGHT_BASE, columnScale),
    [columnScale],
  );

  return (
    <>
      <SelectionPanel>Active Patient by Team</SelectionPanel>
      <PspList
        rows={rows}
        leftColumns={leftColumns}
        rightColumns={rightColumns}
        sortOptions={sortOptions}
        defaultSortIndex={8}
        onPatientSelect={onPatientSelect}
        onPatCountBySpecialty={onPatCountBySpecialty}
        onPluginListSelect={onPluginListSelect}
        rowHeight={rowHeight}
        defaultSplit={defaultSplit}
      />
    </>
  );
}
