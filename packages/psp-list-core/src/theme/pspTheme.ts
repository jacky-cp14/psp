import { createTheme } from "@mui/material/styles";
import type {} from "@mui/x-data-grid/themeAugmentation";
import { tokens } from "./pspTokens";
import { ROW_CLASSES } from "../utils/row-styling";

/**
 * Sets background on both the row and its pinned cells.
 * DataGrid v5 has no slot API for pinned-cell backgrounds, so this
 * class selector inside the theme is the accepted minimum.
 */
function rowVariant(bg: string, textColor?: string) {
  const cellOverrides: Record<string, string> = { backgroundColor: bg };
  if (textColor) cellOverrides.color = textColor;
  return {
    backgroundColor: bg,
    "& .MuiDataGrid-cell": cellOverrides,
  };
}

function rowColorRule(cls: string, bg: string) {
  return { [`&.${cls}`]: rowVariant(bg) };
}

function rowColorRuleWithText(cls: string, bg: string, color: string) {
  return {
    [`&.${cls}`]: {
      ...rowVariant(bg),
      color,
    },
  };
}

export const pspTheme = createTheme({
  typography: {
    fontFamily: tokens.typography.fontFamily,
    fontSize: tokens.typography.fontSize,
  },
  palette: {
    primary: { main: tokens.color.header.text },
    secondary: { main: tokens.color.cell.highlight },
    background: {
      default: tokens.color.outer,
      paper: tokens.color.row.gray.odd,
    },
    text: {
      primary: tokens.color.cell.text,
      secondary: tokens.color.header.text,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: tokens.color.outer },
      },
    },
    MuiDataGrid: {
      defaultProps: {
        /** Matches `tokens.typography.headerRowHeight` — grid applies this as inline header cell height. */
        headerHeight: tokens.typography.headerRowHeight,
      },
      styleOverrides: {
        root: {
          border: `1px solid ${tokens.color.border}`,
          borderRadius: 0,
          fontFamily: tokens.typography.fontFamily,
          fontSize: `${tokens.typography.fontSize}px`,
          lineHeight: tokens.typography.lineHeight,
          "& .MuiDataGrid-withBorderColor": {
            borderColor: "transparent",
          },
          "& .MuiDataGrid-main": {
            overflow: "clip",
          },
        },
        columnHeaders: {
          position: "sticky",
          top: 0,
          zIndex: 4,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          background: `linear-gradient(to bottom, ${tokens.color.header.gradientTop}, ${tokens.color.header.gradientBottom})`,
          color: tokens.color.header.text,
          fontWeight: 700,
          fontSize: `${tokens.typography.headerFontSize}px`,
          lineHeight: 1.2,
          borderBottom: `1.5px solid ${tokens.color.header.borderBottom}`,
        },
        columnHeader: {
          background: "transparent",
          color: tokens.color.header.text,
          fontWeight: 700,
          fontSize: `${tokens.typography.headerFontSize}px`,
          padding: "0 8px",
          display: "flex",
          alignItems: "center",
          borderRight: `3px solid ${tokens.color.header.borderRight}`,
          "&:focus": { outline: "none" },
          "&:focus-within": { outline: "none" },
        },
        columnHeaderTitle: {
          fontWeight: 700,
          fontSize: `${tokens.typography.headerFontSize}px`,
        },
        columnSeparator: {
          opacity: "0 !important",
        },
        menuIconButton: {
          display: "none",
        },
        iconButtonContainer: {
          visibility: "visible",
        },
        cell: {
          color: tokens.color.cell.text,
          fontSize: `${tokens.typography.fontSize}px`,
          fontWeight: 300,
          lineHeight: tokens.typography.lineHeight,
          padding: "0 8px",
          borderBottom: "none",
          display: "flex",
          alignItems: "center",
          "&:focus": { outline: "none" },
          "&:focus-within": { outline: "none" },
          "&.MuiDataGrid-cell--pinnedLeft, &.MuiDataGrid-cell--pinnedRight": {
            backgroundColor: "inherit",
          },
        },
        cellContent: {
          fontWeight: 300,
        },
        row: {
          border: "none",
          cursor: "pointer",

          // --- Row color scheme classes (assigned via getRowClass) ---
          ...rowColorRule(ROW_CLASSES.yellowEven, tokens.color.row.yellow.even),
          ...rowColorRule(ROW_CLASSES.yellowOdd, tokens.color.row.yellow.odd),
          ...rowColorRule(ROW_CLASSES.grayEven, tokens.color.row.gray.even),
          ...rowColorRule(ROW_CLASSES.grayOdd, tokens.color.row.gray.odd),
          ...rowColorRule(ROW_CLASSES.blueEven, tokens.color.row.blue.even),
          ...rowColorRule(ROW_CLASSES.blueOdd, tokens.color.row.blue.odd),
          ...rowColorRuleWithText(
            ROW_CLASSES.ndw,
            tokens.color.row.ndw.base,
            tokens.color.row.ndw.text,
          ),
          ...rowColorRuleWithText(
            ROW_CLASSES.ndwAlt,
            tokens.color.row.ndw.alt,
            tokens.color.row.ndw.text,
          ),

          // --- Hover ---
          "&:hover": rowVariant(tokens.color.row.hover),

          // --- Active (pressed) ---
          "&:active": rowVariant(
            tokens.color.row.active,
            tokens.color.row.activeText,
          ),

          // --- Selected ---
          "&.Mui-selected": {
            ...rowVariant(
              tokens.color.row.selected,
              tokens.color.row.selectedText,
            ),
            "&:hover": rowVariant(
              tokens.color.row.selected,
              tokens.color.row.selectedText,
            ),
            "&:active": rowVariant(
              tokens.color.row.selectedDark,
              tokens.color.row.selectedText,
            ),
          },
        },
        virtualScroller: {
          willChange: "transform",
          marginTop: "0 !important",
        },
        footerContainer: {
          borderTop: `1px solid ${tokens.color.border}`,
          background: `linear-gradient(to bottom, ${tokens.color.header.gradientTop}, ${tokens.color.header.gradientBottom})`,
        },
      },
    },
  },
});
