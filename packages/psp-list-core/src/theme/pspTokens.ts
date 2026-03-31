/**
 * PSP design tokens — single source of truth for every color, font, and
 * spacing value used by the PSP patient-list components.
 *
 * Reference: ExtJS Migration specs + pspColors from the legacy plugin.
 */
export const tokens = {
  color: {
    header: {
      gradientTop: "#F8F8F8",
      gradientBottom: "#CBCBCB",
      borderBottom: "#bdbdbd",
      text: "#790000",
    },
    cell: {
      text: "#000079",
      highlight: "#f43440",
    },
    row: {
      yellow: { even: "#FEF58E", odd: "#F5F5DB" },
      gray: { even: "#C6C6C6", odd: "#D6D6D6" },
      blue: { even: "#E3F2FD", odd: "#EFF7FF" },
      ndw: { base: "#FFF68F", alt: "#FFFACD", text: "#ff0000" },
      hover: "#b8b8b8",
      active: "#0401bc",
      activeText: "#ffffff",
      selected: "#03017c",
      selectedDark: "#020156",
      selectedText: "#ffffff",
    },
    border: "#c0c0c0",
    divider: "#333333",
    toolbar: {
      background: "#ececec",
      labelText: "#3c3c3c",
      statLabelText: "#1c1c1c",
      statValueBackground: "#ececec",
      statValueBorder: "#a0a0a0",
      statValueText: "#000000",
    },
    select: {
      background: "#ffffff",
      border: "#c3c3c3",
      text: "#000000",
    },
    icon: {
      lock: "#9c1407",
      lockHeader: "#828282",
    },
    outer: "#d1d1d1",
  },
  typography: {
    fontFamily: "Arial, sans-serif",
    fontSize: 22,
    lineHeight: "120%",
  },
} as const;
