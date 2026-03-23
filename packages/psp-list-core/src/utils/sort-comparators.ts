export type SortDirection = 'ASC' | 'DESC';

/**
 * How to project a raw field value into something comparable.
 * - 'string'  — locale string compare (default)
 * - 'numeric' — coerce to number, NaN → 0
 * - 'date'    — parse ISO-ish string to timestamp (handles 'Y-m-d H:i:s.u')
 */
export type SortFieldType = 'string' | 'numeric' | 'date';

export interface SortKey {
  field: string;
  direction: SortDirection;
  /** Value projection. Default: 'string'. */
  type?: SortFieldType;
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
  type: SortFieldType = 'string',
): number {
  switch (type) {
    case 'numeric':
      return cmpNum(toNum(a), toNum(b));
    case 'date':
      return cmpNum(toTimestamp(a), toTimestamp(b));
    default:
      return toStr(a).localeCompare(toStr(b));
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Creates a multi-key comparator for `Array.prototype.sort`.
 *
 * Keys are evaluated in priority order: the first key whose values differ
 * decides the outcome. Each key specifies a `field` to read from the object,
 * a `direction` (`ASC` | `DESC`), and an optional `type` that controls value
 * projection (`'string'` locale compare, `'numeric'`, or `'date'` timestamp).
 * Returns `0` when all keys compare equal, preserving relative order.
 *
 * @example
 * const cmp = buildComparator([
 *   { field: 'priority', direction: 'ASC', type: 'numeric' },
 *   { field: 'name',     direction: 'ASC' },
 * ]);
 * rows.sort(cmp); // primary: priority ↑, tiebreaker: name A-Z
 */
export function buildComparator<T = Record<string, unknown>>(
  keys: SortKey[],
): (a: T, b: T) => number {
  return (a, b) => {
    for (const { field, direction, type } of keys) {
      const va = (a as Record<string, unknown>)[field];
      const vb = (b as Record<string, unknown>)[field];
      const cmp = compareValues(va, vb, type);
      if (cmp !== 0) return direction === 'DESC' ? -cmp : cmp;
    }
    return 0;
  };
}
