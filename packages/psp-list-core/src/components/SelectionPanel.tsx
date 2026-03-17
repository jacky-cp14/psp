import React from 'react';
import Box from '@mui/material/Box';

export interface SelectionPanelProps {
  children: React.ReactNode;
}

/**
 * Styled container for filter/selection fields above the dual grid.
 * No logic — consistent padding, background, and layout.
 */
export function SelectionPanel({ children }: SelectionPanelProps): React.ReactElement {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 1,
        px: 1,
        py: 0.5,
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #ccc',
        minHeight: 40,
      }}
    >
      {children}
    </Box>
  );
}
