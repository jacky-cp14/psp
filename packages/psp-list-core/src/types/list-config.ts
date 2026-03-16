import type { PatientRecord } from './patient-record';
import type { PspGridColDef } from './grid';

/** Single sort option: label + comparator function */
export interface SortOption<T extends PatientRecord = PatientRecord> {
  label: string;
  comparator: (a: T, b: T) => number;
}

/** Selection mode: coreCheck (standard) or hkidSearch (lists 2, 4, 7) */
export type SelectionMode = 'coreCheck' | 'hkidSearch';

/** Configuration for a PSP list screen */
export interface PspListConfig<T extends PatientRecord = PatientRecord> {
  /** Servlet URL for patient data (e.g. '/psp/cpicaseservlet') */
  servletUrl: string;
  /** Response root key (e.g. 'cpiPatList') */
  dataRoot: string;
  /** Sort options for the context menu */
  sortOptions: SortOption<T>[];
  /** Default sort option index (0-based) */
  defaultSortIndex: number;
  /** Selection mode — affects empty-episode behavior */
  selectionMode?: SelectionMode;
  /** Page size for PGUP/PGDN (default 12, list 3 uses 7) */
  pageSize?: number;
}

/** Filter state shape — consuming app defines per-list filter keys */
export type FilterState = Record<string, string | number | boolean | null | undefined>;
