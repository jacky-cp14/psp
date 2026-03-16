import { useCallback, useRef } from 'react';
import type { RefObject } from 'react';

export interface UseKeyboardNavigationConfig {
  rowCount: number;
  selectedIndex: number;
  onSelectionChange: (index: number) => void;
  onSubmit: () => void;
  pageSize?: number;
  scrollContainerRef: RefObject<HTMLDivElement>;
  rowHeight: number;
  /** Vertical offset (px) from scroll container top to the first data row (e.g. column header height). */
  scrollOffset?: number;
}

/**
 * Keyboard navigation matching original ExtJS behavior:
 * UP/DOWN/HOME/END/PGUP/PGDN change selection, ENTER triggers submit.
 *
 * Uses a ref to track the "live" index so rapid keydowns always read the
 * latest position (instead of waiting for React to re-render and update
 * the closure). React 18 automatic batching coalesces the synchronous
 * setState calls, so only ONE render fires per browser task even when
 * multiple keydowns queue between frames.
 */
export function useKeyboardNavigation(config: UseKeyboardNavigationConfig) {
  const {
    rowCount,
    selectedIndex,
    onSelectionChange,
    onSubmit,
    pageSize = 12,
    scrollContainerRef,
    rowHeight,
    scrollOffset = 0,
  } = config;

  const liveIndexRef = useRef(selectedIndex);
  const navigatingRef = useRef(false);

  if (!navigatingRef.current) {
    liveIndexRef.current = selectedIndex;
  }

  const clamp = (index: number) => Math.max(0, Math.min(rowCount - 1, index));

  const highlightRowVisually = useCallback(
    (index: number) => {
      const container = scrollContainerRef.current;
      if (!container) return;
      container.querySelectorAll('.MuiDataGrid-row.Mui-selected').forEach((el) => {
        el.classList.remove('Mui-selected');
      });
      container.querySelectorAll(`.MuiDataGrid-row[data-rowindex="${index}"]`).forEach((el) => {
        el.classList.add('Mui-selected');
      });
    },
    [scrollContainerRef],
  );

  const scrollToIndex = useCallback(
    (index: number) => {
      const container = scrollContainerRef.current;
      if (!container) return;
      const targetTop = scrollOffset + index * rowHeight;
      const targetBottom = targetTop + rowHeight;
      if (targetTop < container.scrollTop) {
        container.scrollTop = targetTop;
      } else if (targetBottom > container.scrollTop + container.clientHeight) {
        container.scrollTop = targetBottom - container.clientHeight;
      }
    },
    [scrollContainerRef, rowHeight, scrollOffset],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent | KeyboardEvent) => {
      if (rowCount === 0) return;

      const currentIndex = liveIndexRef.current;
      let nextIndex = currentIndex;

      switch (e.key) {
        case 'ArrowUp':
          nextIndex = clamp(currentIndex - 1);
          e.preventDefault();
          break;
        case 'ArrowDown':
          nextIndex = clamp(currentIndex + 1);
          e.preventDefault();
          break;
        case 'Home':
          nextIndex = 0;
          e.preventDefault();
          break;
        case 'End':
          nextIndex = rowCount - 1;
          e.preventDefault();
          break;
        case 'PageUp':
          nextIndex = clamp(currentIndex - pageSize);
          e.preventDefault();
          break;
        case 'PageDown':
          nextIndex = clamp(currentIndex + pageSize);
          e.preventDefault();
          break;
        case 'Enter':
          onSubmit();
          e.preventDefault();
          return;
        default:
          return;
      }

      if (nextIndex !== currentIndex) {
        liveIndexRef.current = nextIndex;
        navigatingRef.current = true;
        highlightRowVisually(nextIndex);
        scrollToIndex(nextIndex);
        onSelectionChange(nextIndex);
        navigatingRef.current = false;
      }
    },
    [rowCount, pageSize, onSubmit, highlightRowVisually, scrollToIndex, onSelectionChange],
  );

  return { handleKeyDown };
}
