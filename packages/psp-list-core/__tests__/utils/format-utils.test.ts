import { addBracket, htmlEncode, escapeHtmlEntities } from '../../src/utils/format-utils';

describe('format-utils', () => {
  describe('addBracket', () => {
    it('should wrap last character in parentheses', () => {
      expect(addBracket('AB123C')).toBe('AB123(C)');
      expect(addBracket('A')).toBe('(A)');
    });

    it('should return empty string for null, undefined, or empty', () => {
      expect(addBracket(null)).toBe('');
      expect(addBracket(undefined)).toBe('');
      expect(addBracket('')).toBe('');
    });

    it('should handle single character', () => {
      expect(addBracket('X')).toBe('(X)');
    });

    it('should handle strings without check digit (any last char)', () => {
      expect(addBracket('123')).toBe('12(3)');
    });
  });

  describe('htmlEncode', () => {
    it('should encode special HTML characters as numeric entities', () => {
      const encoded = htmlEncode('<>&"');
      expect(encoded).toContain('&#60;');
      expect(encoded).toContain('&#38;');
      expect(encoded).toContain('&#62;');
      expect(encoded).toContain('&#34;');
    });

    it('should replace plus sign with space (legacy URL decoding)', () => {
      expect(htmlEncode('a+b')).toContain(' ');
    });

    it('should handle printable ASCII 32-126', () => {
      expect(htmlEncode('abc')).toBe('&#97;&#98;&#99;');
    });

    it('should return empty string for empty input', () => {
      expect(htmlEncode('')).toBe('');
    });
  });

  describe('escapeHtmlEntities', () => {
    it('should encode < > & to named entities', () => {
      expect(escapeHtmlEntities('<div>')).toContain('&lt;');
      expect(escapeHtmlEntities('<div>')).toContain('&gt;');
      expect(escapeHtmlEntities('a&b')).toContain('&amp;');
    });

    it('should return null/undefined for null/undefined input', () => {
      expect(escapeHtmlEntities(null)).toBeNull();
      expect(escapeHtmlEntities(undefined)).toBeUndefined();
    });

    it('should return number as-is for number input', () => {
      expect(escapeHtmlEntities(42)).toBe(42);
    });

    it('should replace spaces with nbsp', () => {
      expect(escapeHtmlEntities('a b')).toContain('&nbsp;');
    });
  });
});
