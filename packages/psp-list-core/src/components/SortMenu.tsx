import React, { useState, useCallback, useRef, useEffect } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CheckIcon from "@mui/icons-material/Check";
import { usePspList } from "../context/PspListContext";
import { usePspGlobal } from "../store";
import { tokens } from "../theme/pspTokens";
import { isInSortSubmenuHoverZone } from "../utils/sortMenuHoverPolygon";
import { SortSubmenuHoverZoneDebugOverlay } from "./SortSubmenuHoverZoneDebugOverlay";

/**
 * Ignore sub-frame “outside” blips at polygon edges (including the diagonal
 * connector triangle) before closing. Too low → submenu closes while moving
 * through the triangle; ~50ms matches a few frames at 60Hz. This is not the
 * old stacked second delay — only the removed 260ms timer added that.
 */
const OUTSIDE_DEBOUNCE_MS = 50;

const cm = tokens.color.contextMenu;

const menuListSx = {
  py: 0,
  padding: 0,
};

const menuPaperSx = {
  bgcolor: cm.background,
  border: `1px solid ${tokens.color.border}`,
  boxShadow: cm.shadow,
  borderRadius: 0,
  minWidth: cm.minWidth,
  maxHeight: "min(70vh, 520px)",
  overflow: "auto",
  px: 0,
  /** Full-bleed rule between items; `MenuItem` text still uses its own horizontal padding. */
  "& .MuiDivider-root": {
    marginLeft: 0,
    marginRight: 0,
    width: "100%",
    maxWidth: "100%",
    alignSelf: "stretch",
  },
  "& .MuiMenuItem-root": {
    fontSize: cm.fontSize,
    minHeight: cm.itemMinHeight,
    py: 0.25,
    px: 1.25,
    color: tokens.color.toolbar.statLabelText,
    "&:hover": {
      bgcolor: cm.hoverBackground,
    },
  },
};

const sortSubmenuPaperSx = {
  ...menuPaperSx,
  minWidth: cm.submenuMinWidth,
  maxHeight: "min(70vh, 480px)",
};

export interface SortMenuProps {
  sortLabels: string[];
  /** Fired when user chooses "Pat. Count by Specialty". */
  onPatCountBySpecialty?: () => void;
  /** Fired when user picks a plugin list entry (id from global `pluginLists`). */
  onPluginListSelect?: (id: string) => void;
  children?: React.ReactNode;
  /** Draw Sort row / submenu / connector triangle overlay (dev). */
  debugSortSubmenuHoverZone?: boolean;
}

/**
 * Right-click context menu (legacy PSP-style): Sort with chevron — hover opens
 * the sort submenu; Pat. Count by Specialty; divider; plugin rows from
 * `usePspGlobal` `pluginLists`.
 */
