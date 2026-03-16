import { renderHook, act } from '@testing-library/react';
import { useLanguageFrame } from '../../src/hooks/useLanguageFrame';

describe('useLanguageFrame', () => {
  it('should default to English (0) and Expand (0)', () => {
    const { result } = renderHook(() => useLanguageFrame());
    expect(result.current.langMode).toBe(0);
    expect(result.current.frameMode).toBe(0);
  });

  it('should accept initial values', () => {
    const { result } = renderHook(() => useLanguageFrame(1, 1));
    expect(result.current.langMode).toBe(1);
    expect(result.current.frameMode).toBe(1);
  });

  it('should toggle language mode', () => {
    const { result } = renderHook(() => useLanguageFrame());

    act(() => result.current.toggleLang());
    expect(result.current.langMode).toBe(1);

    act(() => result.current.toggleLang());
    expect(result.current.langMode).toBe(0);
  });

  it('should toggle frame mode', () => {
    const { result } = renderHook(() => useLanguageFrame());

    act(() => result.current.toggleFrame());
    expect(result.current.frameMode).toBe(1);

    act(() => result.current.toggleFrame());
    expect(result.current.frameMode).toBe(0);
  });

  it('should toggle language and frame independently', () => {
    const { result } = renderHook(() => useLanguageFrame());

    act(() => result.current.toggleLang());
    expect(result.current.langMode).toBe(1);
    expect(result.current.frameMode).toBe(0);

    act(() => result.current.toggleFrame());
    expect(result.current.langMode).toBe(1);
    expect(result.current.frameMode).toBe(1);
  });
});
