import type { SortOption } from '../utils/sort-comparators';

export type { SortOption };

/** Selection mode: coreCheck (standard) or hkidSearch (lists 2, 4, 7) */
export type SelectionMode = 'coreCheck' | 'hkidSearch';

/** UI configuration for a PSP list screen. Data fetching is the consumer's responsibility via useListData. */
export interface PspListConfig {
  /** Sort options for the context menu */
  sortOptions: SortOption[];
  /** Default sort option index. null = no sort (preserve server order). */
  defaultSortIndex: number | null;
  /** Selection mode — affects empty-episode behavior */
  selectionMode?: SelectionMode;
  /** Page size for PGUP/PGDN (default 12, list 3 uses 7) */
  pageSize?: number;
}
