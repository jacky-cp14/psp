import { renderHook, act } from '@testing-library/react';
import { useSort } from '../../src/hooks/useSort';
import type { BasePatientRecord } from '../../src/types/patient-record';
import type { SortOption } from '../../src/types/list-config';

const makeRow = (id: string, name: string, bed: string): BasePatientRecord => ({
  id,
  name,
  bed,
});

const options: SortOption<BasePatientRecord>[] = [
  { label: 'By Name', comparator: (a, b) => (a.name ?? '').localeCompare(b.name ?? '') },
  { label: 'By Bed', comparator: (a, b) => (a.bed ?? '').localeCompare(b.bed ?? '') },
];

describe('useSort', () => {
  it('should initialize with the default sort index', () => {
    const { result } = renderHook(() => useSort(options, 1));
    expect(result.current.currentSortIndex).toBe(1);
  });

  it('should default to index 0 when no default provided', () => {
    const { result } = renderHook(() => useSort(options));
    expect(result.current.currentSortIndex).toBe(0);
  });

  it('should sort rows using the current comparator', () => {
    const rows = [makeRow('1', 'Charlie', '3'), makeRow('2', 'Alice', '1'), makeRow('3', 'Bob', '2')];
    const { result } = renderHook(() => useSort(options, 0));

    const sorted = result.current.sortRows(rows);
    expect(sorted.map((r) => r.name)).toEqual(['Alice', 'Bob', 'Charlie']);
  });

  it('should change sort when setSortIndex is called', () => {
    const rows = [makeRow('1', 'Charlie', '3'), makeRow('2', 'Alice', '1')];
    const { result } = renderHook(() => useSort(options, 0));

    act(() => result.current.setSortIndex(1));
    expect(result.current.currentSortIndex).toBe(1);

    const sorted = result.current.sortRows(rows);
    expect(sorted.map((r) => r.bed)).toEqual(['1', '3']);
  });

  it('should ignore out-of-range sort index', () => {
    const { result } = renderHook(() => useSort(options, 0));

    act(() => result.current.setSortIndex(99));
    expect(result.current.currentSortIndex).toBe(0);

    act(() => result.current.setSortIndex(-1));
    expect(result.current.currentSortIndex).toBe(0);
  });

  it('should not mutate the original array', () => {
    const rows = [makeRow('1', 'Charlie', '3'), makeRow('2', 'Alice', '1')];
    const original = [...rows];
    const { result } = renderHook(() => useSort(options, 0));

    result.current.sortRows(rows);
    expect(rows).toEqual(original);
  });

  it('should expose sortOptions', () => {
    const { result } = renderHook(() => useSort(options));
    expect(result.current.sortOptions).toHaveLength(2);
    expect(result.current.sortOptions[0].label).toBe('By Name');
  });
});
