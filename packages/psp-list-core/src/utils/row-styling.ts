/**
 * Row color styling for PSP patient lists.
 *
 * DualGrid accepts a single `colorScheme` prop. Consuming apps that have
 * the legacy psp_* config parameters can use `resolveColorScheme()` to
 * map them to a scheme value.
 */
import type { SxProps, Theme } from '@mui/material/styles';

/**
 * One prop to rule them all.
 *
 * - `'yellow'` / `'gray'` / `'blue'` — alternating row colors
 * - `'ward-highlight'` — non-default ward: yellow bg + red text, all rows same
 * - `'ward-highlight-alt'` — same but alternating two highlight shades
 * - `undefined` — no striping (flat)
 */
export type RowColorScheme =
  | 'yellow'
  | 'gray'
  | 'blue'
  | 'ward-highlight'
  | 'ward-highlight-alt';

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
 * <PspList.DualGrid colorScheme={scheme} />
 * ```
 */
export function resolveColorScheme(
  input: ResolveColorSchemeInput,
): RowColorScheme | undefined {
  if (input.isNonDefaultWard) {
    return input.nonDefaultWardAltColor ? 'ward-highlight-alt' : 'ward-highlight';
  }

  switch (input.altRowColorOption) {
    case 'Y': return 'yellow';
    case 'G': return 'gray';
    case 'B': return 'blue';
    default: return undefined;
  }
}

// --- Internals: CSS class names + colors ---

const CLS = {
  yellowEven: 'psp-row-yellow',
  yellowOdd: 'psp-row-yellow-alt',
  grayEven: 'psp-row-gray',
  grayOdd: 'psp-row-gray-alt',
  blueEven: 'psp-row-blue',
  blueOdd: 'psp-row-blue-alt',
  ndw: 'psp-row-ndw',
  ndwAlt: 'psp-row-ndw-alt',
} as const;

export { CLS as ROW_CLASSES };

const COLORS = {
  yellow: { even: '#FFF9C4', odd: '#FFFDE7' },
  gray: { even: '#EEEEEE', odd: '#FAFAFA' },
  blue: { even: '#E3F2FD', odd: '#EFF7FF' },
  ndw: { base: '#FFF68F', alt: '#FFFACD' },
} as const;

export { COLORS as ROW_COLORS };

/** Returns the CSS class for a given row index and color scheme. */
export function getRowClass(
  index: number,
  scheme: RowColorScheme | undefined,
): string {
  if (!scheme) return '';

  const isEven = index % 2 === 0;
  switch (scheme) {
    case 'yellow':
      return isEven ? CLS.yellowEven : CLS.yellowOdd;
    case 'gray':
      return isEven ? CLS.grayEven : CLS.grayOdd;
    case 'blue':
      return isEven ? CLS.blueEven : CLS.blueOdd;
    case 'ward-highlight':
      return CLS.ndw;
    case 'ward-highlight-alt':
      return isEven ? CLS.ndw : CLS.ndwAlt;
  }
}

/** MUI sx styles for all row color classes. Applied internally by DualGrid. */
export const rowColorSx: SxProps<Theme> = {
  [`& .${CLS.yellowEven}`]: { backgroundColor: COLORS.yellow.even },
  [`& .${CLS.yellowOdd}`]: { backgroundColor: COLORS.yellow.odd },
  [`& .${CLS.grayEven}`]: { backgroundColor: COLORS.gray.even },
  [`& .${CLS.grayOdd}`]: { backgroundColor: COLORS.gray.odd },
  [`& .${CLS.blueEven}`]: { backgroundColor: COLORS.blue.even },
  [`& .${CLS.blueOdd}`]: { backgroundColor: COLORS.blue.odd },
  [`& .${CLS.ndw}`]: { backgroundColor: COLORS.ndw.base, color: 'red' },
  [`& .${CLS.ndwAlt}`]: { backgroundColor: COLORS.ndw.alt, color: 'red' },
};
