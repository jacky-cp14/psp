import type { GridColDef } from '@mui/x-data-grid-pro';

export type SortDirection = 'ASC' | 'DESC';

/** Built-in comparison presets. */
export type SortComparePreset = 'string' | 'numeric' | 'dateTime';

/**
 * How to compare two raw field values.
 *
 * - `'string'`   — locale string compare (default)
 * - `'numeric'`  — coerce to number, NaN → 0
 * - `'dateTime'` — parse ISO-ish string to timestamp (handles `'Y-m-d H:i:s.u'`)
 * - `(a, b) => number` — custom comparator for non-standard values
 *   (direction is still applied automatically)
 */
export type SortCompare = SortComparePreset | ((a: unknown, b: unknown) => number);

/** Maps field names to their comparison strategy. */
export type FieldCompareMap = Record<string, SortCompare>;

export interface SortKey {
  field: string;
  direction: SortDirection;
  /** Comparison override. Resolved from column type when omitted. */
  compare?: SortCompare;
}

export interface SortOption {
  label: string;
  keys: SortKey[];
}

// ---------------------------------------------------------------------------
// Value projections
// ---------------------------------------------------------------------------

function toStr(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function toNum(v: unknown): number {
  if (typeof v === 'number') return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function toTimestamp(v: unknown): number {
  if (v instanceof Date) {
    const t = v.getTime();
    return Number.isFinite(t) ? t : 0;
  }
  if (typeof v === 'string' && v !== '') {
    const t = Date.parse(v.replace(' ', 'T'));
    return Number.isFinite(t) ? t : 0;
  }
  return 0;
}

// ---------------------------------------------------------------------------
// Core compare
// ---------------------------------------------------------------------------

function cmpNum(a: number, b: number): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function compareValues(
  a: unknown,
  b: unknown,
  compare: SortCompare = 'string',
): number {
  if (typeof compare === 'function') return compare(a, b);
  switch (compare) {
    case 'numeric':
      return cmpNum(toNum(a), toNum(b));
    case 'dateTime':
      return cmpNum(toTimestamp(a), toTimestamp(b));
    default:
      return toStr(a).localeCompare(toStr(b));
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Builds a `FieldCompareMap` from MUI column definitions.
 *
 * Maps `GridColDef.type` to a `SortComparePreset`:
 * - `'number'`               → `'numeric'`
 * - `'date'` / `'dateTime'`  → `'dateTime'`
 * - everything else is omitted (defaults to `'string'`)
 */
export function buildFieldCompareMap(columns: GridColDef[]): Record<string, SortComparePreset> {
  const map: Record<string, SortComparePreset> = {};
  for (const col of columns) {
    if (col.type === 'number') map[col.field] = 'numeric';
    else if (col.type === 'date' || col.type === 'dateTime') map[col.field] = 'dateTime';
  }
  return map;
}

/**
 * Creates a multi-key comparator for `Array.prototype.sort`.
 *
 * Keys are evaluated in priority order: the first key whose values differ
 * decides the outcome. Each key specifies a `field` to read from the object,
 * a `direction` (`ASC` | `DESC`), and an optional `compare` — either a preset
 * (`'string'`, `'numeric'`, `'dateTime'`) or a custom `(a, b) => number`
 * comparator for non-standard values.
 *
 * Compare resolution per key: `key.compare` > `fieldCompares[key.field]` > `'string'`.
 *
 * @example
 * const cmp = buildComparator([
 *   { field: 'priority', direction: 'ASC', compare: 'numeric' },
 *   { field: 'name',     direction: 'ASC' },
 *   { field: 'sexAge',   direction: 'ASC', compare: (a, b) => { ... } },
 * ]);
 */
export function buildComparator<T = Record<string, unknown>>(
  keys: SortKey[],
  fieldCompares?: FieldCompareMap,
): (a: T, b: T) => number {
  return (a, b) => {
    for (const { field, direction, compare } of keys) {
      const resolved = compare ?? fieldCompares?.[field] ?? 'string';
      const va = (a as Record<string, unknown>)[field];
      const vb = (b as Record<string, unknown>)[field];
      const cmp = compareValues(va, vb, resolved);
      if (cmp !== 0) return direction === 'DESC' ? -cmp : cmp;
    }
    return 0;
  };
}
