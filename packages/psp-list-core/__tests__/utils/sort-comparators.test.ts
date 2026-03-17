import {
  buildComparator,
  normalSortOptions,
  uncodedSortOptions,
  gopcSortOptions,
  moInChargeSortOptions,
  opSortOptions,
  userGroupSortOptions,
  absentSortOptions,
  activeMoSortOptions,
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

    it('should sort numerically when type is numeric', () => {
      const cmp = buildComparator([{ field: 'age', direction: 'ASC', type: 'numeric' }]);
      const a = makeRecord({ age: 9 });
      const b = makeRecord({ age: 10 });
      expect(cmp(a, b)).toBeLessThan(0);
    });

    it('should sort numeric DESC', () => {
      const cmp = buildComparator([{ field: 'age', direction: 'DESC', type: 'numeric' }]);
      const a = makeRecord({ age: 20 });
      const b = makeRecord({ age: 50 });
      expect(cmp(a, b)).toBeGreaterThan(0);
    });

    it('should handle missing numeric fields as 0', () => {
      const cmp = buildComparator([{ field: 'age', direction: 'ASC', type: 'numeric' }]);
      const a = makeRecord({});
      const b = makeRecord({ age: 5 });
      expect(cmp(a, b)).toBeLessThan(0);
    });
  });

  describe('normalSortOptions (List 0)', () => {
    it('should have 8 sort options matching original ExtJS menu', () => {
      expect(normalSortOptions).toHaveLength(8);
      expect(normalSortOptions[0].label).toBe('By Ward,Bed,Name');
      expect(normalSortOptions[1].label).toBe('By Bed,Name');
      expect(normalSortOptions[2].label).toBe('By Discharge Date/Time');
      expect(normalSortOptions[3].label).toBe('By Name');
      expect(normalSortOptions[4].label).toBe('By Episode');
      expect(normalSortOptions[5].label).toBe('By Admission Date/Time');
      expect(normalSortOptions[6].label).toBe('By Sex,Age');
      expect(normalSortOptions[7].label).toBe('By Ward,Bed,Name');
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

    it('should sort by sex then age numerically', () => {
      const sexAgeSort = normalSortOptions[6].comparator;
      const records = [
        makeRecord({ sex: 'M', age: 30 }),
        makeRecord({ sex: 'F', age: 25 }),
        makeRecord({ sex: 'F', age: 20 }),
        makeRecord({ sex: 'M', age: 9 }),
      ];
      const sorted = [...records].sort(sexAgeSort);
      expect(sorted[0].sex).toBe('F');
      expect(sorted[0].age).toBe(20);
      expect(sorted[1].sex).toBe('F');
      expect(sorted[1].age).toBe(25);
      expect(sorted[2].sex).toBe('M');
      expect(sorted[2].age).toBe(9);
      expect(sorted[3].sex).toBe('M');
      expect(sorted[3].age).toBe(30);
    });
  });

  describe('uncodedSortOptions (List 1)', () => {
    it('should have 8 sort options', () => {
      expect(uncodedSortOptions).toHaveLength(8);
    });

    it('should sort by discharge date DESC', () => {
      const dischargeSort = uncodedSortOptions[2].comparator;
      const records = [
        makeRecord({ id: '1', dischargeDtm: '2024-01-01' } as BasePatientRecord),
        makeRecord({ id: '2', dischargeDtm: '2024-06-15' } as BasePatientRecord),
      ];
      const sorted = [...records].sort(dischargeSort);
      expect(sorted[0].id).toBe('2');
    });
  });

  describe('gopcSortOptions (Lists 2, 7)', () => {
    it('should have 4 sort options', () => {
      expect(gopcSortOptions).toHaveLength(4);
      expect(gopcSortOptions[0].label).toBe('By Slot Date/Time,Priority');
      expect(gopcSortOptions[1].label).toBe('By Priority,Slot Date/Time');
      expect(gopcSortOptions[2].label).toBe('By Name');
      expect(gopcSortOptions[3].label).toBe('By Episode');
    });
  });

  describe('moInChargeSortOptions (List 3)', () => {
    it('should have 9 sort options with MO in charge', () => {
      expect(moInChargeSortOptions).toHaveLength(9);
      expect(moInChargeSortOptions[8].label).toBe('By MO in charge');
    });
  });

  describe('opSortOptions (List 4)', () => {
    it('should have 5 sort options with attend time', () => {
      expect(opSortOptions).toHaveLength(5);
      expect(opSortOptions[4].label).toBe('By Attend Time');
    });
  });

  describe('userGroupSortOptions (List 5)', () => {
    it('should have 9 sort options', () => {
      expect(userGroupSortOptions).toHaveLength(9);
      expect(userGroupSortOptions[8].label).toBe('By Ward,Bed,Name');
    });
  });

  describe('absentSortOptions (List 6)', () => {
    it('should have 8 sort options matching normal', () => {
      expect(absentSortOptions).toHaveLength(8);
    });
  });

  describe('activeMoSortOptions (List 8)', () => {
    it('should have 9 sort options with ward,bed,specialty', () => {
      expect(activeMoSortOptions).toHaveLength(9);
      expect(activeMoSortOptions[8].label).toBe('By Ward,Bed,Specialty');
    });
  });

  describe('activeTeamSortOptions (List 9)', () => {
    it('should have 10 sort options with team sort', () => {
      expect(activeTeamSortOptions).toHaveLength(10);
      expect(activeTeamSortOptions[8].label).toBe('By Ward,Bed,Specialty');
      expect(activeTeamSortOptions[9].label).toBe('By Team');
    });
  });
});
