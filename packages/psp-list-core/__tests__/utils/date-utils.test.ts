import {
  parseDateString,
  formatDate,
  diffInDays,
  diffInSeconds,
  diffInMinutes,
} from '../../src/utils/date-utils';

describe('date-utils', () => {
  describe('parseDateString', () => {
    it('should parse dd-MMM-yyyy format', () => {
      const d = parseDateString('15-Jan-2024', 'dd-MMM-yyyy');
      expect(d).not.toBeNull();
      expect(d?.getFullYear()).toBe(2024);
      expect(d?.getMonth()).toBe(0);
      expect(d?.getDate()).toBe(15);
    });

    it('should parse dd-NNN-yyyy (NNN = abbreviated month)', () => {
      const d = parseDateString('01-Dec-2023', 'dd-NNN-yyyy');
      expect(d).not.toBeNull();
      expect(d?.getFullYear()).toBe(2023);
      expect(d?.getMonth()).toBe(11);
      expect(d?.getDate()).toBe(1);
    });

    it('should parse HH:mm format', () => {
      const d = parseDateString('14:30', 'HH:mm');
      expect(d).not.toBeNull();
      expect(d?.getHours()).toBe(14);
      expect(d?.getMinutes()).toBe(30);
    });

    it('should return null for invalid input', () => {
      expect(parseDateString('invalid', 'dd-MMM-yyyy')).toBeNull();
      expect(parseDateString('', 'dd-MMM-yyyy')).toBeNull();
    });
  });

  describe('formatDate', () => {
    it('should format as dd-MMM-yyyy', () => {
      const d = new Date(2024, 0, 15);
      expect(formatDate(d, 'dd-MMM-yyyy')).toMatch(/15-Jan-2024/);
    });
  });

  describe('diffInDays', () => {
    it('should return difference in days', () => {
      const d1 = new Date(2024, 0, 1);
      const d2 = new Date(2024, 0, 11);
      expect(diffInDays(d1, d2)).toBe(10);
    });

    it('should return negative when d2 is before d1', () => {
      const d1 = new Date(2024, 0, 15);
      const d2 = new Date(2024, 0, 5);
      expect(diffInDays(d1, d2)).toBe(-10);
    });
  });

  describe('diffInSeconds', () => {
    it('should return difference in seconds (original inMins was misnamed)', () => {
      const d1 = new Date(2024, 0, 1, 10, 0, 0);
      const d2 = new Date(2024, 0, 1, 10, 0, 30);
      expect(diffInSeconds(d1, d2)).toBe(30);
    });
  });

  describe('diffInMinutes', () => {
    it('should return difference in minutes (original inHours was misnamed)', () => {
      const d1 = new Date(2024, 0, 1, 10, 0, 0);
      const d2 = new Date(2024, 0, 1, 10, 45, 0);
      expect(diffInMinutes(d1, d2)).toBe(45);
    });
  });
});
