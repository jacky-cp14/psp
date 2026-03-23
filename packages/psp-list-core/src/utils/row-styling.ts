/**
 * Row color styling for PSP patient lists.
 *
 * DualGrid accepts a single `colorScheme` prop. Consuming apps that have
 * the legacy psp_* config parameters can use `resolveColorScheme()` to
 * map them to a scheme value.
 */
import { tokens } from '../theme/pspTokens';

/**
 * One prop to rule them all.
 *
 * - `'yellow'` / `'gray'` / `'blue'` — alternating row colors
 * - `'ward-highlight'` — non-default ward: yellow bg + red text, all rows same
 * - `'ward-highlight-alt'` — same but alternating two highlight shades
 * - `'none'` — no striping (flat)
 */
export type RowColorScheme =
  | 'yellow'
  | 'gray'
  | 'blue'
  | 'ward-highlight'
  | 'ward-highlight-alt'
  | 'none';

export interface ResolveColorSchemeInput {
  altRowColorOption?: 'Y' | 'G' | 'B' | 'NULL' | string;
  isNonDefaultWard?: boolean;
  nonDefaultWardAltColor?: boolean;
}

/**
 * Maps legacy psp_* config parameters to a single RowColorScheme value.
 *
 * ```tsx
 * const scheme = resolveColorScheme({
 *   altRowColorOption: pspParams.psp_alt_rowcolor_option,
 *   isNonDefaultWard,
 *   nonDefaultWardAltColor: pspParams.psp_non_default_ward_alt_color === 'Y',
 * });
 * <PspList colorScheme={scheme} ... />
 * ```
 */
export function resolveColorScheme(
  input: ResolveColorSchemeInput,
): RowColorScheme {
  if (input.isNonDefaultWard) {
    return input.nonDefaultWardAltColor ? 'ward-highlight-alt' : 'ward-highlight';
  }

  switch (input.altRowColorOption) {
    case 'Y': return 'yellow';
    case 'G': return 'gray';
    case 'B': return 'blue';
    default: return 'none';
  }
}

// --- Internals: CSS class names + colors ---

export const ROW_CLASSES = {
  yellowEven: 'psp-row-yellow',
  yellowOdd: 'psp-row-yellow-alt',
  grayEven: 'psp-row-gray',
  grayOdd: 'psp-row-gray-alt',
  blueEven: 'psp-row-blue',
  blueOdd: 'psp-row-blue-alt',
  ndw: 'psp-row-ndw',
  ndwAlt: 'psp-row-ndw-alt',
} as const;

/** Scheme → [evenClass, oddClass]. Ward-highlight uses the same class for both. */
const SCHEME_CLASSES: Record<Exclude<RowColorScheme, 'none'>, readonly [string, string]> = {
  yellow:               [ROW_CLASSES.yellowEven, ROW_CLASSES.yellowOdd],
  gray:                 [ROW_CLASSES.grayEven,   ROW_CLASSES.grayOdd],
  blue:                 [ROW_CLASSES.blueEven,   ROW_CLASSES.blueOdd],
  'ward-highlight':     [ROW_CLASSES.ndw,        ROW_CLASSES.ndw],
  'ward-highlight-alt': [ROW_CLASSES.ndw,        ROW_CLASSES.ndwAlt],
};

export const ROW_COLORS = {
  yellow: tokens.color.row.yellow,
  gray: tokens.color.row.gray,
  blue: tokens.color.row.blue,
  ndw: { base: tokens.color.row.ndw.base, alt: tokens.color.row.ndw.alt },
} as const;

/** Returns the CSS class for a given row index and color scheme. */
export function getRowClass(index: number, scheme: RowColorScheme | undefined): string {
  if (!scheme || scheme === 'none') return '';
  const [even, odd] = SCHEME_CLASSES[scheme];
  return index % 2 === 0 ? even : odd;
}
