import { useState, useCallback, useMemo } from 'react';
import { differenceInDays, isValid, isBefore, isAfter, parse, startOfDay } from 'date-fns';

const SYBASE_MIN = new Date(1900, 0, 1);
const DATE_REGEX = /^\d{2}-[A-Za-z]{3}-\d{4}$/;
const DEFAULT_FORMAT = 'dd-MMM-yyyy';

export interface DateRangeValidation {
  valid: boolean;
  error?: string;
}

export interface UseDateRangeReturn {
  from: Date | null;
  to: Date | null;
  setFrom: (date: Date | null) => void;
  setTo: (date: Date | null) => void;
  setFromString: (value: string) => void;
  setToString: (value: string) => void;
  validate: () => DateRangeValidation;
}

/**
 * Date range picker state + validation for lists 4, 5, 7.
 * Enforces max range, Sybase lower bound, and format validation.
 */
export function useDateRange(config: {
  maxRangeDays: number;
  minDate?: Date;
  dateFormat?: string;
}): UseDateRangeReturn {
  const { maxRangeDays, minDate = SYBASE_MIN, dateFormat = DEFAULT_FORMAT } = config;
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);

  const parseDateStr = useCallback(
    (value: string): Date | null => {
      if (!DATE_REGEX.test(value)) return null;
      const parsed = parse(value, dateFormat, new Date());
      return isValid(parsed) ? startOfDay(parsed) : null;
    },
    [dateFormat],
  );

  const setFromString = useCallback(
    (value: string) => setFrom(parseDateStr(value)),
    [parseDateStr],
  );

  const setToString = useCallback(
    (value: string) => setTo(parseDateStr(value)),
    [parseDateStr],
  );

  const validate = useCallback((): DateRangeValidation => {
    if (!from || !to) {
      return { valid: false, error: 'Both from and to dates are required' };
    }
    if (!isValid(from) || !isValid(to)) {
      return { valid: false, error: 'Invalid date format' };
    }
    if (isBefore(from, minDate)) {
      return { valid: false, error: `From date must not be before ${minDate.toLocaleDateString()}` };
    }
    if (isAfter(from, to)) {
      return { valid: false, error: 'From date must not be after To date' };
    }
    const rangeDays = Math.abs(differenceInDays(to, from));
    if (rangeDays > maxRangeDays) {
      return { valid: false, error: `Date range must not exceed ${maxRangeDays} days` };
    }
    return { valid: true };
  }, [from, to, minDate, maxRangeDays]);

  return useMemo(
    () => ({ from, to, setFrom, setTo, setFromString, setToString, validate }),
    [from, to, setFrom, setTo, setFromString, setToString, validate],
  );
}
