import React, { useState, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

export interface PrintVariant {
  label: string;
  value: string;
}

export interface PrintDialogProps {
  open: boolean;
  onClose: () => void;
  onPrint: (variant: string) => void;
  variants?: PrintVariant[];
  title?: string;
}

const DEFAULT_VARIANTS: PrintVariant[] = [
  { label: 'Standard Print', value: 'standard' },
];

/**
 * Print dialog with format selection. List 0 has 4 variants
 * (english/chinese x with/without inline space), others use default.
 */
export function PrintDialog({
  open,
  onClose,
  onPrint,
  variants = DEFAULT_VARIANTS,
  title = 'Print Patient List',
}: PrintDialogProps): React.ReactElement {
  const [selected, setSelected] = useState(variants[0]?.value ?? '');

  const handlePrint = useCallback(() => {
    onPrint(selected);
    onClose();
  }, [selected, onPrint, onClose]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <RadioGroup
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {variants.map((v) => (
            <FormControlLabel
              key={v.value}
              value={v.value}
              control={<Radio />}
              label={v.label}
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handlePrint} variant="contained">
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
}
