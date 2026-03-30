import React, { useMemo } from 'react';
import type { GridColDef } from '@mui/x-data-grid-pro';
import { PspList, SelectionPanel } from '@psp/core';
import type { SortOption } from '@psp/core';
import type { UncodedPatientRecord } from '../types/patient-record';
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
  {
    field: 'dischargeDtm',
    headerName: 'Discharge Date/Time',
    type: 'dateTime',
    width: 202,
  },
  { field: 'hkid', headerName: 'HKID', width: 124 },
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
  { label: 'By Discharge Date/Time', keys: [
    { field: 'dischargeDtm', direction: 'DESC' },
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

interface List1Props {
  params: Record<string, string>;
  onPatientSelect: (patient: UncodedPatientRecord) => void;
}

export function List1Uncoded({ params, onPatientSelect }: List1Props): React.ReactElement {
  const { langMode, rowHeight, columnScale, defaultSplit } = useDemoPspLayout();

  const { rows } = useListData<UncodedPatientRecord>({
    servletUrl: 'uncodeservlet',
    dataRoot: 'cpiUnCodePatList',
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
      <SelectionPanel>Uncoded Patient List</SelectionPanel>
      <PspList
        rows={rows}
        leftColumns={leftColumns}
        rightColumns={rightColumns}
        sortOptions={sortOptions}
        defaultSortIndex={2}
        onPatientSelect={onPatientSelect}
        rowHeight={rowHeight}
        defaultSplit={defaultSplit}
      />
    </>
  );
}
