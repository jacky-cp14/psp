import React, { useMemo } from 'react';
import type { GridColDef } from '@mui/x-data-grid-pro';
import { PspList, SelectionPanel } from '@psp/core';
import type { SortOption } from '@psp/core';
import type { MoInChargePatientRecord } from '../types/patient-record';
import type { DemoContextMenuProps } from '../types/demo-context-menu';
import { useListData } from '../hooks/useListData';
import { orderLeadSexAgeEnZh, scaleGridColumns, scaleW, useDemoPspLayout } from '../hooks/useDemoPspLayout';

const RIGHT_BASE: GridColDef[] = [
  { field: 'caseNo', headerName: 'Episode', width: 152 },
  { field: 'specCode', headerName: 'Spec.', width: 62 },
  {
    field: 'admissionDtm',
    headerName: 'Admission Date/Time',
    type: 'dateTime',
    width: 202,
  },
  { field: 'sourceCode', headerName: 'Source Code', width: 122 },
  { field: 'hkid', headerName: 'HKID', width: 124 },
  { field: 'mrn', headerName: 'MRN', width: 92 },
  { field: 'moic', headerName: 'MO In-Charge', width: 140 },
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
  { label: 'By MO in charge', keys: [
    { field: 'moic', direction: 'ASC' },
    { field: 'wardCode', direction: 'ASC' },
    { field: 'bedNo', direction: 'ASC' },
    { field: 'name', direction: 'ASC' },
  ]},
];

interface List3Props extends DemoContextMenuProps {
  params: Record<string, string>;
  onPatientSelect: (patient: MoInChargePatientRecord) => void;
}

export function List3MoInCharge({
  params,
  onPatientSelect,
  onPatCountBySpecialty,
  onPluginListSelect,
}: List3Props): React.ReactElement {
  const { langMode, rowHeight, columnScale, defaultSplit } = useDemoPspLayout();

  const { rows } = useListData<MoInChargePatientRecord>({
    servletUrl: 'moinchargeservlet',
    dataRoot: 'moPatList',
    params,
  });

  const leftColumns = useMemo(() => {
    const bed: GridColDef = { field: 'bed', headerName: 'Bed', width: scaleW(100, columnScale) };
    return orderLeadSexAgeEnZh(langMode, [], columnScale, bed);
  }, [langMode, columnScale]);

  const rightColumns = useMemo(
    () => scaleGridColumns(RIGHT_BASE, columnScale),
    [columnScale],
  );

  return (
    <>
      <SelectionPanel>MO In-Charge Patient List</SelectionPanel>
      <PspList
        rows={rows}
        leftColumns={leftColumns}
        rightColumns={rightColumns}
        sortOptions={sortOptions}
        defaultSortIndex={1}
        pageSize={7}
        onPatientSelect={onPatientSelect}
        onPatCountBySpecialty={onPatCountBySpecialty}
        onPluginListSelect={onPluginListSelect}
        rowHeight={rowHeight}
        defaultSplit={defaultSplit}
      />
    </>
  );
}
