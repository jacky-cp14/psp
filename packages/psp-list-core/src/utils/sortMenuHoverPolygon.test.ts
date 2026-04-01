import { describe, expect, it } from "vitest";
import {
  cursorSubmenuWedgePolygon,
  isInCursorSubmenuWedge,
  isInSortSubmenuHoverZone,
  isPointInPolygon,
  pointInRect,
  pointInSubmenuPanel,
} from "./sortMenuHoverPolygon";

describe("isPointInPolygon", () => {
  it("detects interior of axis-aligned square", () => {
    const square = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ];
    expect(isPointInPolygon(5, 5, square)).toBe(true);
    expect(isPointInPolygon(0, 0, square)).toBe(true);
    expect(isPointInPolygon(20, 5, square)).toBe(false);
  });
});

describe("isInSortSubmenuHoverZone", () => {
  const item = new DOMRect(100, 100, 80, 40);
  const sub = new DOMRect(200, 90, 120, 200);

  it("is false for main-menu column left of wedge (Pat. Count path)", () => {
    const apex = { x: 170, y: 120 };
    expect(isInSortSubmenuHoverZone(130, 180, item, sub, apex)).toBe(false);
  });

  it("is true on Sort row", () => {
    expect(isInSortSubmenuHoverZone(130, 120, item, sub, null)).toBe(true);
  });

  it("is true inside cursor wedge (apex → submenu left edge)", () => {
    const apex = { x: 175, y: 120 };
    expect(isInSortSubmenuHoverZone(190, 150, item, sub, apex)).toBe(true);
  });

  it("with null apex skips wedge (only row + panel)", () => {
    expect(isInSortSubmenuHoverZone(190, 150, item, sub, null)).toBe(false);
  });
});

describe("cursorSubmenuWedgePolygon", () => {
  const sub = new DOMRect(200, 90, 120, 200);

  it("uses apex and full submenu left edge (top → bottom)", () => {
    const poly = cursorSubmenuWedgePolygon(175, 120, sub);
    expect(poly).toEqual([
      { x: 175, y: 120 },
      { x: 200, y: 90 },
      { x: 200, y: 290 },
    ]);
    expect(isPointInPolygon(190, 150, poly)).toBe(true);
  });
});

describe("isInCursorSubmenuWedge", () => {
  const sub = new DOMRect(200, 90, 120, 200);

  it("treats only coincident apex as inside shortcut (not a 2px radius)", () => {
    expect(isInCursorSubmenuWedge(175, 120, sub, 175, 120)).toBe(true);
    expect(isInCursorSubmenuWedge(175.5, 120.5, sub, 175, 120)).toBe(
      isPointInPolygon(175.5, 120.5, cursorSubmenuWedgePolygon(175, 120, sub)),
    );
  });
});

describe("pointInSubmenuPanel", () => {
  const item = new DOMRect(100, 100, 80, 40);
  const subNoOverlap = new DOMRect(200, 90, 120, 200);
  const subOverlap = new DOMRect(150, 90, 120, 200);

  it("full rect when no horizontal overlap", () => {
    expect(pointInSubmenuPanel(250, 150, item, subNoOverlap)).toBe(true);
  });

  it("requires x past item when submenu overlaps main", () => {
    expect(pointInSubmenuPanel(130, 150, item, subOverlap)).toBe(false);
    expect(pointInSubmenuPanel(190, 150, item, subOverlap)).toBe(true);
  });
});

describe("pointInRect", () => {
  it("includes boundary", () => {
    const r = new DOMRect(0, 0, 10, 10);
    expect(pointInRect(0, 0, r)).toBe(true);
    expect(pointInRect(10, 10, r)).toBe(true);
    expect(pointInRect(10.1, 5, r)).toBe(false);
  });
});
