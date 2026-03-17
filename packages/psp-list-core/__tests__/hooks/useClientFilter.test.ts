import { renderHook } from '@testing-library/react';
import { useClientFilter } from '../../src/hooks/useClientFilter';
import type { BasePatientRecord } from '../../src/types/patient-record';

const makeRow = (id: string, name: string, wardCode: string): BasePatientRecord => ({
  id,
  name,
  wardCode,
});

describe('useClientFilter', () => {
  const rows: BasePatientRecord[] = [
    makeRow('1', 'Alice', 'A01'),
    makeRow('2', 'Bob', 'B02'),
    makeRow('3', 'Charlie', 'A01'),
    makeRow('4', 'Dave', 'C03'),
  ];

  it('should return all rows when no predicates given', () => {
    const { result } = renderHook(() => useClientFilter<BasePatientRecord>([]));
    expect(result.current.filterRows(rows)).toHaveLength(4);
    expect(result.current.activeFilterCount).toBe(0);
  });

  it('should filter by single predicate', () => {
    const { result } = renderHook(() =>
      useClientFilter<BasePatientRecord>([(r) => r.wardCode === 'A01']),
    );
    const filtered = result.current.filterRows(rows);
    expect(filtered).toHaveLength(2);
    expect(filtered.every((r) => r.wardCode === 'A01')).toBe(true);
  });

  it('should apply AND logic for multiple predicates', () => {
    const { result } = renderHook(() =>
      useClientFilter<BasePatientRecord>([
        (r) => r.wardCode === 'A01',
        (r) => r.name === 'Alice',
      ]),
    );
    const filtered = result.current.filterRows(rows);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('Alice');
  });

  it('should return empty when no rows match all predicates', () => {
    const { result } = renderHook(() =>
      useClientFilter<BasePatientRecord>([
        (r) => r.wardCode === 'A01',
        (r) => r.name === 'Nobody',
      ]),
    );
    expect(result.current.filterRows(rows)).toHaveLength(0);
  });

  it('should report activeFilterCount', () => {
    const { result } = renderHook(() =>
      useClientFilter<BasePatientRecord>([() => true, () => true, () => true]),
    );
    expect(result.current.activeFilterCount).toBe(3);
  });
});
