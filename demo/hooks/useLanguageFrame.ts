import { useState, useCallback, useMemo } from 'react';

export type LangMode = 0 | 1;
export type FrameMode = 0 | 1;

export interface UseLanguageFrameReturn {
  langMode: LangMode;
  frameMode: FrameMode;
  toggleLang: () => void;
  toggleFrame: () => void;
}

/**
 * Manages language (English=0 / Chinese=1) and frame (Expand=0 / Reduce=1)
 * toggles that drive column visibility and grid width.
 */
export function useLanguageFrame(
  initialLang: LangMode = 0,
  initialFrame: FrameMode = 0,
): UseLanguageFrameReturn {
  const [langMode, setLangMode] = useState<LangMode>(initialLang);
  const [frameMode, setFrameMode] = useState<FrameMode>(initialFrame);

  const toggleLang = useCallback(() => {
    setLangMode((prev) => (prev === 0 ? 1 : 0));
  }, []);

  const toggleFrame = useCallback(() => {
    setFrameMode((prev) => (prev === 0 ? 1 : 0));
  }, []);

  return useMemo(
    () => ({ langMode, frameMode, toggleLang, toggleFrame }),
    [langMode, frameMode, toggleLang, toggleFrame],
  );
}
