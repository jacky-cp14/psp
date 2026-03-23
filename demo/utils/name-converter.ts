/**
 * Patient name conversion — port of psp.utility.pspPatNameConvert.
 * Decodes URI-encoded strings for display. In React, JSX handles escaping.
 */
export function convertPatientName(str: string | null | undefined): string {
  if (str == null || str === '') {
    return '';
  }
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}
