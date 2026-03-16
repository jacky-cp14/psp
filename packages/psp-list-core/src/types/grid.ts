import type { GridColDef, GridRowId } from '@mui/x-data-grid-pro';
import type { PatientRecord } from './patient-record';

/** Column config for left or right grid — extends MUI GridColDef */
export type PspGridColDef = GridColDef<PatientRecord>;

/** Params passed to getRowClassName for row styling */
export interface RowClassNameParams {
  row: PatientRecord;
  index: number;
  isNonDefaultWard: boolean;
  altRowColorOption: 'Y' | 'G' | 'B' | 'NULL';
}

export type { GridRowId };
