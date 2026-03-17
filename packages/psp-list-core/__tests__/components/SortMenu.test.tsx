import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SortMenu } from '../../src/components/SortMenu';
import { PspListProvider } from '../../src/context/PspListContext';
import type { PspListContextValue } from '../../src/context/PspListContext';

function makeMockContext(overrides: Partial<PspListContextValue> = {}): PspListContextValue {
  return {
    rows: [],
    selectedRowId: null,
    currentSortIndex: 0,
    filterState: {},
    langMode: 0,
    frameMode: 0,
    isLoading: false,
    error: null,
    refetch: jest.fn(),
    setSelectedRowId: jest.fn(),
    setSortIndex: jest.fn(),
    setFilterState: jest.fn(),
    toggleLang: jest.fn(),
    toggleFrame: jest.fn(),
    ...overrides,
  };
}

describe('SortMenu', () => {
  const labels = ['By Name', 'By Bed', 'By Date'];

  it('should render trigger element', () => {
    const ctx = makeMockContext();
    render(
      <PspListProvider value={ctx}>
        <SortMenu sortLabels={labels} />
      </PspListProvider>,
    );
    expect(screen.getByTestId('sort-menu-trigger')).toBeInTheDocument();
  });

  it('should open menu on right-click', () => {
    const ctx = makeMockContext();
    render(
      <PspListProvider value={ctx}>
        <SortMenu sortLabels={labels} />
      </PspListProvider>,
    );

    fireEvent.contextMenu(screen.getByTestId('sort-menu-trigger'));
    expect(screen.getByText('By Name')).toBeInTheDocument();
    expect(screen.getByText('By Bed')).toBeInTheDocument();
    expect(screen.getByText('By Date')).toBeInTheDocument();
  });

  it('should call setSortIndex when option is clicked', () => {
    const setSortIndex = jest.fn();
    const ctx = makeMockContext({ setSortIndex });
    render(
      <PspListProvider value={ctx}>
        <SortMenu sortLabels={labels} />
      </PspListProvider>,
    );

    fireEvent.contextMenu(screen.getByTestId('sort-menu-trigger'));
    fireEvent.click(screen.getByText('By Bed'));
    expect(setSortIndex).toHaveBeenCalledWith(1);
  });
});
