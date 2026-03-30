/**
 * Singleton event bus for cross-plugin communication via Module Federation.
 *
 * Because `@psp/core` is `singleton: true` in the federation config,
 * the module-scoped `listeners` Set is shared across all plugins.
 */

import { useEffect, useRef } from 'react';

// ── Patient Select ──────────────────────────────────────────────

const listeners = new Set<(patient: unknown) => void>();

/**
 * Subscribe to patient-select events (double-click / Enter on a list row).
 * Ref-stable — no need to wrap `handler` in `useCallback`.
 */
export function usePatientSelectEvent<T = unknown>(
  handler: (patient: T) => void,
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const listener = (patient: unknown) => handlerRef.current(patient as T);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);
}

/** @internal Called by PspList on patient submit. */
export function emitPatientSelect(patient: unknown): void {
  listeners.forEach((fn) => fn(patient));
}
