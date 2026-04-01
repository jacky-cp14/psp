import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cursorSubmenuWedgePolygon } from "../utils/sortMenuHoverPolygon";

export interface SortSubmenuHoverZoneDebugOverlayProps {
  /** When false, renders nothing. */
  enabled: boolean;
  /** Sort row anchor element (same as sort submenu `anchorEl`). */
  sortItemEl: HTMLElement | null;
  /** Ref to the sort submenu paper — must match `SortMenu` hover geometry. */
  submenuPaperRef: React.RefObject<HTMLDivElement | null>;
  /** Same ref as `SortMenu` `lastPointerRef` — apex of the safe wedge (visual). */
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
}

type Geom = {
  item: DOMRect;
  sub: DOMRect;
  px: number;
  py: number;
} | null;

/** Above MUI modal layers so the overlay is visible. */
const OVERLAY_Z = 2147483646;

function isLaidOutRect(r: DOMRect | undefined | null): boolean {
  if (r == null) return false;
  return (
    r.width > 0.5 &&
    r.height > 0.5 &&
    Number.isFinite(r.left) &&
    Number.isFinite(r.top)
  );
}

function useViewportSize(): { w: number; h: number } {
  const [vp, setVp] = useState(() =>
    typeof window !== "undefined"
      ? { w: window.innerWidth, h: window.innerHeight }
      : { w: 0, h: 0 },
  );
  useEffect(() => {
    const sync = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);
  return vp;
}

/**
 * `geom` stays `null` until measured. Triangle points stay `null` until
 * `geom` has laid-out rects — only then render the wedge (`polygon`).
 */
function trianglePointsOrNull(geom: Geom): string | null {
  if (geom == null) return null;
  const { item, sub, px, py } = geom;
  if (!isLaidOutRect(item) || !isLaidOutRect(sub)) return null;
  return cursorSubmenuWedgePolygon(px, py, sub)
    .map((p) => `${p.x},${p.y}`)
    .join(" ");
}

/**
 * Dev-only: Sort row, submenu paper, cursor → submenu left edge wedge.
 * `pointer-events: none`.
 */
export function SortSubmenuHoverZoneDebugOverlay({
  enabled,
  sortItemEl,
  submenuPaperRef,
  pointerRef,
}: SortSubmenuHoverZoneDebugOverlayProps): React.ReactElement | null {
  const [geom, setGeom] = useState<Geom>(null);
  const vp = useViewportSize();

  useEffect(() => {
    if (!enabled || !sortItemEl) {
      setGeom(null);
      return;
    }
    let raf = 0;
    let cancelled = false;
    const loop = () => {
      if (cancelled) return;
      const subEl = submenuPaperRef.current;
      const sub = subEl?.getBoundingClientRect() ?? null;
      const item = sortItemEl.getBoundingClientRect();
      const { x: px, y: py } = pointerRef.current;

      if (sub == null || !isLaidOutRect(sub) || !isLaidOutRect(item)) {
        setGeom(null);
        raf = requestAnimationFrame(loop);
        return;
      }

      setGeom({ item, sub, px, py });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [enabled, sortItemEl, submenuPaperRef, pointerRef]);

  if (!enabled || typeof document === "undefined" || vp.w === 0) {
    return null;
  }

  const triPoints: string | null = trianglePointsOrNull(geom);

  /** No overlay until rects + wedge string exist — avoids empty SVG / bogus frame. */
  if (geom == null || triPoints == null) {
    return null;
  }

  return createPortal(
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: OVERLAY_Z,
      }}
    >
      <svg
        width={vp.w}
        height={vp.h}
        viewBox={`0 0 ${vp.w} ${vp.h}`}
        style={{ display: "block" }}
        aria-hidden
      >
        <rect
          x={geom.item.left}
          y={geom.item.top}
          width={geom.item.width}
          height={geom.item.height}
          fill="none"
          stroke="#00c853"
          strokeWidth={2}
          strokeDasharray="5 3"
        />
        <rect
          x={geom.sub.left}
          y={geom.sub.top}
          width={geom.sub.width}
          height={geom.sub.height}
          fill="none"
          stroke="#2962ff"
          strokeWidth={2}
          strokeDasharray="5 3"
        />
        <polygon
          points={triPoints}
          fill="rgba(213, 0, 249, 0.26)"
          stroke="#d500f9"
          strokeWidth={2}
        />
        <circle
          cx={geom.px}
          cy={geom.py}
          r={4}
          fill="#d500f9"
          stroke="#fff"
          strokeWidth={1}
        />
        <text
          x={12}
          y={26}
          fill="#263238"
          fontSize={12}
          fontFamily="system-ui, sans-serif"
          fontWeight={600}
        >
          Wedge: cursor (dot) → submenu left edge (magenta)
        </text>
        <text
          x={12}
          y={44}
          fill="#546e7a"
          fontSize={11}
          fontFamily="system-ui, sans-serif"
        >
          Green = Sort row · Blue = submenu · Hit-test uses previous frame apex
        </text>
      </svg>
    </div>,
    document.body,
  );
}
