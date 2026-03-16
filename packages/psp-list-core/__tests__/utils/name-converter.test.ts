import { convertPatientName } from '../../src/utils/name-converter';

describe('name-converter', () => {
  describe('convertPatientName', () => {
    it('should decode URI-encoded strings', () => {
      expect(convertPatientName('Chan%20Tai%20Man')).toBe('Chan Tai Man');
      expect(convertPatientName('%E9%99%B3%E5%A4%A7%E6%96%87')).toBe('陳大文');
    });

    it('should return empty string for null or undefined', () => {
      expect(convertPatientName(null)).toBe('');
      expect(convertPatientName(undefined)).toBe('');
    });

    it('should return empty string for empty string', () => {
      expect(convertPatientName('')).toBe('');
    });

    it('should return original string on decode failure', () => {
      expect(convertPatientName('invalid%')).toBe('invalid%');
    });

    it('should handle already-decoded strings', () => {
      expect(convertPatientName('John Doe')).toBe('John Doe');
    });
  });
});
