import type { SortOption } from '../utils/sort-comparators';

export type { SortOption };

/** Selection mode: coreCheck (standard) or hkidSearch (lists 2, 4, 7) */
export type SelectionMode = 'coreCheck' | 'hkidSearch';

/** Configuration for a PSP list screen */
export interface PspListConfig {
  /** Servlet URL for patient data (e.g. '/psp/cpicaseservlet') */
  servletUrl: string;
  /** Response root key (e.g. 'cpiPatList') */
  dataRoot: string;
  /** Sort options for the context menu */
  sortOptions: SortOption[];
  /** Default sort option index. null = no sort (preserve server order). */
  defaultSortIndex: number | null;
  /** Selection mode — affects empty-episode behavior */
  selectionMode?: SelectionMode;
  /** Page size for PGUP/PGDN (default 12, list 3 uses 7) */
  pageSize?: number;
}

/** Filter state shape — consuming app defines per-list filter keys */
export type FilterState = Record<string, string | number | boolean | null | undefined>;
