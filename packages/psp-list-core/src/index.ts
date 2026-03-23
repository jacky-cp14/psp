/**
 * @psp/core — PSP List React Library
 *
 * MUI DataGrid extension: compound components, hooks, and utilities
 * for the dual-grid list layout.
 */

import type { GridRowId } from '@mui/x-data-grid-pro';
import type { SortOption } from './utils/sort-comparators';

export type { GridRowId };

/** UI configuration for a PSP list screen. */
export interface PspListConfig {
  /** Sort options for the context menu */
  sortOptions: SortOption[];
  /** Default sort option index. null = no sort (preserve server order). */
  defaultSortIndex: number | null;
  /** Page size for PGUP/PGDN (default 12, list 3 uses 7) */
  pageSize?: number;
}

// Context
export {
  PspListProvider,
  usePspList,
} from './context/PspListContext';
export type { PspListContextValue } from './context/PspListContext';

// Components
export { PspList } from './components/PspList';
export type { PspListProps } from './components/PspList';
export { DualGrid } from './components/DualGrid';
export type { DualGridProps } from './components/DualGrid';
export { SelectionPanel } from './components/SelectionPanel';
export type { SelectionPanelProps } from './components/SelectionPanel';
export { SortMenu } from './components/SortMenu';
export type { SortMenuProps } from './components/SortMenu';
export { PrintDialog } from './components/PrintDialog';
export type { PrintDialogProps, PrintVariant } from './components/PrintDialog';

// Hooks
export { useSort } from './hooks/useSort';
export type { UseSortReturn } from './hooks/useSort';
export { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
export type { UseKeyboardNavigationConfig } from './hooks/useKeyboardNavigation';
export { usePatientSelection } from './hooks/usePatientSelection';
export type { UsePatientSelectionConfig, UsePatientSelectionReturn } from './hooks/usePatientSelection';

// Utilities
export { buildComparator, buildFieldTypeMap } from './utils/sort-comparators';
export type {
  SortDirection,
  SortFieldType,
  FieldTypeMap,
  SortKey,
  SortOption,
} from './utils/sort-comparators';

// Row styling
export type { RowColorScheme, ResolveColorSchemeInput } from './utils/row-styling';
export { resolveColorScheme, ROW_COLORS } from './utils/row-styling';

// Theme
export { tokens } from './theme/pspTokens';
export { pspTheme } from './theme/pspTheme';
