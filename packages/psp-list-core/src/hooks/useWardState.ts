import { useState, useCallback, useMemo } from 'react';

export interface UseWardStateReturn {
  currentWard: string;
  setCurrentWard: (ward: string) => void;
  isNonDefaultWard: boolean;
  checkDefaultWard: () => boolean;
}

/**
 * Tracks selected ward vs. login ward. Non-default ward detection drives
 * row styling and notice display in lists 0, 1, 3, 6, 9.
 */
export function useWardState(config: { defaultWard: string }): UseWardStateReturn {
  const [currentWard, setCurrentWardState] = useState(config.defaultWard);

  const isNonDefaultWard = currentWard !== config.defaultWard;

  const setCurrentWard = useCallback((ward: string) => {
    setCurrentWardState(ward);
  }, []);

  const checkDefaultWard = useCallback(
    () => currentWard === config.defaultWard,
    [currentWard, config.defaultWard],
  );

  return useMemo(
    () => ({ currentWard, setCurrentWard, isNonDefaultWard, checkDefaultWard }),
    [currentWard, setCurrentWard, isNonDefaultWard, checkDefaultWard],
  );
}
