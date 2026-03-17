/**
 * Multi-key sort comparators for all PSP lists.
 * Each comparator is a pure function: (a, b) => number.
 *
 * Pattern from original: sortByFields([{field, direction}]) applies
 * multi-key comparison — try first field, break ties with subsequent fields.
 */
import type { BasePatientRecord } from '../types/patient-record';

type SortDirection = 'ASC' | 'DESC';

interface SortField {
  field: keyof BasePatientRecord | string;
  direction: SortDirection;
}

function getField(record: BasePatientRecord, field: string): string {
  const value: unknown = (record as unknown as Record<string, unknown>)[field];
  return typeof value === 'string' ? value : '';
}

function compareStrings(a: string, b: string, dir: SortDirection): number {
  const cmp = a.localeCompare(b);
  return dir === 'DESC' ? -cmp : cmp;
}

/** Builds a comparator from an ordered array of sort field descriptors. */
export function buildComparator(
  fields: SortField[]
): (a: BasePatientRecord, b: BasePatientRecord) => number {
  return (a, b) => {
    for (const { field, direction } of fields) {
      const result = compareStrings(getField(a, field), getField(b, field), direction);
      if (result !== 0) return result;
    }
    return 0;
  };
}

// --- Shared comparators used across multiple lists ---

const WARD_BED_NAME: SortField[] = [
  { field: 'wardCode', direction: 'ASC' },
  { field: 'bed', direction: 'ASC' },
  { field: 'name', direction: 'ASC' },
];

const BED_NAME: SortField[] = [
  { field: 'bed', direction: 'ASC' },
  { field: 'name', direction: 'ASC' },
];

// --- List 0 (Normal) sort options ---

export const normalSortOptions = [
  { label: 'By Admission Date/Time', comparator: buildComparator([{ field: 'admissionDtm', direction: 'ASC' }, ...WARD_BED_NAME]) },
  { label: 'By Bed, Name', comparator: buildComparator(BED_NAME) },
  { label: 'By Episode', comparator: buildComparator([{ field: 'caseNo', direction: 'ASC' }, ...WARD_BED_NAME]) },
  { label: 'By HKID', comparator: buildComparator([{ field: 'hkid', direction: 'ASC' }, ...WARD_BED_NAME]) },
  { label: 'By Name', comparator: buildComparator([{ field: 'name', direction: 'ASC' }, { field: 'wardCode', direction: 'ASC' }, { field: 'bed', direction: 'ASC' }]) },
  { label: 'By Source Hospital', comparator: buildComparator([{ field: 'sourceCode', direction: 'ASC' }, ...WARD_BED_NAME]) },
  { label: 'By Specialty', comparator: buildComparator([{ field: 'specCode', direction: 'ASC' }, ...WARD_BED_NAME]) },
  { label: 'By Source, Specialty', comparator: buildComparator([{ field: 'sourceCode', direction: 'ASC' }, { field: 'specCode', direction: 'ASC' }, ...WARD_BED_NAME]) },
];

// --- List 1 (Uncoded) sort options ---

export const uncodedSortOptions = [
  { label: 'By Admission Date/Time', comparator: buildComparator([{ field: 'admissionDtm', direction: 'ASC' }, ...WARD_BED_NAME]) },
  { label: 'By Bed, Name', comparator: buildComparator(BED_NAME) },
  { label: 'By Discharge Date/Time', comparator: buildComparator([{ field: 'dischargeDtm', direction: 'DESC' }]) },
  { label: 'By Episode', comparator: buildComparator([{ field: 'caseNo', direction: 'ASC' }, ...WARD_BED_NAME]) },
  { label: 'By HKID', comparator: buildComparator([{ field: 'hkid', direction: 'ASC' }, ...WARD_BED_NAME]) },
  { label: 'By Name', comparator: buildComparator([{ field: 'name', direction: 'ASC' }, { field: 'wardCode', direction: 'ASC' }, { field: 'bed', direction: 'ASC' }]) },
  { label: 'By Source Hospital', comparator: buildComparator([{ field: 'sourceCode', direction: 'ASC' }, ...WARD_BED_NAME]) },
  { label: 'By Specialty', comparator: buildComparator([{ field: 'specCode', direction: 'ASC' }, ...WARD_BED_NAME]) },
];

// --- Lists 2, 7 (MS GOPC / GOPC) sort options ---

export const gopcSortOptions = [
  { label: 'By Slot Date/Time, Priority', comparator: buildComparator([{ field: 'slotDatetime', direction: 'ASC' }, { field: 'priorityValue', direction: 'ASC' }]) },
  { label: 'By Priority, Slot Date/Time', comparator: buildComparator([{ field: 'priorityValue', direction: 'ASC' }, { field: 'slotDatetime', direction: 'ASC' }]) },
  { label: 'By Name', comparator: buildComparator([{ field: 'name', direction: 'ASC' }, { field: 'slotDatetime', direction: 'ASC' }]) },
  { label: 'By Episode', comparator: buildComparator([{ field: 'episode', direction: 'ASC' }, { field: 'slotDatetime', direction: 'ASC' }]) },
];

// --- List 3 (MO In-Charge) sort options ---

export const moInChargeSortOptions = [
  ...normalSortOptions,
  { label: 'By MO in charge', comparator: buildComparator([{ field: 'moic', direction: 'ASC' }, ...WARD_BED_NAME]) },
];

// --- List 4 (OP) sort options ---

export const opSortOptions = [
  { label: 'By Slot Date/Time, Priority', comparator: buildComparator([{ field: 'slotDatetime', direction: 'ASC' }, { field: 'priorityValue', direction: 'ASC' }]) },
  { label: 'By Priority, Slot Date/Time', comparator: buildComparator([{ field: 'priorityValue', direction: 'ASC' }, { field: 'slotDatetime', direction: 'ASC' }]) },
  { label: 'By Name', comparator: buildComparator([{ field: 'name', direction: 'ASC' }, { field: 'slotDatetime', direction: 'ASC' }]) },
  { label: 'By Episode', comparator: buildComparator([{ field: 'episode', direction: 'ASC' }, { field: 'slotDatetime', direction: 'ASC' }]) },
  { label: 'By Attend Time', comparator: buildComparator([{ field: 'attendTime', direction: 'ASC' }, { field: 'slotDatetime', direction: 'ASC' }]) },
];

// --- List 5 (User Group) sort options ---

export const userGroupSortOptions = [
  ...normalSortOptions,
  { label: 'By Ward, Bed, Name', comparator: buildComparator(WARD_BED_NAME) },
];

// --- List 6 (Absent) sort options ---

export const absentSortOptions = normalSortOptions;

// --- List 8 (Active MO) sort options ---

export const activeMoSortOptions = [
  ...normalSortOptions,
  { label: 'By Ward, Bed, Specialty', comparator: buildComparator([{ field: 'wardCode', direction: 'ASC' }, { field: 'bed', direction: 'ASC' }, { field: 'specCode', direction: 'ASC' }]) },
];

// --- List 9 (Active Team) sort options ---

export const activeTeamSortOptions = [
  ...normalSortOptions,
  { label: 'By Ward, Bed, Specialty', comparator: buildComparator([{ field: 'wardCode', direction: 'ASC' }, { field: 'bed', direction: 'ASC' }, { field: 'specCode', direction: 'ASC' }]) },
  { label: 'By Team', comparator: buildComparator([{ field: 'teamCode', direction: 'ASC' }, ...WARD_BED_NAME]) },
];
