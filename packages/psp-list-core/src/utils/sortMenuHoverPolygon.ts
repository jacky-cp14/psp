/**
 * Point-in-polygon (ray casting). Polygon vertices in order (closed or open).
 */
export function isPointInPolygon(
  x: number,
  y: number,
  polygon: ReadonlyArray<{ x: number; y: number }>,
): boolean {
  if (polygon.length < 3) return false;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    if (yj === yi) continue;
    const intersect =
      (yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function pointInRect(x: number, y: number, r: DOMRect): boolean {
  return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
}

/**
 * **Safe wedge** for flyout hit-testing: one vertex at the **cursor** (use
 * previous-frame position as apex so the current point is tested inside a
 * non-degenerate triangle), and the **base** along the submenu's **left edge**
 * from top to bottom — not the parent row's bounding box.
 */
export function cursorSubmenuWedgePolygon(
  apexX: number,
  apexY: number,
  submenuRect: DOMRect,
): { x: number; y: number }[] {
  return [
    { x: apexX, y: apexY },
    { x: submenuRect.left, y: submenuRect.top },
    { x: submenuRect.left, y: submenuRect.bottom },
  ];
}

/**
 * Only treat as "on apex" when coordinates match (ray cast is ambiguous on the
 * vertex). Do **not** use a pixel radius — slow movement keeps consecutive
 * frames within ~1px of the previous apex and would always short-circuit true.
 */
const APEX_COINCIDENT_EPS = 1e-4;

export function isInCursorSubmenuWedge(
  px: number,
  py: number,
  submenuRect: DOMRect,
  apexX: number,
  apexY: number,
): boolean {
  if (
    Math.abs(px - apexX) < APEX_COINCIDENT_EPS &&
    Math.abs(py - apexY) < APEX_COINCIDENT_EPS
  ) {
    return true;
  }
  const poly = cursorSubmenuWedgePolygon(apexX, apexY, submenuRect);
  return isPointInPolygon(px, py, poly);
}

/**
 * True if (x,y) is inside the submenu panel for hit-testing.
 * When the submenu overlaps the main menu (negative margin), only the part
 * strictly to the right of the Sort row counts — otherwise the tall submenu bbox
 * covers sibling rows and keeps the flyout open.
 */
export function pointInSubmenuPanel(
  x: number,
  y: number,
  itemRect: DOMRect,
  submenuRect: DOMRect,
): boolean {
  if (!pointInRect(x, y, submenuRect)) return false;
  if (submenuRect.left >= itemRect.right - 0.5) return true;
  return x >= itemRect.right;
}

/**
 * Keeps the sort submenu open: Sort row, **cursor wedge** (apex → submenu left
 * edge), or submenu panel — **not** the whole main menu (that reintroduced
 * "move to Pat. Count but submenu stays open" and boundary flashing).
 *
 * @param wedgeApex — Previous pointer position (see `SortMenu`); forms the safe
 *   triangle with the submenu's left edge. Pass `null` to skip wedge (tests).
 */
export function isInSortSubmenuHoverZone(
  clientX: number,
  clientY: number,
  itemRect: DOMRect | null,
  submenuRect: DOMRect | null,
  wedgeApex: { x: number; y: number } | null,
): boolean {
  if (!itemRect || !submenuRect) return false;

  if (pointInSubmenuPanel(clientX, clientY, itemRect, submenuRect)) return true;
  if (pointInRect(clientX, clientY, itemRect)) return true;

  if (wedgeApex !== null) {
    if (
      isInCursorSubmenuWedge(
        clientX,
        clientY,
        submenuRect,
        wedgeApex.x,
        wedgeApex.y,
      )
    ) {
      return true;
    }
  }

  return false;
}
