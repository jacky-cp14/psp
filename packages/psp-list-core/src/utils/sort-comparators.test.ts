import { buildComparator, buildFieldCompareMap } from './sort-comparators';
import type { SortKey, FieldCompareMap } from './sort-comparators';
import type { GridColDef } from '@mui/x-data-grid-pro';

type Row = Record<string, unknown>;

function sort(rows: Row[], keys: SortKey[], fieldCompares?: FieldCompareMap): Row[] {
  return [...rows].sort(buildComparator(keys, fieldCompares));
}

describe('buildComparator', () => {
  describe('given an empty keys array', () => {
    it('should treat all rows as equal', () => {
      const cmp = buildComparator([]);
      expect(cmp({ a: 1 }, { b: 2 })).toBe(0);
    });
  });

  // -----------------------------------------------------------------------
  // String sorting (default)
  // -----------------------------------------------------------------------
  describe('string sorting (default)', () => {
    const ascByName: SortKey[] = [{ field: 'name', direction: 'ASC' }];
    const descByName: SortKey[] = [{ field: 'name', direction: 'DESC' }];

    it('should sort ASC alphabetically', () => {
      const rows = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];
      expect(sort(rows, ascByName).map((r) => r.name)).toEqual([
        'Alice',
        'Bob',
        'Charlie',
      ]);
    });

    it('should sort DESC alphabetically', () => {
      const rows = [{ name: 'Alice' }, { name: 'Charlie' }, { name: 'Bob' }];
      expect(sort(rows, descByName).map((r) => r.name)).toEqual([
        'Charlie',
        'Bob',
        'Alice',
      ]);
    });

    it('should return 0 for equal values', () => {
      const cmp = buildComparator(ascByName);
      expect(cmp({ name: 'Same' }, { name: 'Same' })).toBe(0);
    });

    it('should treat missing field as empty string', () => {
      const cmp = buildComparator(ascByName);
      expect(cmp({}, { name: 'A' })).toBeLessThan(0);
    });

    it('should treat non-string value as empty string', () => {
      const cmp = buildComparator(ascByName);
      expect(cmp({ name: 42 }, { name: 'A' })).toBeLessThan(0);
    });
  });

  // -----------------------------------------------------------------------
  // Numeric sorting
  // -----------------------------------------------------------------------
  describe('numeric sorting', () => {
    const ascByAge: SortKey[] = [
      { field: 'age', direction: 'ASC', compare: 'numeric' },
    ];

    it('should compare numbers correctly ASC', () => {
      const rows = [{ age: 30 }, { age: 10 }, { age: 20 }];
      expect(sort(rows, ascByAge).map((r) => r.age)).toEqual([10, 20, 30]);
    });

    it('should compare numbers correctly DESC', () => {
      const keys: SortKey[] = [
        { field: 'age', direction: 'DESC', compare: 'numeric' },
      ];
      const rows = [{ age: 10 }, { age: 30 }, { age: 20 }];
      expect(sort(rows, keys).map((r) => r.age)).toEqual([30, 20, 10]);
    });

    it('should not sort lexicographically (9 < 10)', () => {
      const rows = [{ age: 10 }, { age: 9 }];
      expect(sort(rows, ascByAge).map((r) => r.age)).toEqual([9, 10]);
    });

    it('should coerce string numbers', () => {
      const cmp = buildComparator(ascByAge);
      expect(cmp({ age: '3' }, { age: 10 })).toBeLessThan(0);
    });

    it('should treat missing field as 0', () => {
      const cmp = buildComparator(ascByAge);
      expect(cmp({}, { age: 5 })).toBeLessThan(0);
      expect(cmp({}, { age: -1 })).toBeGreaterThan(0);
    });

    it('should treat NaN-producing values as 0', () => {
      const cmp = buildComparator(ascByAge);
      expect(cmp({ age: 'abc' }, { age: 1 })).toBeLessThan(0);
      expect(cmp({ age: 'abc' }, { age: 0 })).toBe(0);
    });

    it('should return 0 for equal numbers', () => {
      const cmp = buildComparator(ascByAge);
      expect(cmp({ age: 42 }, { age: 42 })).toBe(0);
    });
  });

  // -----------------------------------------------------------------------
  // DateTime sorting
  // -----------------------------------------------------------------------
  describe('dateTime sorting', () => {
    const ascByDate: SortKey[] = [
      { field: 'dt', direction: 'ASC', compare: 'dateTime' },
    ];

    it('should sort ISO date strings ASC', () => {
      const rows = [
        { dt: '2024-06-15' },
        { dt: '2024-01-01' },
        { dt: '2024-03-10' },
      ];
      expect(sort(rows, ascByDate).map((r) => r.dt)).toEqual([
        '2024-01-01',
        '2024-03-10',
        '2024-06-15',
      ]);
    });

    it('should sort ISO date strings DESC', () => {
      const keys: SortKey[] = [
        { field: 'dt', direction: 'DESC', compare: 'dateTime' },
      ];
      const rows = [{ dt: '2024-01-01' }, { dt: '2024-12-31' }];
      expect(sort(rows, keys).map((r) => r.dt)).toEqual([
        '2024-12-31',
        '2024-01-01',
      ]);
    });

    it('should handle "Y-m-d H:i:s" format (space separator)', () => {
      const cmp = buildComparator(ascByDate);
      expect(
        cmp({ dt: '2024-01-01 10:00:00' }, { dt: '2024-01-01 09:00:00' }),
      ).toBeGreaterThan(0);
    });

    it('should accept Date objects', () => {
      const cmp = buildComparator(ascByDate);
      const earlier = new Date('2024-01-01');
      const later = new Date('2024-06-15');
      expect(cmp({ dt: earlier }, { dt: later })).toBeLessThan(0);
    });

    it('should treat empty string as timestamp 0', () => {
      const cmp = buildComparator(ascByDate);
      expect(cmp({ dt: '' }, { dt: '2024-01-01' })).toBeLessThan(0);
    });

    it('should treat missing field as timestamp 0', () => {
      const cmp = buildComparator(ascByDate);
      expect(cmp({}, { dt: '2024-01-01' })).toBeLessThan(0);
    });

    it('should treat unparseable date string as timestamp 0', () => {
      const cmp = buildComparator(ascByDate);
      expect(cmp({ dt: 'not-a-date' }, { dt: '2024-01-01' })).toBeLessThan(0);
      expect(cmp({ dt: 'not-a-date' }, { dt: '' })).toBe(0);
    });
  });

  // -----------------------------------------------------------------------
  // Multi-key sorting
  // -----------------------------------------------------------------------
  describe('multi-key sorting', () => {
    it('should break ties with subsequent keys', () => {
      const keys: SortKey[] = [
        { field: 'ward', direction: 'ASC' },
        { field: 'bed', direction: 'ASC' },
      ];
      const rows = [
        { ward: 'A', bed: '3' },
        { ward: 'A', bed: '1' },
        { ward: 'B', bed: '2' },
      ];
      const sorted = sort(rows, keys);
      expect(sorted).toEqual([
        { ward: 'A', bed: '1' },
        { ward: 'A', bed: '3' },
        { ward: 'B', bed: '2' },
      ]);
    });

    it('should support mixed compares across keys', () => {
      const keys: SortKey[] = [
        { field: 'status', direction: 'ASC' },
        { field: 'priority', direction: 'DESC', compare: 'numeric' },
      ];
      const rows = [
        { status: 'open', priority: 1 },
        { status: 'open', priority: 3 },
        { status: 'closed', priority: 2 },
      ];
      const sorted = sort(rows, keys);
      expect(sorted).toEqual([
        { status: 'closed', priority: 2 },
        { status: 'open', priority: 3 },
        { status: 'open', priority: 1 },
      ]);
    });

    it('should support mixed directions across keys', () => {
      const keys: SortKey[] = [
        { field: 'group', direction: 'ASC' },
        { field: 'score', direction: 'DESC', compare: 'numeric' },
      ];
      const rows = [
        { group: 'B', score: 50 },
        { group: 'A', score: 70 },
        { group: 'A', score: 90 },
      ];
      const sorted = sort(rows, keys);
      expect(sorted).toEqual([
        { group: 'A', score: 90 },
        { group: 'A', score: 70 },
        { group: 'B', score: 50 },
      ]);
    });

    it('should return 0 when all keys match', () => {
      const keys: SortKey[] = [
        { field: 'x', direction: 'ASC' },
        { field: 'y', direction: 'ASC', compare: 'numeric' },
      ];
      const cmp = buildComparator(keys);
      expect(cmp({ x: 'a', y: 1 }, { x: 'a', y: 1 })).toBe(0);
    });

    it('should resolve ties across three keys', () => {
      const keys: SortKey[] = [
        { field: 'a', direction: 'ASC' },
        { field: 'b', direction: 'ASC' },
        { field: 'c', direction: 'DESC', compare: 'numeric' },
      ];
      const rows = [
        { a: 'X', b: 'Y', c: 1 },
        { a: 'X', b: 'Y', c: 9 },
        { a: 'X', b: 'Y', c: 5 },
      ];
      expect(sort(rows, keys).map((r) => r.c)).toEqual([9, 5, 1]);
    });
  });

  // -----------------------------------------------------------------------
  // Null / undefined / exotic value handling
  // -----------------------------------------------------------------------
  describe('null and undefined values', () => {
    it('should treat null as empty string for string sort', () => {
      const cmp = buildComparator([{ field: 'x', direction: 'ASC' }]);
      expect(cmp({ x: null }, { x: 'A' })).toBeLessThan(0);
      expect(cmp({ x: null }, { x: null })).toBe(0);
    });

    it('should treat null as 0 for numeric sort', () => {
      const cmp = buildComparator([
        { field: 'x', direction: 'ASC', compare: 'numeric' },
      ]);
      expect(cmp({ x: null }, { x: 5 })).toBeLessThan(0);
      expect(cmp({ x: null }, { x: 0 })).toBe(0);
    });

    it('should treat null as timestamp 0 for dateTime sort', () => {
      const cmp = buildComparator([
        { field: 'x', direction: 'ASC', compare: 'dateTime' },
      ]);
      expect(cmp({ x: null }, { x: '2024-01-01' })).toBeLessThan(0);
    });

    it('should treat explicit undefined identically to a missing field', () => {
      const cmp = buildComparator([
        { field: 'x', direction: 'ASC', compare: 'numeric' },
      ]);
      expect(cmp({ x: undefined }, {})).toBe(0);
    });
  });

  // -----------------------------------------------------------------------
  // Boolean coercion
  // -----------------------------------------------------------------------
  describe('boolean values in numeric sort', () => {
    const numKey: SortKey[] = [
      { field: 'v', direction: 'ASC', compare: 'numeric' },
    ];

    it('should coerce true to 1 and false to 0', () => {
      const cmp = buildComparator(numKey);
      expect(cmp({ v: false }, { v: true })).toBeLessThan(0);
      expect(cmp({ v: true }, { v: 1 })).toBe(0);
      expect(cmp({ v: false }, { v: 0 })).toBe(0);
    });

    it('should treat booleans as empty string in string sort', () => {
      const cmp = buildComparator([{ field: 'v', direction: 'ASC' }]);
      expect(cmp({ v: true }, { v: 'A' })).toBeLessThan(0);
    });
  });

  // -----------------------------------------------------------------------
  // Infinity / extreme numeric values
  // -----------------------------------------------------------------------
  describe('Infinity and extreme numbers', () => {
    const numKey: SortKey[] = [
      { field: 'v', direction: 'ASC', compare: 'numeric' },
    ];

    it('should sort Infinity after finite numbers', () => {
      const cmp = buildComparator(numKey);
      expect(cmp({ v: Infinity }, { v: 999999 })).toBeGreaterThan(0);
    });

    it('should sort -Infinity before finite numbers', () => {
      const cmp = buildComparator(numKey);
      expect(cmp({ v: -Infinity }, { v: -999999 })).toBeLessThan(0);
    });

    it('should return 0 when both values are Infinity', () => {
      const cmp = buildComparator(numKey);
      expect(cmp({ v: Infinity }, { v: Infinity })).toBe(0);
    });

    it('should return 0 when both values are -Infinity', () => {
      const cmp = buildComparator(numKey);
      expect(cmp({ v: -Infinity }, { v: -Infinity })).toBe(0);
    });

    it('should sort -Infinity before Infinity', () => {
      const cmp = buildComparator(numKey);
      expect(cmp({ v: -Infinity }, { v: Infinity })).toBeLessThan(0);
    });
  });

  // -----------------------------------------------------------------------
  // DateTime edge cases
  // -----------------------------------------------------------------------
  describe('dateTime edge cases', () => {
    const dateKey: SortKey[] = [
      { field: 'dt', direction: 'ASC', compare: 'dateTime' },
    ];

    it('should handle ISO string with timezone offset', () => {
      const cmp = buildComparator(dateKey);
      expect(
        cmp(
          { dt: '2024-01-01T00:00:00+08:00' },
          { dt: '2024-01-01T00:00:00Z' },
        ),
      ).toBeLessThan(0);
    });

    it('should handle ISO string with milliseconds', () => {
      const cmp = buildComparator(dateKey);
      expect(
        cmp({ dt: '2024-01-01T00:00:00.000Z' }, { dt: '2024-01-01T00:00:00.999Z' }),
      ).toBeLessThan(0);
    });

    it('should treat an invalid Date object as NaN timestamp', () => {
      const cmp = buildComparator(dateKey);
      const invalid = new Date('not-a-date');
      expect(cmp({ dt: invalid }, { dt: '2024-01-01' })).toBeLessThan(0);
    });

    it('should return 0 for two invalid Date objects', () => {
      const cmp = buildComparator(dateKey);
      const a = new Date('nope');
      const b = new Date('also-nope');
      expect(cmp({ dt: a }, { dt: b })).toBe(0);
    });

    it('should handle numeric timestamp passed as a number (falls to 0)', () => {
      const cmp = buildComparator(dateKey);
      expect(cmp({ dt: 1704067200000 }, { dt: '2024-01-01' })).toBeLessThan(0);
    });
  });

  // -----------------------------------------------------------------------
  // String edge cases
  // -----------------------------------------------------------------------
  describe('string edge cases', () => {
    const strKey: SortKey[] = [{ field: 'v', direction: 'ASC' }];

    it('should compare case-sensitively (uppercase before lowercase in most locales)', () => {
      const cmp = buildComparator(strKey);
      const result = cmp({ v: 'a' }, { v: 'B' });
      expect(result).not.toBe(0);
    });

    it('should handle empty string vs empty string as equal', () => {
      const cmp = buildComparator(strKey);
      expect(cmp({ v: '' }, { v: '' })).toBe(0);
    });

    it('should handle whitespace-only strings', () => {
      const cmp = buildComparator(strKey);
      expect(cmp({ v: ' ' }, { v: '' })).toBeGreaterThan(0);
    });

    it('should sort unicode characters via localeCompare', () => {
      const rows = [{ v: 'Ölberg' }, { v: 'Oslo' }, { v: 'Aachen' }];
      const sorted = sort(rows, strKey).map((r) => r.v);
      expect(sorted[0]).toBe('Aachen');
    });

    it('should treat object/array values as empty string', () => {
      const cmp = buildComparator(strKey);
      expect(cmp({ v: { nested: 1 } }, { v: '' })).toBe(0);
      expect(cmp({ v: [1, 2, 3] }, { v: '' })).toBe(0);
    });
  });

  // -----------------------------------------------------------------------
  // Stability (equal rows preserve insertion order)
  // -----------------------------------------------------------------------
  describe('sort stability', () => {
    it('should preserve insertion order for equal rows', () => {
      const keys: SortKey[] = [{ field: 'group', direction: 'ASC' }];
      const rows = [
        { group: 'A', id: 1 },
        { group: 'A', id: 2 },
        { group: 'A', id: 3 },
      ];
      const sorted = sort(rows, keys);
      expect(sorted.map((r) => r.id)).toEqual([1, 2, 3]);
    });
  });

  // -----------------------------------------------------------------------
  // Custom comparator function
  // -----------------------------------------------------------------------
  describe('custom comparator function', () => {
    it('should use a function passed as compare', () => {
      const parseSexAge = (v: unknown): { sex: string; age: number } => {
        if (typeof v !== 'string') return { sex: '', age: 0 };
        const [sex = '', ageStr = '0'] = v.split('/').map((s) => s.trim());
        return { sex, age: Number(ageStr) || 0 };
      };
      const compareSexAge = (a: unknown, b: unknown): number => {
        const pa = parseSexAge(a);
        const pb = parseSexAge(b);
        const sexCmp = pa.sex.localeCompare(pb.sex);
        if (sexCmp !== 0) return sexCmp;
        return pa.age - pb.age;
      };

      const keys: SortKey[] = [
        { field: 'sexAge', direction: 'ASC', compare: compareSexAge },
      ];
      const rows = [
        { sexAge: 'M / 30' },
        { sexAge: 'F / 25' },
        { sexAge: 'M / 18' },
        { sexAge: 'F / 40' },
      ];
      const sorted = sort(rows, keys);
      expect(sorted.map((r) => r.sexAge)).toEqual([
        'F / 25',
        'F / 40',
        'M / 18',
        'M / 30',
      ]);
    });

    it('should apply DESC direction to custom comparator result', () => {
      const compareLength = (a: unknown, b: unknown): number =>
        String(a ?? '').length - String(b ?? '').length;

      const keys: SortKey[] = [
        { field: 'v', direction: 'DESC', compare: compareLength },
      ];
      const rows = [{ v: 'ab' }, { v: 'abcde' }, { v: 'a' }];
      const sorted = sort(rows, keys);
      expect(sorted.map((r) => r.v)).toEqual(['abcde', 'ab', 'a']);
    });

    it('should work as part of multi-key sort', () => {
      const parseAge = (v: unknown): number => {
        if (typeof v !== 'string') return 0;
        const parts = v.split('/').map((s) => s.trim());
        return Number(parts[1]) || 0;
      };
      const compareByAge = (a: unknown, b: unknown): number =>
        parseAge(a) - parseAge(b);

      const keys: SortKey[] = [
        { field: 'ward', direction: 'ASC' },
        { field: 'sexAge', direction: 'ASC', compare: compareByAge },
      ];
      const rows = [
        { ward: 'A', sexAge: 'M / 30' },
        { ward: 'A', sexAge: 'F / 18' },
        { ward: 'B', sexAge: 'M / 25' },
      ];
      const sorted = sort(rows, keys);
      expect(sorted).toEqual([
        { ward: 'A', sexAge: 'F / 18' },
        { ward: 'A', sexAge: 'M / 30' },
        { ward: 'B', sexAge: 'M / 25' },
      ]);
    });

    it('should resolve custom function from fieldCompares map', () => {
      const compareLength = (a: unknown, b: unknown): number =>
        String(a ?? '').length - String(b ?? '').length;

      const fieldCompares: FieldCompareMap = { v: compareLength };
      const keys: SortKey[] = [{ field: 'v', direction: 'ASC' }];
      const rows = [{ v: 'abc' }, { v: 'a' }, { v: 'ab' }];
      const sorted = sort(rows, keys, fieldCompares);
      expect(sorted.map((r) => r.v)).toEqual(['a', 'ab', 'abc']);
    });
  });

  // -----------------------------------------------------------------------
  // fieldCompares parameter
  // -----------------------------------------------------------------------
  describe('fieldCompares parameter', () => {
    it('should resolve dateTime from fieldCompares when SortKey.compare is omitted', () => {
      const fieldCompares: FieldCompareMap = { dt: 'dateTime' };
      const keys: SortKey[] = [{ field: 'dt', direction: 'ASC' }];
      const rows = [
        { dt: new Date('2024-06-15') },
        { dt: new Date('2024-01-01') },
        { dt: new Date('2024-03-10') },
      ];
      const sorted = sort(rows, keys, fieldCompares);
      expect(sorted.map((r) => (r.dt as Date).toISOString())).toEqual([
        '2024-01-01T00:00:00.000Z',
        '2024-03-10T00:00:00.000Z',
        '2024-06-15T00:00:00.000Z',
      ]);
    });

    it('should resolve numeric from fieldCompares', () => {
      const fieldCompares: FieldCompareMap = { score: 'numeric' };
      const keys: SortKey[] = [{ field: 'score', direction: 'ASC' }];
      const rows = [{ score: 10 }, { score: 9 }, { score: 20 }];
      expect(sort(rows, keys, fieldCompares).map((r) => r.score)).toEqual([9, 10, 20]);
    });

    it('should let SortKey.compare override fieldCompares', () => {
      const fieldCompares: FieldCompareMap = { v: 'numeric' };
      const keys: SortKey[] = [{ field: 'v', direction: 'ASC', compare: 'string' }];
      const rows = [{ v: '10' }, { v: '9' }, { v: '20' }];
      expect(sort(rows, keys, fieldCompares).map((r) => r.v)).toEqual(['10', '20', '9']);
    });

    it('should default to string when field is absent from fieldCompares', () => {
      const fieldCompares: FieldCompareMap = { other: 'numeric' };
      const keys: SortKey[] = [{ field: 'v', direction: 'ASC' }];
      const rows = [{ v: '10' }, { v: '9' }, { v: '20' }];
      expect(sort(rows, keys, fieldCompares).map((r) => r.v)).toEqual(['10', '20', '9']);
    });

    it('should work without fieldCompares (backward compat)', () => {
      const keys: SortKey[] = [
        { field: 'dt', direction: 'ASC', compare: 'dateTime' },
      ];
      const rows = [{ dt: '2024-06-15' }, { dt: '2024-01-01' }];
      expect(sort(rows, keys).map((r) => r.dt)).toEqual([
        '2024-01-01',
        '2024-06-15',
      ]);
    });

    it('should apply fieldCompares across multi-key sorts', () => {
      const fieldCompares: FieldCompareMap = { dt: 'dateTime', priority: 'numeric' };
      const keys: SortKey[] = [
        { field: 'dt', direction: 'ASC' },
        { field: 'priority', direction: 'DESC' },
      ];
      const rows = [
        { dt: '2024-01-01', priority: 1 },
        { dt: '2024-01-01', priority: 3 },
        { dt: '2024-06-15', priority: 2 },
      ];
      const sorted = sort(rows, keys, fieldCompares);
      expect(sorted).toEqual([
        { dt: '2024-01-01', priority: 3 },
        { dt: '2024-01-01', priority: 1 },
        { dt: '2024-06-15', priority: 2 },
      ]);
    });
  });
});

