/**
 * Format utilities — ports of psp.utility functions.
 */

/** Formats "AB123C" → "AB123(C)". Used for HKID/Episode display. */
export function addBracket(s: string | null | undefined): string {
  if (s != null && s !== 'undefined' && s.length !== 0) {
    return s.substring(0, s.length - 1) + '(' + s.substring(s.length - 1, s.length) + ')';
  }
  return '';
}

/**
 * HTML-encodes printable ASCII (32-126) as numeric entities.
 * Replaces + with space (legacy URL decoding behavior).
 */
export function htmlEncode(str: string): string {
  if (!str) return '';
  const result: string[] = [];
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code >= 32 && code <= 126) {
      result.push('&#' + code + ';');
    } else {
      result.push(str[i]);
    }
  }
  return result.join('').replace(/&#43;/g, ' ');
}

/** Named entity map for common characters (subset of original htmlEntityTable) */
const HTML_ENTITY_MAP: Record<number, string> = {
  34: 'quot',
  38: 'amp',
  39: 'apos',
  60: 'lt',
  62: 'gt',
  160: 'nbsp',
};

/**
 * Converts special characters to HTML entities.
 * Port of psp.utility.escapeHtmlEntities.
 */
export function escapeHtmlEntities(
  text: string | null | undefined | number
): string | null | undefined | number {
  if (text == null || typeof text === 'number') {
    return text;
  }
  if (typeof text !== 'string') {
    return text;
  }
  return text
    .replace(/[\u00A0-\u2666<>&]/g, (c) => {
      const code = c.charCodeAt(0);
      const entity = HTML_ENTITY_MAP[code] ?? '#' + code;
      return '&' + entity + ';';
    })
    .replace(/\s/g, '&nbsp;');
}
