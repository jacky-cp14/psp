import { useMemo } from 'react';
import type { GridColDef } from '@mui/x-data-grid-pro';
import { usePspGlobal } from '@psp/core';
import type { FrameMode, LangMode } from '@psp/core';

export function scaleW(width: number, factor: number): number {
  return Math.max(48, Math.round(width * factor));
}

export function frameMetrics(frameMode: FrameMode): {
  rowHeight: number;
  columnScale: number;
  defaultSplit: number;
} {
  if (frameMode === 'expand') {
    return { rowHeight: 34, columnScale: 1.1, defaultSplit: 38 };
  }
  return { rowHeight: 24, columnScale: 0.9, defaultSplit: 32 };
}

export function useDemoPspLayout(): {
  langMode: LangMode;
  frameMode: FrameMode;
  rowHeight: number;
  columnScale: number;
  defaultSplit: number;
} {
  const langMode = usePspGlobal((s) => s.langMode);
  const frameMode = usePspGlobal((s) => s.frameMode);
  const { rowHeight, columnScale, defaultSplit } = useMemo(
    () => frameMetrics(frameMode),
    [frameMode],
  );
  return { langMode, frameMode, rowHeight, columnScale, defaultSplit };
}

const EN_NAME_MIN_BASE = 120;
const ZH_NAME_WIDTH_BASE = 160;

/** English vs Chinese name columns (scaled). English name min width is 4× in EN mode. */
export function namePairColumns(factor: number, langMode: LangMode): { en: GridColDef; zh: GridColDef } {
  const enMinBase = langMode === 'en' ? EN_NAME_MIN_BASE * 4 : EN_NAME_MIN_BASE;
  return {
    en: {
      field: 'name',
      headerName: 'English Name',
      flex: 1,
      minWidth: scaleW(enMinBase, factor),
    },
    zh: {
      field: 'chineseName',
      headerName: 'Chinese Name',
      width: scaleW(ZH_NAME_WIDTH_BASE, factor),
    },
  };
}

const SEX_AGE_BASE_WIDTH = 82;

/**
 * Left grid column order (after optional prefix such as ward):
 * - EN: lead (bed or slot) → Sex/Age → English Name → Chinese Name → suffix
 * - ZH: lead → Chinese Name → Sex/Age → English Name → suffix
 */
export function orderLeadSexAgeEnZh(
  langMode: LangMode,
  prefix: GridColDef[],
  factor: number,
  leadCol: GridColDef,
  suffix: GridColDef[] = [],
): GridColDef[] {
  const sexAge: GridColDef = {
    field: 'sexAge',
    headerName: 'Sex/Age',
    width: scaleW(SEX_AGE_BASE_WIDTH, factor),
  };
  const { en, zh } = namePairColumns(factor, langMode);
  if (langMode === 'zh') {
    return [...prefix, leadCol, zh, sexAge, en, ...suffix];
  }
  return [...prefix, leadCol, sexAge, en, zh, ...suffix];
}

/** Scale numeric width / minWidth / maxWidth on a column template. */
export function scaleGridColumns(cols: GridColDef[], factor: number): GridColDef[] {
  return cols.map((col) => {
    const next: GridColDef = { ...col };
    if (typeof col.width === 'number') {
      next.width = scaleW(col.width, factor);
    }
    if (typeof col.minWidth === 'number') {
      next.minWidth = scaleW(col.minWidth, factor);
    }
    if (typeof col.maxWidth === 'number') {
      next.maxWidth = scaleW(col.maxWidth, factor);
    }
    return next;
  });
}