describe('buildFieldCompareMap', () => {
  it('should map number column type to numeric', () => {
    const cols: GridColDef[] = [
      { field: 'score', type: 'number', headerName: 'Score', width: 100 },
    ];
    expect(buildFieldCompareMap(cols)).toEqual({ score: 'numeric' });
  });

  it('should map date column type to dateTime', () => {
    const cols: GridColDef[] = [
      { field: 'dt', type: 'date', headerName: 'Date', width: 100 },
    ];
    expect(buildFieldCompareMap(cols)).toEqual({ dt: 'dateTime' });
  });

  it('should map dateTime column type to dateTime', () => {
    const cols: GridColDef[] = [
      { field: 'dt', type: 'dateTime', headerName: 'DateTime', width: 100 },
    ];
    expect(buildFieldCompareMap(cols)).toEqual({ dt: 'dateTime' });
  });

  it('should omit string columns (default fallback)', () => {
    const cols: GridColDef[] = [
      { field: 'name', type: 'string', headerName: 'Name', width: 100 },
    ];
    expect(buildFieldCompareMap(cols)).toEqual({});
  });

  it('should omit columns with no type', () => {
    const cols: GridColDef[] = [
      { field: 'name', headerName: 'Name', width: 100 },
    ];
    expect(buildFieldCompareMap(cols)).toEqual({});
  });

  it('should handle mixed column types', () => {
    const cols: GridColDef[] = [
      { field: 'name', headerName: 'Name', width: 100 },
      { field: 'age', type: 'number', headerName: 'Age', width: 80 },
      { field: 'admissionDtm', type: 'dateTime', headerName: 'Admission', width: 200 },
      { field: 'ward', type: 'string', headerName: 'Ward', width: 60 },
    ];
    expect(buildFieldCompareMap(cols)).toEqual({
      age: 'numeric',
      admissionDtm: 'dateTime',
    });
  });

  it('should return empty map for empty columns', () => {
    expect(buildFieldCompareMap([])).toEqual({});
  });

  it('should ignore boolean and singleSelect types', () => {
    const cols: GridColDef[] = [
      { field: 'active', type: 'boolean', headerName: 'Active', width: 80 },
      { field: 'status', type: 'singleSelect', headerName: 'Status', width: 100 },
    ];
    expect(buildFieldCompareMap(cols)).toEqual({});
  });
});
