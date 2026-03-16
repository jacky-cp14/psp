/**
 * Date utilities — port of psp.Date.
 * Uses date-fns. Fixes naming bug: original inMins returns seconds, inHours returns minutes.
 */
import { parse, format, differenceInDays, differenceInSeconds, differenceInMinutes } from 'date-fns';

/** Format token map: NNN -> MMM for abbreviated month (Java SimpleDateFormat compat) */
const FORMAT_MAP: Record<string, string> = {
  'NNN': 'MMM',
  'dd': 'dd',
  'yyyy': 'yyyy',
  'HH': 'HH',
  'mm': 'mm',
  'ss': 'ss',
};

function toDateFnsFormat(fmt: string): string {
  let result = fmt;
  for (const [from, to] of Object.entries(FORMAT_MAP)) {
    result = result.replace(new RegExp(from, 'g'), to);
  }
  return result;
}

/**
 * Parses a date string with the given format.
 * Supports dd-MMM-yyyy, dd-NNN-yyyy, HH:mm, etc.
 */
export function parseDateString(
  val: string | null | undefined,
  fmt: string
): Date | null {
  if (val == null || val === '') return null;
  const dateFnsFormat = toDateFnsFormat(fmt);
  try {
    const d = parse(val.trim(), dateFnsFormat, new Date());
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

/**
 * Formats a Date to string using the given format.
 */
export function formatDate(d: Date, fmt: string): string {
  const dateFnsFormat = toDateFnsFormat(fmt);
  return format(d, dateFnsFormat);
}

/**
 * Returns (d2 - d1) in whole days.
 */
export function diffInDays(d1: Date, d2: Date): number {
  return differenceInDays(d2, d1);
}

/**
 * Returns (d2 - d1) in whole seconds.
 * Original psp.date.dateDiff.inMins incorrectly returned seconds — this fixes the name.
 */
export function diffInSeconds(d1: Date, d2: Date): number {
  return Math.floor(differenceInSeconds(d2, d1));
}

/**
 * Returns (d2 - d1) in whole minutes.
 * Original psp.date.dateDiff.inHours incorrectly returned minutes — this fixes the name.
 */
export function diffInMinutes(d1: Date, d2: Date): number {
  return Math.floor(differenceInMinutes(d2, d1));
}
