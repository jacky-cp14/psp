/**
 * @psp/core — PSP Patient List React Library
 *
 * MUI DataGrid extension: compound components, hooks, and utilities
 * for the dual-grid patient list layout.
 */

// Types
export type {
  BasePatientRecord,
  NormalPatientRecord,
  UncodedPatientRecord,
  GopcPatientRecord,
  MoInChargePatientRecord,
  OpPatientRecord,
  ActiveTeamPatientRecord,
  PatientRecord,
} from './types/patient-record';
export type {
  PspListConfig,
  SelectionMode,
} from './types/list-config';
export type {
  PspGridColDef,
  GridRowId,
} from './types/grid';

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
