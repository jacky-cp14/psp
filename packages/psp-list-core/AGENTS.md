# psp-list-core

## Architecture

PspList → PspListContext → DualGrid → two `DataGridPro(autoHeight)` in `PanelGroup`, wrapped by a shared scroll container div.

## Why autoHeight

Syncs vertical scroll between two independent grids: both expand fully, parent div scrolls both. **Cost**: disables virtualization → 400+ DOM rows → ~60ms render per selection change. Breaks DataGrid's built-in keyboard scroll → custom `useKeyboardNavigation` manages `scrollTop`.

## scrollOffset = 57

Row position in scroll container = `57 + index * rowHeight`. 57px = DataGrid root border-top (1px) + column headers (56px). Without it, scroll snaps 2 rows off. Re-measure if `headerHeight` or density changes.

## liveIndexRef pattern

Key repeat (~83ms) fires faster than React renders. `liveIndexRef` tracks index synchronously in the keydown handler; `navigatingRef` guards it from stale `selectedIndex` overwriting during pending renders.

## Keyboard nav: 3-layer instant feedback

The keydown handler does three things synchronously before React renders:

1. **`highlightRowVisually`** — Direct DOM toggle of `.Mui-selected` via `querySelectorAll('.MuiDataGrid-row[data-rowindex="N"]')`. Works across both grids in the dual-grid layout.
2. **`scrollToIndex`** — Direct `container.scrollTop` write. Accounts for `scrollOffset`.
3. **`startTransition(() => setState(...))`** — Defers the React re-render to low priority.

The browser paints steps 1+2 immediately after the handler returns. React renders step 3 in the background. Without `startTransition`, React's synchronous render (~60ms) blocks the main thread, preventing the browser from painting the DOM changes from steps 1+2 — making them invisible.

## DataGrid row styling

Prefer **`componentsProps.row`** over `sx` with `.MuiDataGrid-row` for row-level styles (e.g. cursor). GridRow receives slot props and merges them onto the root div; no internal class names. Example: `componentsProps: { row: { style: { cursor: 'pointer' } } }`. MUI docs: [Styling](https://mui.com/x/react-data-grid/style/), [Custom slots](https://mui.com/x/react-data-grid/components/) (slotProps.row / componentsProps.row).

## Debugging approach: Perf Lab isolation

When diagnosing perf, don't instrument the full component. Build up from scratch:

| Layer | What it adds | Measured cost |
|-------|-------------|---------------|
| L0 | Vanilla DataGridPro (virtualized) | Baseline, smooth |
| L1 | `autoHeight` (no virtualization) | Smooth, but breaks built-in scroll |
| L2 | + `useKeyboardNavigation` + external selection | ~45ms render, smooth |
| L3 | + dual grids in `PanelGroup` | ~50ms render, borderline |
| L4 | + PspListContext + full compound component | ~60ms render, laggy without fix |

This isolated the exact cost of each layer and proved the fix needed to target render blocking, not render cost.

## Do Not Retry

- **rAF batching for `onSelectionChange`** — +16ms latency, felt laggier. Ref-overwrite bug dropped ~15% of keypresses. React 18 auto-batching makes rAF redundant.
- **`scrollToIndex` without `scrollOffset`** — `index * rowHeight` misses 57px header → 2-row misalignment.
- **`setTimeout`/`sleep` as perf fix** — Doesn't reduce render cost, just redistributes lag.
- **DOM highlight without `startTransition`** — Browser can't paint while React's synchronous render blocks main thread. The DOM changes are invisible until render completes (~60ms), so `highlightRowVisually` alone is a no-op.
- **Assuming React render skips rows** — Logs proved every index was rendered and painted. The "skipping" was uneven frame cadence (78% jank in L3), not missing indices. Always verify with runtime data before fixing.
- **Guessing CSS selectors** — MUI DataGridPro v5 uses `.MuiDataGrid-row[data-rowindex="N"]` and `.Mui-selected`. Verify with `querySelectorAll` counts; zero matches = wrong selector or wrong container ref.
- **Styling rows via `sx` and `.MuiDataGrid-row`** — Fragile (internal class). Use `componentsProps.row` for row props/style instead.

## Perf Lab

`demo/lists/perf-lab.tsx` (repo root) — 5 layers (L0–L4) from vanilla DataGridPro to full PspList. Benchmark any architectural change here.
