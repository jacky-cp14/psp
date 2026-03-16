import { renderHook } from '@testing-library/react';
import { useKeyboardNavigation } from '../../src/hooks/useKeyboardNavigation';

function createMockRef(overrides: Partial<HTMLDivElement> = {}) {
  return {
    current: {
      scrollTop: 0,
      clientHeight: 400,
      ...overrides,
    } as HTMLDivElement,
  };
}

function fireKey(
  handleKeyDown: (e: KeyboardEvent) => void,
  key: string,
) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true });
  Object.defineProperty(event, 'preventDefault', { value: jest.fn() });
  handleKeyDown(event);
  return event;
}

describe('useKeyboardNavigation', () => {
  const onSelectionChange = jest.fn();
  const onSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should move selection down on ArrowDown', () => {
    const ref = createMockRef();
    const { result } = renderHook(() =>
      useKeyboardNavigation({
        rowCount: 10,
        selectedIndex: 0,
        onSelectionChange,
        onSubmit,
        scrollContainerRef: ref,
        rowHeight: 30,
      }),
    );

    fireKey(result.current.handleKeyDown, 'ArrowDown');
    expect(onSelectionChange).toHaveBeenCalledWith(1);
  });

  it('should move selection up on ArrowUp', () => {
    const ref = createMockRef();
    const { result } = renderHook(() =>
      useKeyboardNavigation({
        rowCount: 10,
        selectedIndex: 5,
        onSelectionChange,
        onSubmit,
        scrollContainerRef: ref,
        rowHeight: 30,
      }),
    );

    fireKey(result.current.handleKeyDown, 'ArrowUp');
    expect(onSelectionChange).toHaveBeenCalledWith(4);
  });

  it('should clamp at 0 when ArrowUp at first row', () => {
    const ref = createMockRef();
    const { result } = renderHook(() =>
      useKeyboardNavigation({
        rowCount: 10,
        selectedIndex: 0,
        onSelectionChange,
        onSubmit,
        scrollContainerRef: ref,
        rowHeight: 30,
      }),
    );

    fireKey(result.current.handleKeyDown, 'ArrowUp');
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it('should clamp at last row on ArrowDown at end', () => {
    const ref = createMockRef();
    const { result } = renderHook(() =>
      useKeyboardNavigation({
        rowCount: 10,
        selectedIndex: 9,
        onSelectionChange,
        onSubmit,
        scrollContainerRef: ref,
        rowHeight: 30,
      }),
    );

    fireKey(result.current.handleKeyDown, 'ArrowDown');
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it('should jump to first row on Home', () => {
    const ref = createMockRef();
    const { result } = renderHook(() =>
      useKeyboardNavigation({
        rowCount: 10,
        selectedIndex: 5,
        onSelectionChange,
        onSubmit,
        scrollContainerRef: ref,
        rowHeight: 30,
      }),
    );

    fireKey(result.current.handleKeyDown, 'Home');
    expect(onSelectionChange).toHaveBeenCalledWith(0);
  });

  it('should jump to last row on End', () => {
    const ref = createMockRef();
    const { result } = renderHook(() =>
      useKeyboardNavigation({
        rowCount: 10,
        selectedIndex: 0,
        onSelectionChange,
        onSubmit,
        scrollContainerRef: ref,
        rowHeight: 30,
      }),
    );

    fireKey(result.current.handleKeyDown, 'End');
    expect(onSelectionChange).toHaveBeenCalledWith(9);
  });

  it('should page up by pageSize', () => {
    const ref = createMockRef();
    const { result } = renderHook(() =>
      useKeyboardNavigation({
        rowCount: 50,
        selectedIndex: 20,
        onSelectionChange,
        onSubmit,
        pageSize: 12,
        scrollContainerRef: ref,
        rowHeight: 30,
      }),
    );

    fireKey(result.current.handleKeyDown, 'PageUp');
    expect(onSelectionChange).toHaveBeenCalledWith(8);
  });

  it('should page down by pageSize', () => {
    const ref = createMockRef();
    const { result } = renderHook(() =>
      useKeyboardNavigation({
        rowCount: 50,
        selectedIndex: 20,
        onSelectionChange,
        onSubmit,
        pageSize: 12,
        scrollContainerRef: ref,
        rowHeight: 30,
      }),
    );

    fireKey(result.current.handleKeyDown, 'PageDown');
    expect(onSelectionChange).toHaveBeenCalledWith(32);
  });

  it('should call onSubmit on Enter', () => {
    const ref = createMockRef();
    const { result } = renderHook(() =>
      useKeyboardNavigation({
        rowCount: 10,
        selectedIndex: 3,
        onSelectionChange,
        onSubmit,
        scrollContainerRef: ref,
        rowHeight: 30,
      }),
    );

    fireKey(result.current.handleKeyDown, 'Enter');
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it('should do nothing on unhandled keys', () => {
    const ref = createMockRef();
    const { result } = renderHook(() =>
      useKeyboardNavigation({
        rowCount: 10,
        selectedIndex: 0,
        onSelectionChange,
        onSubmit,
        scrollContainerRef: ref,
        rowHeight: 30,
      }),
    );

    fireKey(result.current.handleKeyDown, 'a');
    expect(onSelectionChange).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should do nothing when rowCount is 0', () => {
    const ref = createMockRef();
    const { result } = renderHook(() =>
      useKeyboardNavigation({
        rowCount: 0,
        selectedIndex: 0,
        onSelectionChange,
        onSubmit,
        scrollContainerRef: ref,
        rowHeight: 30,
      }),
    );

    fireKey(result.current.handleKeyDown, 'ArrowDown');
    expect(onSelectionChange).not.toHaveBeenCalled();
  });
});
