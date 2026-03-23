/**
 * All psp_* configuration parameters from cmsPSP.jsp.
 * Used by PspConfigContext to provide runtime config to the library.
 */
export interface PspParams {
  psp_normal_pat_list?: 'english' | 'chinese' | string;
  psp_show_mrn?: 'Y' | 'N';
  psp_alt_rowcolor_option?: 'Y' | 'G' | 'B' | 'NULL';
  psp_non_default_ward_color?: 'Y' | string;
  psp_non_default_ward_alt_color?: 'Y' | string;
  psp_team_non_default_ward_color?: 'Y' | 'NULL';
  psp_row_of_ae_for_uncoded_list?: number;
  psp_day_range_for_op_pat_list?: number;
  psp_day_range_for_gopc_pat_list?: number;
  psp_day_range_for_usergp_pat_list?: number;
  psp_gopc_am_fr?: string;
  psp_gopc_am_to?: string;
  psp_gopc_pm_fr?: string;
  psp_gopc_pm_to?: string;
  psp_gopc_even_fr?: string;
  psp_gopc_even_to?: string;
  psp_gopc_def_spec?: string;
  psp_gopc_def_sub_spec?: string;
  psp_gopc_def_session?: string;
  psp_gopc_def_assm_status?: string;
  psp_gopc_def_consult_status?: string;
  psp_force_logout?: boolean;
  psp_allow_wildcard_for_actteamlist?: 'Y' | string;
  psp_hide_specialist?: 'Y' | string;
  psp_choice_patient_list?: string;
  psp_day_discharged_from_source?: number;
  pspEnableSearch?: boolean;
  psp_from_date_for_op_pat_list?: string;
  psp_doctor_id_sort_seq?: 'id' | 'fullname';
  psp_enable_print?: 'Y' | 'N';
  psp_show_chi_name?: 'Y' | 'N';
}

/** Feature flags from pspParm.js */
export interface PspParm {
  PSP_LIST_COL_SORT?: boolean;
  PSP_LIST_COL_MENU?: boolean;
  NO_OF_PATIENT_LIST?: number;
}
