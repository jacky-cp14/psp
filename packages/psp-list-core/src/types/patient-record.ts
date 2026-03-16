/**
 * Base patient record fields shared across all PSP lists.
 * Per-list extensions add list-specific fields.
 */
export interface BasePatientRecord {
  /** Unique row identifier for DataGrid (typically patientKey or composite) */
  id: string;
  bed?: string;
  name?: string;
  chineseName?: string;
  big5ChiNameImg?: string;
  episode?: string;
  specCode?: string;
  specDesc?: string;
  admissionDtm?: string;
  sexAge?: string;
  sourceCode?: string;
  hkid?: string;
  accessCode?: number;
  wardCode?: string;
  patientKey?: string;
  caseNo?: string;
  caseType?: string;
  sex?: string;
  age?: number;
  deathInd?: string;
  deathDate?: string;
  confidentialVal?: string;
  sourceHospital?: string;
}

/** List 0 (Normal), 3 (MO In-Charge), 6 (Absent), 8 (Active MO) */
export interface NormalPatientRecord extends BasePatientRecord {
  mrn?: string;
}

/** List 1 (Uncoded) — has dischargeDtm, no mrn/caseType */
export interface UncodedPatientRecord extends BasePatientRecord {
  dischargeDtm?: string;
}

/** List 2 (MS GOPC), 7 (GOPC) — appointment fields */
export interface GopcPatientRecord extends BasePatientRecord {
  slotDatetime?: string;
  priority?: string;
  priorityValue?: number;
  assmt?: string;
  consult?: string;
  apptType?: string;
  attendStatus?: string;
  attendTime?: string;
  episode?: string;
  bookDatetime?: string;
  subSpec?: string;
  apptSeq?: string;
  opasPayCode?: string;
  opasPayFlag?: string;
  patientGenericStatus?: string;
  mrn?: string;
}

/** List 3 (MO In-Charge) */
export interface MoInChargePatientRecord extends NormalPatientRecord {
  moic?: string;
}

/** List 4 (OP) — OP-specific fields */
export interface OpPatientRecord extends GopcPatientRecord {
  type?: string;
  prIndicator?: string;
}

/** List 9 (Active Team) — dual composite columns */
export interface ActiveTeamPatientRecord extends BasePatientRecord {
  apptInfo1?: string;
  apptInfo2?: string;
  wardCode2?: string;
  wardCode2Disp?: string;
  teamCode?: string;
  teamCode2?: string;
  specIC?: string;
}

/** Union type for all list record variants */
export type PatientRecord =
  | BasePatientRecord
  | NormalPatientRecord
  | UncodedPatientRecord
  | GopcPatientRecord
  | MoInChargePatientRecord
  | OpPatientRecord
  | ActiveTeamPatientRecord;
