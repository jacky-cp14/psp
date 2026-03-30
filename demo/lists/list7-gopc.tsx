import React, { useMemo } from 'react';
import type { GridColDef } from '@mui/x-data-grid-pro';
import { PspList, SelectionPanel } from '@psp/core';
import type { SortOption } from '@psp/core';
import type { GopcPatientRecord } from '../types/patient-record';
import { useListData } from '../hooks/useListData';
import { orderLeadSexAgeEnZh, scaleGridColumns, scaleW, useDemoPspLayout } from '../hooks/useDemoPspLayout';

const RIGHT_BASE: GridColDef[] = [
  { field: 'priority', headerName: 'Priority', width: 80 },
  { field: 'assmt', headerName: 'Assmt.', width: 80 },
  { field: 'consult', headerName: 'Consult.', width: 80 },
  { field: 'apptType', headerName: 'Appt. Type', width: 100 },
  { field: 'attendStatus', headerName: 'Attend Status', width: 110 },
  { field: 'attendTime', headerName: 'Attend Time', width: 120 },
  { field: 'episode', headerName: 'Episode', width: 152 },
  { field: 'bookDatetime', headerName: 'Book Date/Time', width: 170 },
  { field: 'subSpec', headerName: 'Sub. Spec.', width: 100 },
  { field: 'hkid', headerName: 'HKID', width: 124 },
  { field: 'mrn', headerName: 'MRN', width: 170 },
];

const sortOptions: SortOption[] = [
  { label: 'By Slot Date/Time, Priority', keys: [
    { field: 'slotDatetime', direction: 'ASC' },
    { field: 'priorityValue', direction: 'ASC', compare: 'numeric' },
    { field: 'type', direction: 'ASC' },
  ]},
  { label: 'By Name, Slot Date/Time', keys: [
    { field: 'name', direction: 'ASC' },
    { field: 'slotDatetime', direction: 'ASC' },
    { field: 'priorityValue', direction: 'ASC', compare: 'numeric' },
    { field: 'type', direction: 'ASC' },
  ]},
  { label: 'By Case No, Slot Date/Time', keys: [
    { field: 'episode', direction: 'ASC' },
    { field: 'slotDatetime', direction: 'ASC' },
    { field: 'priorityValue', direction: 'ASC', compare: 'numeric' },
    { field: 'type', direction: 'ASC' },
  ]},
  { label: 'By HKID, Slot Date/Time', keys: [
    { field: 'hkid', direction: 'ASC' },
    { field: 'slotDatetime', direction: 'ASC' },
    { field: 'priorityValue', direction: 'ASC', compare: 'numeric' },
    { field: 'type', direction: 'ASC' },
  ]},
];

interface List7Props {
  params: Record<string, string>;
  onPatientSelect: (patient: GopcPatientRecord) => void;
}

export function List7Gopc({ params, onPatientSelect }: List7Props): React.ReactElement {
  const { langMode, rowHeight, columnScale, defaultSplit } = useDemoPspLayout();

  const { rows } = useListData<GopcPatientRecord>({
    servletUrl: 'gopcservlet',
    dataRoot: 'gopcPatList',
    params,
  });

  const leftColumns = useMemo(() => {
    const slot: GridColDef = {
      field: 'slotDatetime',
      headerName: 'Slot Date/Time',
      type: 'dateTime',
      width: scaleW(190, columnScale),
    };
    return orderLeadSexAgeEnZh(langMode, [], columnScale, slot);
  }, [langMode, columnScale]);

  const rightColumns = useMemo(
    () => scaleGridColumns(RIGHT_BASE, columnScale),
    [columnScale],
  );

  return (
    <>
      <SelectionPanel>GOPC Appointment List</SelectionPanel>
      <PspList
        rows={rows}
        leftColumns={leftColumns}
        rightColumns={rightColumns}
        sortOptions={sortOptions}
        defaultSortIndex={0}
        onPatientSelect={onPatientSelect}
        rowHeight={rowHeight}
        defaultSplit={defaultSplit}
      />
    </>
  );
}