export function SortMenu({
  sortLabels,
  onPatCountBySpecialty,
  onPluginListSelect,
  children,
  debugSortSubmenuHoverZone = false,
}: SortMenuProps): React.ReactElement {
  const { currentSortIndex, setSortIndex } = usePspList();
  const pluginLists = usePspGlobal((s) => s.pluginLists);

  const [anchorPosition, setAnchorPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [sortSubAnchor, setSortSubAnchor] = useState<HTMLElement | null>(null);

  const submenuPaperRef = useRef<HTMLDivElement | null>(null);
  /** Previous pointer — apex for cursor→submenu-left-edge wedge (see `sortMenuHoverPolygon`). */
  const wedgeApexRef = useRef({ x: 0, y: 0 });
  const outsideDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafPointerRef = useRef(0);
  const lastPointerRef = useRef({ x: 0, y: 0 });

  const openSortSubmenu = useCallback((el: HTMLElement | null) => {
    wedgeApexRef.current = { ...lastPointerRef.current };
    setSortSubAnchor(el);
  }, []);

  /** Close sort submenu immediately (e.g. user moved to another main-menu row). */
  const closeSortSubmenu = useCallback(() => {
    setSortSubAnchor(null);
  }, []);

  /**
   * Geometry-only safe zone: Sort row, **cursor wedge** (previous-frame apex →
   * submenu left edge), submenu panel (`pointInSubmenuPanel` overlap rule). Not
   * the whole main menu. rAF + outside debounce for edge noise.
   */
  useEffect(() => {
    if (!sortSubAnchor) return;
    wedgeApexRef.current = { ...lastPointerRef.current };

    const flushPointer = () => {
      rafPointerRef.current = 0;
      const { x, y } = lastPointerRef.current;
      const sub = submenuPaperRef.current?.getBoundingClientRect();
      if (!sub) {
        wedgeApexRef.current = { x, y };
        return;
      }
      const item = sortSubAnchor.getBoundingClientRect();
      const wedgeApex = wedgeApexRef.current;
      const inside = isInSortSubmenuHoverZone(x, y, item, sub, wedgeApex);
      wedgeApexRef.current = { x, y };

      if (inside) {
        if (outsideDebounceRef.current !== null) {
          clearTimeout(outsideDebounceRef.current);
          outsideDebounceRef.current = null;
        }
        return;
      }

      if (outsideDebounceRef.current !== null) return;
      outsideDebounceRef.current = setTimeout(() => {
        outsideDebounceRef.current = null;
        closeSortSubmenu();
      }, OUTSIDE_DEBOUNCE_MS);
    };

    const onMove = (e: MouseEvent) => {
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
      if (rafPointerRef.current !== 0) return;
      rafPointerRef.current = requestAnimationFrame(flushPointer);
    };

    document.addEventListener("mousemove", onMove, true);
    return () => {
      document.removeEventListener("mousemove", onMove, true);
      if (rafPointerRef.current !== 0) {
        cancelAnimationFrame(rafPointerRef.current);
        rafPointerRef.current = 0;
      }
      if (outsideDebounceRef.current !== null) {
        clearTimeout(outsideDebounceRef.current);
        outsideDebounceRef.current = null;
      }
    };
  }, [sortSubAnchor, closeSortSubmenu]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    setSortSubAnchor(null);
    setAnchorPosition({ top: e.clientY, left: e.clientX });
  }, []);

  const handleCloseMain = useCallback(() => {
    setAnchorPosition(null);
    setSortSubAnchor(null);
  }, []);

  const handleSortSelect = useCallback(
    (index: number) => {
      setSortIndex(index);
      handleCloseMain();
    },
    [setSortIndex, handleCloseMain],
  );

  const handlePatCount = useCallback(() => {
    onPatCountBySpecialty?.();
    handleCloseMain();
  }, [onPatCountBySpecialty, handleCloseMain]);

  const handlePluginPick = useCallback(
    (id: string) => {
      onPluginListSelect?.(id);
      handleCloseMain();
    },
    [onPluginListSelect, handleCloseMain],
  );

  return (
    <>
      <div
        onContextMenu={handleContextMenu}
        data-testid="sort-menu-trigger"
        style={{ display: "contents" }}
      >
        {children}
      </div>
      <Menu
        open={anchorPosition !== null}
        onClose={handleCloseMain}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition ?? undefined}
        disableAutoFocus
        transitionDuration={0}
        MenuListProps={{ disablePadding: true, sx: menuListSx }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: menuPaperSx,
          },
        }}
      >
        {/*
          Do not use onMouseLeave on Sort: submenu portals above this row and would flicker.
          Submenu close uses document mousemove + trapezoid safe zone (see useEffect).
        */}
        <MenuItem
          onMouseEnter={(e) => openSortSubmenu(e.currentTarget)}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          sx={{ justifyContent: "space-between", gap: 1 }}
        >
          Sort
          <KeyboardArrowRightIcon
            sx={{ fontSize: 18, color: "action.active", flexShrink: 0 }}
          />
        </MenuItem>
        <MenuItem onMouseEnter={closeSortSubmenu} onClick={handlePatCount}>
          Pat. Count by Specialty
        </MenuItem>
        {pluginLists.length > 0 ? (
          <>
            <Divider
              component="li"
              variant="fullWidth"
              flexItem
              onMouseEnter={closeSortSubmenu}
              sx={{
                borderColor: tokens.color.divider,
                my: 0,
                mx: 0,
              }}
            />
            {pluginLists.map((item) => (
              <MenuItem
                key={item.id}
                onMouseEnter={closeSortSubmenu}
                onClick={() => handlePluginPick(item.id)}
              >
                {item.label}
              </MenuItem>
            ))}
          </>
        ) : null}
      </Menu>

      <Menu
        anchorEl={sortSubAnchor}
        open={Boolean(sortSubAnchor)}
        onClose={() => setSortSubAnchor(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        disableAutoFocus
        transitionDuration={0}
        MenuListProps={{ disablePadding: true, sx: menuListSx }}
        sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
        slotProps={{
          paper: {
            ref: submenuPaperRef,
            elevation: 0,
            sx: sortSubmenuPaperSx,
          },
        }}
      >
        {sortLabels.map((label, index) => (
          <MenuItem
            key={`${label}-${index}`}
            onClick={() => handleSortSelect(index)}
            selected={index === currentSortIndex}
          >
            <ListItemIcon sx={{ minWidth: 28 }}>
              {index === currentSortIndex ? (
                <CheckIcon sx={{ fontSize: 18 }} />
              ) : null}
            </ListItemIcon>
            <ListItemText
              primary={label}
              primaryTypographyProps={{ fontSize: 13 }}
            />
          </MenuItem>
        ))}
      </Menu>

      {debugSortSubmenuHoverZone ? (
        <SortSubmenuHoverZoneDebugOverlay
          enabled
          sortItemEl={sortSubAnchor}
          submenuPaperRef={submenuPaperRef}
          pointerRef={lastPointerRef}
        />
      ) : null}
    </>
  );
}
