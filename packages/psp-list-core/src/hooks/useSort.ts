import { useState, useCallback, useMemo } from 'react';
import type { PatientRecord } from '../types/patient-record';
import type { SortOption } from '../types/list-config';
import type { FieldTypeMap } from '../utils/sort-comparators';
import { buildComparator } from '../utils/sort-comparators';

export interface UseSortReturn<T extends PatientRecord> {
  /** Current active sort index, or null when unsorted. */
  currentSortIndex: number | null;
  /** Set the active sort index. Pass null for no sort. */
  setSortIndex: (index: number | null) => void;
  /** Returns a sorted copy of rows (or identity when unsorted). */
  sortRows: (rows: T[]) => T[];
  sortOptions: SortOption[];
}

export function useSort<T extends PatientRecord>(
  options: SortOption[],
  defaultIndex: number | null = 0,
  fieldTypes?: FieldTypeMap,
): UseSortReturn<T> {
  const [currentSortIndex, setCurrentSortIndex] = useState(defaultIndex);

  const setSortIndex = useCallback(
    (index: number | null) => {
      if (index === null || (index >= 0 && index < options.length)) {
        setCurrentSortIndex(index);
      }
    },
    [options.length],
  );

  const comparator = useMemo(() => {
    if (currentSortIndex === null) return null;
    const option = options[currentSortIndex];
    if (!option) return null;
    return buildComparator<T>(option.keys, fieldTypes);
  }, [options, currentSortIndex, fieldTypes]);

  const sortRows = useCallback(
    (rows: T[]): T[] => {
      if (!comparator) return rows;
      return [...rows].sort(comparator);
    },
    [comparator],
  );

  return useMemo(
    () => ({ currentSortIndex, setSortIndex, sortRows, sortOptions: options }),
    [currentSortIndex, setSortIndex, sortRows, options],
  );
}
