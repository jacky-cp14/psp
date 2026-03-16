import { renderHook, act } from '@testing-library/react';
import { useWardState } from '../../src/hooks/useWardState';

describe('useWardState', () => {
  it('should initialize with the default ward', () => {
    const { result } = renderHook(() => useWardState({ defaultWard: 'WARD_A' }));
    expect(result.current.currentWard).toBe('WARD_A');
    expect(result.current.isNonDefaultWard).toBe(false);
  });

  it('should detect non-default ward after change', () => {
    const { result } = renderHook(() => useWardState({ defaultWard: 'WARD_A' }));

    act(() => result.current.setCurrentWard('WARD_B'));
    expect(result.current.currentWard).toBe('WARD_B');
    expect(result.current.isNonDefaultWard).toBe(true);
  });

  it('should detect default ward when changed back', () => {
    const { result } = renderHook(() => useWardState({ defaultWard: 'WARD_A' }));

    act(() => result.current.setCurrentWard('WARD_B'));
    expect(result.current.isNonDefaultWard).toBe(true);

    act(() => result.current.setCurrentWard('WARD_A'));
    expect(result.current.isNonDefaultWard).toBe(false);
  });

  it('should check default ward correctly', () => {
    const { result } = renderHook(() => useWardState({ defaultWard: 'WARD_A' }));

    expect(result.current.checkDefaultWard()).toBe(true);

    act(() => result.current.setCurrentWard('WARD_B'));
    expect(result.current.checkDefaultWard()).toBe(false);
  });
});
