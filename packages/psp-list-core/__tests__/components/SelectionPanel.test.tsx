import React from 'react';
import { render, screen } from '@testing-library/react';
import { SelectionPanel } from '../../src/components/SelectionPanel';

describe('SelectionPanel', () => {
  it('should render children', () => {
    render(
      <SelectionPanel>
        <span data-testid="child">Filter Field</span>
      </SelectionPanel>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Filter Field')).toBeInTheDocument();
  });

  it('should render multiple children', () => {
    render(
      <SelectionPanel>
        <span>Field 1</span>
        <span>Field 2</span>
        <span>Field 3</span>
      </SelectionPanel>,
    );
    expect(screen.getByText('Field 1')).toBeInTheDocument();
    expect(screen.getByText('Field 2')).toBeInTheDocument();
    expect(screen.getByText('Field 3')).toBeInTheDocument();
  });
});
