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
  if (v instanceof Date) return v.getTime();
  if (typeof v === 'string' && v !== '') {
    const t = Date.parse(v.replace(' ', 'T'));
    return Number.isFinite(t) ? t : 0;
  }
  return 0;
}

// ---------------------------------------------------------------------------
// Core compare
// ---------------------------------------------------------------------------

function compareValues(
  a: unknown,
  b: unknown,
  type: SortFieldType = 'string',
): number {
  switch (type) {
    case 'numeric':
      return toNum(a) - toNum(b);
    case 'date':
      return toTimestamp(a) - toTimestamp(b);
    default:
      return toStr(a).localeCompare(toStr(b));
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Builds a comparator from an ordered array of sort key descriptors. */
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
