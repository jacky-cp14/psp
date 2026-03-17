import { renderHook, act } from '@testing-library/react';
import { useDateRange } from '../../src/hooks/useDateRange';

describe('useDateRange', () => {
  it('should initialize with null dates', () => {
    const { result } = renderHook(() => useDateRange({ maxRangeDays: 90 }));
    expect(result.current.from).toBeNull();
    expect(result.current.to).toBeNull();
  });

  it('should fail validation when both dates are null', () => {
    const { result } = renderHook(() => useDateRange({ maxRangeDays: 90 }));
    const validation = result.current.validate();
    expect(validation.valid).toBe(false);
    expect(validation.error).toContain('required');
  });

  it('should set dates via Date objects', () => {
    const { result } = renderHook(() => useDateRange({ maxRangeDays: 90 }));
    const fromDate = new Date(2024, 0, 1);
    const toDate = new Date(2024, 0, 31);

    act(() => {
      result.current.setFrom(fromDate);
      result.current.setTo(toDate);
    });

    expect(result.current.from).toEqual(fromDate);
    expect(result.current.to).toEqual(toDate);
  });

  it('should parse date strings correctly', () => {
    const { result } = renderHook(() => useDateRange({ maxRangeDays: 90 }));

    act(() => {
      result.current.setFromString('01-Jan-2024');
      result.current.setToString('31-Jan-2024');
    });

    expect(result.current.from).not.toBeNull();
    expect(result.current.to).not.toBeNull();
  });

  it('should reject invalid date string format', () => {
    const { result } = renderHook(() => useDateRange({ maxRangeDays: 90 }));

    act(() => {
      result.current.setFromString('2024-01-01');
    });

    expect(result.current.from).toBeNull();
  });

  it('should validate successfully for valid range', () => {
    const { result } = renderHook(() => useDateRange({ maxRangeDays: 90 }));

    act(() => {
      result.current.setFrom(new Date(2024, 0, 1));
      result.current.setTo(new Date(2024, 1, 15));
    });

    const validation = result.current.validate();
    expect(validation.valid).toBe(true);
    expect(validation.error).toBeUndefined();
  });

  it('should fail when from is after to', () => {
    const { result } = renderHook(() => useDateRange({ maxRangeDays: 90 }));

    act(() => {
      result.current.setFrom(new Date(2024, 5, 1));
      result.current.setTo(new Date(2024, 0, 1));
    });

    const validation = result.current.validate();
    expect(validation.valid).toBe(false);
    expect(validation.error).toContain('after');
  });

  it('should fail when range exceeds maxRangeDays', () => {
    const { result } = renderHook(() => useDateRange({ maxRangeDays: 30 }));

    act(() => {
      result.current.setFrom(new Date(2024, 0, 1));
      result.current.setTo(new Date(2024, 5, 1));
    });

    const validation = result.current.validate();
    expect(validation.valid).toBe(false);
    expect(validation.error).toContain('30 days');
  });

  it('should fail when from date is before Sybase minimum (1900-01-01)', () => {
    const { result } = renderHook(() => useDateRange({ maxRangeDays: 90 }));

    act(() => {
      result.current.setFrom(new Date(1899, 11, 31));
      result.current.setTo(new Date(1900, 2, 1));
    });

    const validation = result.current.validate();
    expect(validation.valid).toBe(false);
    expect(validation.error).toContain('before');
  });
});
