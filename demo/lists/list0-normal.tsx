import React, { useMemo } from 'react';
import type { GridColDef } from '@mui/x-data-grid-pro';
import { PspList, SelectionPanel } from '@psp/core';
import type { SortOption } from '@psp/core';
import type { NormalPatientRecord } from '../types/patient-record';
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
];

interface List0Props {
  params: Record<string, string>;
  onPatientSelect: (patient: NormalPatientRecord) => void;
}

export function List0Normal({ params, onPatientSelect }: List0Props): React.ReactElement {
  const { langMode, rowHeight, columnScale, defaultSplit } = useDemoPspLayout();

  const { rows } = useListData<NormalPatientRecord>({
    servletUrl: 'cpicaseservlet',
    dataRoot: 'cpiPatList',
    params,
  });

  const leftColumns = useMemo(() => {
    const f = columnScale;
    const ward: GridColDef = { field: 'wardCode', headerName: 'Ward', width: scaleW(65, f) };
    const bed: GridColDef = { field: 'bed', headerName: 'Bed', width: scaleW(100, f) };
    return orderLeadSexAgeEnZh(langMode, [ward], columnScale, bed);
  }, [langMode, columnScale]);

  const rightColumns = useMemo(
    () => scaleGridColumns(RIGHT_BASE, columnScale),
    [columnScale],
  );

  return (
    <>
      <SelectionPanel>Normal Patient List</SelectionPanel>
      <PspList
        rows={rows}
        leftColumns={leftColumns}
        rightColumns={rightColumns}
        sortOptions={sortOptions}
        defaultSortIndex={1}
        onPatientSelect={onPatientSelect}
        rowHeight={rowHeight}
        defaultSplit={defaultSplit}
      />
    </>
  );
}
