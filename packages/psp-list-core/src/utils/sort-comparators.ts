/**
 * Multi-key sort comparators matching original ExtJS pspList sort menus.
 *
 * Each list has a sort context menu with labeled options. The sort options,
 * their labels, and ordering are preserved from the original for behavioral
 * fidelity during migration.
 */
import type { BasePatientRecord } from '../types/patient-record';

type SortDirection = 'ASC' | 'DESC';
type FieldType = 'string' | 'numeric';

interface SortField {
  field: keyof BasePatientRecord | string;
  direction: SortDirection;
  type?: FieldType;
}

function getField(record: BasePatientRecord, field: string): unknown {
  return (record as unknown as Record<string, unknown>)[field];
}

function compareStrings(a: string, b: string, dir: SortDirection): number {
  const cmp = a.localeCompare(b);
  return dir === 'DESC' ? -cmp : cmp;
}

function compareNumeric(a: unknown, b: unknown, dir: SortDirection): number {
  const na = typeof a === 'number' ? a : Number(a) || 0;
  const nb = typeof b === 'number' ? b : Number(b) || 0;
  const cmp = na - nb;
  return dir === 'DESC' ? -cmp : cmp;
}

/** Builds a comparator from an ordered array of sort field descriptors. */
export function buildComparator(
  fields: SortField[],
): (a: BasePatientRecord, b: BasePatientRecord) => number {
  return (a, b) => {
    for (const { field, direction, type } of fields) {
      const va = getField(a, field);
      const vb = getField(b, field);
      const result = type === 'numeric'
        ? compareNumeric(va, vb, direction)
        : compareStrings(
            typeof va === 'string' ? va : '',
            typeof vb === 'string' ? vb : '',
            direction,
          );
      if (result !== 0) return result;
    }
    return 0;
  };
}

// --- Shared sort field descriptors ---

const WARD_BED_NAME: SortField[] = [
  { field: 'wardCode', direction: 'ASC' },
  { field: 'bed', direction: 'ASC' },
  { field: 'name', direction: 'ASC' },
];

const BED_NAME: SortField[] = [
  { field: 'bed', direction: 'ASC' },
  { field: 'name', direction: 'ASC' },
];

// --- Base 8 sort options shared by inpatient lists (0, 1, 3, 5, 6, 8, 9) ---
// Indices match original ExtJS context menu order.

const baseSortOptions = [
  /* 0 */ { label: 'By Ward,Bed,Name', comparator: buildComparator(WARD_BED_NAME) },
  /* 1 */ { label: 'By Bed,Name', comparator: buildComparator(BED_NAME) },
  /* 2 */ { label: 'By Discharge Date/Time', comparator: buildComparator([{ field: 'dischargeDtm', direction: 'ASC' }]) },
  /* 3 */ { label: 'By Name', comparator: buildComparator([{ field: 'name', direction: 'ASC' }]) },
  /* 4 */ { label: 'By Episode', comparator: buildComparator([{ field: 'caseNo', direction: 'ASC' }]) },
  /* 5 */ { label: 'By Admission Date/Time', comparator: buildComparator([{ field: 'admissionDtm', direction: 'ASC' }]) },
  /* 6 */ { label: 'By Sex,Age', comparator: buildComparator([{ field: 'sex', direction: 'ASC' }, { field: 'age', direction: 'ASC', type: 'numeric' }]) },
  /* 7 */ { label: 'By Ward,Bed,Name', comparator: buildComparator(WARD_BED_NAME) },
];

// --- List 0 (Normal) — 8 options, default index 1 (By Bed,Name) ---

export const normalSortOptions = baseSortOptions;

// --- List 1 (Uncoded) — 8 options, default index 2 (By Discharge Date/Time DESC) ---

export const uncodedSortOptions = baseSortOptions.map((opt, i) =>
  i === 2
    ? { label: opt.label, comparator: buildComparator([{ field: 'dischargeDtm', direction: 'DESC' as SortDirection }]) }
    : opt,
);

// --- Lists 2, 7 (MS GOPC / GOPC) — 4 options, default index 0 ---

export const gopcSortOptions = [
  { label: 'By Slot Date/Time,Priority', comparator: buildComparator([{ field: 'slotDatetime', direction: 'ASC' }, { field: 'priorityValue', direction: 'ASC', type: 'numeric' as FieldType }]) },
  { label: 'By Priority,Slot Date/Time', comparator: buildComparator([{ field: 'priorityValue', direction: 'ASC', type: 'numeric' as FieldType }, { field: 'slotDatetime', direction: 'ASC' }]) },
  { label: 'By Name', comparator: buildComparator([{ field: 'name', direction: 'ASC' }, { field: 'slotDatetime', direction: 'ASC' }]) },
  { label: 'By Episode', comparator: buildComparator([{ field: 'episode', direction: 'ASC' }, { field: 'slotDatetime', direction: 'ASC' }]) },
];

// --- List 3 (MO In-Charge) — 9 options, default index 1 (By Bed,Name) ---

export const moInChargeSortOptions = [
  ...baseSortOptions,
  { label: 'By MO in charge', comparator: buildComparator([{ field: 'moic', direction: 'ASC' }, ...WARD_BED_NAME]) },
];

// --- List 4 (OP) — 5 options, default index 0 ---

export const opSortOptions = [
  { label: 'By Slot Date/Time,Priority', comparator: buildComparator([{ field: 'slotDatetime', direction: 'ASC' }, { field: 'priorityValue', direction: 'ASC', type: 'numeric' as FieldType }]) },
  { label: 'By Priority,Slot Date/Time', comparator: buildComparator([{ field: 'priorityValue', direction: 'ASC', type: 'numeric' as FieldType }, { field: 'slotDatetime', direction: 'ASC' }]) },
  { label: 'By Name', comparator: buildComparator([{ field: 'name', direction: 'ASC' }, { field: 'slotDatetime', direction: 'ASC' }]) },
  { label: 'By Episode', comparator: buildComparator([{ field: 'episode', direction: 'ASC' }, { field: 'slotDatetime', direction: 'ASC' }]) },
  { label: 'By Attend Time', comparator: buildComparator([{ field: 'attendTime', direction: 'ASC' }, { field: 'slotDatetime', direction: 'ASC' }]) },
];

// --- List 5 (User Group) — 9 options, default index 8 ---

export const userGroupSortOptions = [
  ...baseSortOptions,
  { label: 'By Ward,Bed,Name', comparator: buildComparator(WARD_BED_NAME) },
];

// --- List 6 (Absent) — 8 options, default index 0 (By Ward,Bed,Name) ---

export const absentSortOptions = baseSortOptions;

// --- List 8 (Active MO) — 9 options, default index 8 (By Ward,Bed,Specialty) ---

export const activeMoSortOptions = [
  ...baseSortOptions,
  { label: 'By Ward,Bed,Specialty', comparator: buildComparator([{ field: 'wardCode', direction: 'ASC' }, { field: 'bed', direction: 'ASC' }, { field: 'specCode', direction: 'ASC' }]) },
];

// --- List 9 (Active Team) — 10 options, default index 8 (By Ward,Bed,Specialty) ---

export const activeTeamSortOptions = [
  ...baseSortOptions,
  { label: 'By Ward,Bed,Specialty', comparator: buildComparator([{ field: 'wardCode', direction: 'ASC' }, { field: 'bed', direction: 'ASC' }, { field: 'specCode', direction: 'ASC' }]) },
  { label: 'By Team', comparator: buildComparator([{ field: 'teamCode', direction: 'ASC' }, ...WARD_BED_NAME]) },
];
