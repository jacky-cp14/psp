/**
 * @psp/core — PSP List React Library
 *
 * MUI DataGrid extension: compound components, hooks, and utilities
 * for the dual-grid list layout.
 *
 * This package is designed to run as a Module Federation singleton.
 * The Zustand global store (usePspGlobal) is created at module scope,
 * so every plugin sharing this package instance shares the same store.
 */

// Components
export { PspList } from './components/PspList';
export type { PspListProps } from './components/PspList';
export { SelectionPanel } from './components/SelectionPanel';
export type { SelectionPanelProps } from './components/SelectionPanel';
export { PrintDialog } from './components/PrintDialog';
export type { PrintDialogProps, PrintVariant } from './components/PrintDialog';

// Global store (singleton across all federated plugins)
export { usePspGlobal } from './store';
export type {
  PspGlobalStore,
  PspGlobalState,
  PspGlobalActions,
  LangMode,
  FrameMode,
} from './store';

// Sort preset types
export type {
  SortOption,
  SortKey,
  SortDirection,
  SortComparePreset,
  SortCompare,
} from './utils/sort-comparators';
