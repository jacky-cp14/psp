import type { GridColDef, GridRowId } from '@mui/x-data-grid-pro';
import type { PatientRecord } from './patient-record';

/** Column config for left or right grid — extends MUI GridColDef */
export type PspGridColDef = GridColDef<PatientRecord>;

export type { GridRowId };
