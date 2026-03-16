import {
  buildComparator,
  normalSortOptions,
  uncodedSortOptions,
  gopcSortOptions,
  opSortOptions,
  activeTeamSortOptions,
} from '../../src/utils/sort-comparators';
import type { BasePatientRecord } from '../../src/types/patient-record';

function makeRecord(overrides: Partial<BasePatientRecord>): BasePatientRecord {
  return { id: '1', ...overrides };
}

describe('sort-comparators', () => {
  describe('buildComparator', () => {
    it('should sort by single field ASC', () => {
      const cmp = buildComparator([{ field: 'name', direction: 'ASC' }]);
      const a = makeRecord({ name: 'Alice' });
      const b = makeRecord({ name: 'Bob' });
      expect(cmp(a, b)).toBeLessThan(0);
      expect(cmp(b, a)).toBeGreaterThan(0);
    });

    it('should sort by single field DESC', () => {
      const cmp = buildComparator([{ field: 'name', direction: 'DESC' }]);
      const a = makeRecord({ name: 'Alice' });
      const b = makeRecord({ name: 'Bob' });
      expect(cmp(a, b)).toBeGreaterThan(0);
    });

    it('should break ties with subsequent fields', () => {
      const cmp = buildComparator([
        { field: 'wardCode', direction: 'ASC' },
        { field: 'bed', direction: 'ASC' },
      ]);
      const a = makeRecord({ wardCode: 'A01', bed: '3' });
      const b = makeRecord({ wardCode: 'A01', bed: '1' });
      expect(cmp(a, b)).toBeGreaterThan(0);
    });

    it('should return 0 for equal records', () => {
      const cmp = buildComparator([{ field: 'name', direction: 'ASC' }]);
      const a = makeRecord({ name: 'Same' });
      const b = makeRecord({ name: 'Same' });
      expect(cmp(a, b)).toBe(0);
    });

    it('should treat missing fields as empty string', () => {
      const cmp = buildComparator([{ field: 'name', direction: 'ASC' }]);
      const a = makeRecord({});
      const b = makeRecord({ name: 'Bob' });
      expect(cmp(a, b)).toBeLessThan(0);
    });
  });

  describe('normalSortOptions (List 0)', () => {
    it('should have 8 sort options', () => {
      expect(normalSortOptions).toHaveLength(8);
    });

    it('should sort by bed then name correctly', () => {
      const bedNameSort = normalSortOptions[1].comparator;
      const records = [
        makeRecord({ bed: '3', name: 'Chan' }),
        makeRecord({ bed: '1', name: 'Wong' }),
        makeRecord({ bed: '1', name: 'Lee' }),
      ];
      const sorted = [...records].sort(bedNameSort);
      expect(sorted[0].bed).toBe('1');
      expect(sorted[0].name).toBe('Lee');
      expect(sorted[1].bed).toBe('1');
      expect(sorted[1].name).toBe('Wong');
      expect(sorted[2].bed).toBe('3');
    });
  });

  describe('uncodedSortOptions (List 1)', () => {
    it('should have 8 sort options', () => {
      expect(uncodedSortOptions).toHaveLength(8);
    });

    it('should sort by discharge date DESC', () => {
      const dischargSort = uncodedSortOptions[2].comparator;
      const records = [
        makeRecord({ id: '1', dischargeDtm: '2024-01-01' } as BasePatientRecord),
        makeRecord({ id: '2', dischargeDtm: '2024-06-15' } as BasePatientRecord),
      ];
      const sorted = [...records].sort(dischargSort);
      expect(sorted[0].id).toBe('2');
    });
  });

  describe('gopcSortOptions (Lists 2, 7)', () => {
    it('should have 4 sort options', () => {
      expect(gopcSortOptions).toHaveLength(4);
    });
  });

  describe('opSortOptions (List 4)', () => {
    it('should have 5 sort options with attend time', () => {
      expect(opSortOptions).toHaveLength(5);
      expect(opSortOptions[4].label).toBe('By Attend Time');
    });
  });

  describe('activeTeamSortOptions (List 9)', () => {
    it('should have 10 sort options with team sort', () => {
      expect(activeTeamSortOptions).toHaveLength(10);
      expect(activeTeamSortOptions[9].label).toBe('By Team');
    });
  });
});
