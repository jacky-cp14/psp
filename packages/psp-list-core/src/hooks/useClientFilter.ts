import { useCallback, useMemo } from 'react';
import type { PatientRecord } from '../types/patient-record';

export type FilterPredicate<T extends PatientRecord> = (row: T) => boolean;

export interface UseClientFilterReturn<T extends PatientRecord> {
  filterRows: (rows: T[]) => T[];
  activeFilterCount: number;
}

/**
 * Composable client-side filter using AND logic (all predicates must pass).
 * Mirrors the original ExtJS multiplicative determinant pattern.
 */
export function useClientFilter<T extends PatientRecord>(
  predicates: Array<FilterPredicate<T>>,
): UseClientFilterReturn<T> {
  const activeFilterCount = predicates.length;

  const filterRows = useCallback(
    (rows: T[]): T[] => {
      if (predicates.length === 0) return rows;
      return rows.filter((row) => predicates.every((predicate) => predicate(row)));
    },
    [predicates],
  );

  return useMemo(
    () => ({ filterRows, activeFilterCount }),
    [filterRows, activeFilterCount],
  );
}
