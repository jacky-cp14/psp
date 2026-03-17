import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { PrintDialog } from '../../src/components/PrintDialog';
import type { PrintVariant } from '../../src/components/PrintDialog';

describe('PrintDialog', () => {
  const onClose = vi.fn();
  const onPrint = vi.fn();
  const variants: PrintVariant[] = [
    { label: 'English', value: 'en' },
    { label: 'Chinese', value: 'zh' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with title and variants when open', () => {
    render(
      <PrintDialog
        open={true}
        onClose={onClose}
        onPrint={onPrint}
        variants={variants}
        title="Test Print"
      />,
    );
    expect(screen.getByText('Test Print')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Chinese')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(
      <PrintDialog open={false} onClose={onClose} onPrint={onPrint} variants={variants} />,
    );
    expect(screen.queryByText('English')).not.toBeInTheDocument();
  });

  it('should call onPrint with selected variant on Print click', () => {
    render(
      <PrintDialog open={true} onClose={onClose} onPrint={onPrint} variants={variants} />,
    );

    fireEvent.click(screen.getByLabelText('Chinese'));
    fireEvent.click(screen.getByText('Print'));

    expect(onPrint).toHaveBeenCalledWith('zh');
    expect(onClose).toHaveBeenCalled();
  });

  it('should call onClose on Cancel click', () => {
    render(
      <PrintDialog open={true} onClose={onClose} onPrint={onPrint} variants={variants} />,
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('should use default variant when none provided', () => {
    render(
      <PrintDialog open={true} onClose={onClose} onPrint={onPrint} />,
    );
    expect(screen.getByText('Standard Print')).toBeInTheDocument();
  });
});
