import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
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
    refetch: vi.fn(),
    setSelectedRowId: vi.fn(),
    setSortIndex: vi.fn(),
    setFilterState: vi.fn(),
    toggleLang: vi.fn(),
    toggleFrame: vi.fn(),
    ...overrides,
  };
}

describe('SortMenu', () => {
  const labels = ['By Name', 'By Bed', 'By Date'];

  it('should render trigger element wrapping children', () => {
    const ctx = makeMockContext();
    render(
      <PspListProvider value={ctx}>
        <SortMenu sortLabels={labels}>
          <div data-testid="child-content">Grid goes here</div>
        </SortMenu>
      </PspListProvider>,
    );
    expect(screen.getByTestId('sort-menu-trigger')).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('should open menu on right-click of wrapped content', () => {
    const ctx = makeMockContext();
    render(
      <PspListProvider value={ctx}>
        <SortMenu sortLabels={labels}>
          <div data-testid="child-content">Grid goes here</div>
        </SortMenu>
      </PspListProvider>,
    );

    fireEvent.contextMenu(screen.getByTestId('child-content'));
    expect(screen.getByText('By Name')).toBeInTheDocument();
    expect(screen.getByText('By Bed')).toBeInTheDocument();
    expect(screen.getByText('By Date')).toBeInTheDocument();
  });

  it('should call setSortIndex when option is clicked', () => {
    const setSortIndex = vi.fn();
    const ctx = makeMockContext({ setSortIndex });
    render(
      <PspListProvider value={ctx}>
        <SortMenu sortLabels={labels}>
          <div data-testid="child-content">Grid goes here</div>
        </SortMenu>
      </PspListProvider>,
    );

    fireEvent.contextMenu(screen.getByTestId('child-content'));
    fireEvent.click(screen.getByText('By Bed'));
    expect(setSortIndex).toHaveBeenCalledWith(1);
  });

  it('should show checkmark on the active sort option', () => {
    const ctx = makeMockContext({ currentSortIndex: 2 });
    render(
      <PspListProvider value={ctx}>
        <SortMenu sortLabels={labels}>
          <div>Grid</div>
        </SortMenu>
      </PspListProvider>,
    );

    fireEvent.contextMenu(screen.getByTestId('sort-menu-trigger'));

    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems[2]).toHaveClass('Mui-selected');
    expect(menuItems[0]).not.toHaveClass('Mui-selected');
  });

  it('should render without children (backward compat)', () => {
    const ctx = makeMockContext();
    render(
      <PspListProvider value={ctx}>
        <SortMenu sortLabels={labels} />
      </PspListProvider>,
    );
    expect(screen.getByTestId('sort-menu-trigger')).toBeInTheDocument();
  });
});
