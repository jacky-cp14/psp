/**
 * @psp/core — PSP Patient List React Library
 *
 * Compound components, hooks, utilities, and types for migrating
 * ExtJS PSP patient list screens to React.
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
  PspParams,
  PspParm,
} from './types/psp-params';
export type {
  PspListConfig,
  SelectionMode,
  FilterState,
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
export { useClientFilter } from './hooks/useClientFilter';
export type { UseClientFilterReturn, FilterPredicate } from './hooks/useClientFilter';
export { useLanguageFrame } from './hooks/useLanguageFrame';
export type { UseLanguageFrameReturn, LangMode, FrameMode } from './hooks/useLanguageFrame';
export { useWardState } from './hooks/useWardState';
export type { UseWardStateReturn } from './hooks/useWardState';
export { useDateRange } from './hooks/useDateRange';
export type { UseDateRangeReturn, DateRangeValidation } from './hooks/useDateRange';
export { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
export type { UseKeyboardNavigationConfig } from './hooks/useKeyboardNavigation';
export { usePatientSelection } from './hooks/usePatientSelection';
export type { UsePatientSelectionConfig, UsePatientSelectionReturn } from './hooks/usePatientSelection';
export { useListData } from './hooks/useListData';
export type { UseListDataConfig, UseListDataReturn } from './hooks/useListData';

// Utilities
export { convertPatientName } from './utils/name-converter';
export { addBracket, htmlEncode, escapeHtmlEntities } from './utils/format-utils';
export {
  parseDateString,
  formatDate,
  diffInDays,
  diffInSeconds,
  diffInMinutes,
} from './utils/date-utils';
export { buildComparator } from './utils/sort-comparators';
export type {
  SortDirection,
  SortFieldType,
  SortKey,
  SortOption,
} from './utils/sort-comparators';

// Row styling
export type { RowColorScheme, ResolveColorSchemeInput } from './utils/row-styling';
export { resolveColorScheme, ROW_COLORS } from './utils/row-styling';

// Theme
export { tokens } from './theme/pspTokens';
export { pspTheme } from './theme/pspTheme';
