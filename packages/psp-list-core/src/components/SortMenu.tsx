import React, { useState, useCallback } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckIcon from '@mui/icons-material/Check';
import { usePspList } from '../context/PspListContext';

export interface SortMenuProps {
  sortLabels: string[];
}

/**
 * Context menu for sorting, triggered by right-click on the grid area.
 * Reads current sort state from PspListContext.
 */
export function SortMenu({ sortLabels }: SortMenuProps): React.ReactElement {
  const { currentSortIndex, setSortIndex } = usePspList();
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number } | null>(null);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setAnchorPosition({ top: e.clientY, left: e.clientX });
  }, []);

  const handleClose = useCallback(() => {
    setAnchorPosition(null);
  }, []);

  const handleSelect = useCallback(
    (index: number) => {
      setSortIndex(index);
      setAnchorPosition(null);
    },
    [setSortIndex],
  );

  return (
    <>
      <div
        onContextMenu={handleContextMenu}
        data-testid="sort-menu-trigger"
        style={{ display: 'contents' }}
      />
      <Menu
        open={anchorPosition !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition ?? undefined}
      >
        {sortLabels.map((label, index) => (
          <MenuItem
            key={label}
            onClick={() => handleSelect(index)}
            selected={index === currentSortIndex}
          >
            <ListItemIcon>
              {index === currentSortIndex ? <CheckIcon fontSize="small" /> : null}
            </ListItemIcon>
            <ListItemText>{label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
