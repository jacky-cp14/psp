import { useState, useCallback, useMemo } from 'react';
import type { PatientRecord } from '../types/patient-record';
import type { SortOption } from '../types/list-config';

export interface UseSortReturn<T extends PatientRecord> {
  currentSortIndex: number;
  setSortIndex: (index: number) => void;
  sortRows: (rows: T[]) => T[];
  sortOptions: SortOption<T>[];
}

export function useSort<T extends PatientRecord>(
  options: SortOption<T>[],
  defaultIndex = 0,
): UseSortReturn<T> {
  const [currentSortIndex, setCurrentSortIndex] = useState(defaultIndex);

  const setSortIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < options.length) {
        setCurrentSortIndex(index);
      }
    },
    [options.length],
  );

  const sortRows = useCallback(
    (rows: T[]): T[] => {
      const comparator = options[currentSortIndex]?.comparator;
      if (!comparator) return rows;
      return [...rows].sort(comparator);
    },
    [options, currentSortIndex],
  );

  return useMemo(
    () => ({ currentSortIndex, setSortIndex, sortRows, sortOptions: options }),
    [currentSortIndex, setSortIndex, sortRows, options],
  );
}
