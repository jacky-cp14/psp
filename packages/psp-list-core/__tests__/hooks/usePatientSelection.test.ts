import { renderHook, act } from '@testing-library/react';
import { usePatientSelection } from '../../src/hooks/usePatientSelection';
import type { BasePatientRecord } from '../../src/types/patient-record';

const rows: BasePatientRecord[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
];

describe('usePatientSelection', () => {
  const onPatientSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with no selection', () => {
    const { result } = renderHook(() =>
      usePatientSelection({ rows, onPatientSelect }),
    );
    expect(result.current.selectedRowId).toBeNull();
    expect(result.current.selectedIndex).toBe(-1);
  });

  it('should set selected row on click', () => {
    const { result } = renderHook(() =>
      usePatientSelection({ rows, onPatientSelect }),
    );

    act(() => result.current.onRowClick('2'));
    expect(result.current.selectedRowId).toBe('2');
    expect(result.current.selectedIndex).toBe(1);
  });

  it('should submit the selected patient', () => {
    const { result } = renderHook(() =>
      usePatientSelection({ rows, onPatientSelect }),
    );

    act(() => result.current.onRowClick('2'));
    act(() => result.current.onPatientSubmit());

    expect(onPatientSelect).toHaveBeenCalledWith(rows[1]);
  });

  it('should not submit when no row is selected', () => {
    const { result } = renderHook(() =>
      usePatientSelection({ rows, onPatientSelect }),
    );

    act(() => result.current.onPatientSubmit());
    expect(onPatientSelect).not.toHaveBeenCalled();
  });

  it('should debounce rapid submit calls', () => {
    const { result } = renderHook(() =>
      usePatientSelection({ rows, onPatientSelect, debounceMs: 1000 }),
    );

    act(() => result.current.onRowClick('1'));
    act(() => result.current.onPatientSubmit());
    act(() => result.current.onPatientSubmit());
    act(() => result.current.onPatientSubmit());

    expect(onPatientSelect).toHaveBeenCalledTimes(1);
  });

  it('should update selectedIndex when rows change', () => {
    const { result, rerender } = renderHook(
      ({ r }) => usePatientSelection({ rows: r, onPatientSelect }),
      { initialProps: { r: rows } },
    );

    act(() => result.current.onRowClick('2'));
    expect(result.current.selectedIndex).toBe(1);

    const newRows: BasePatientRecord[] = [
      { id: '2', name: 'Bob' },
      { id: '3', name: 'Charlie' },
    ];
    rerender({ r: newRows });
    expect(result.current.selectedIndex).toBe(0);
  });

  it('should return -1 when selected row is removed', () => {
    const { result, rerender } = renderHook(
      ({ r }) => usePatientSelection({ rows: r, onPatientSelect }),
      { initialProps: { r: rows } },
    );

    act(() => result.current.onRowClick('1'));
    expect(result.current.selectedIndex).toBe(0);

    const newRows: BasePatientRecord[] = [{ id: '2', name: 'Bob' }];
    rerender({ r: newRows });
    expect(result.current.selectedIndex).toBe(-1);
  });
});
