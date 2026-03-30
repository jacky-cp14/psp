# @psp/core

MUI DataGrid wrapper for the dual-grid patient list layout. It takes rows and columns as props and renders the split-panel grid.

Includes keyboard navigation, multi-key sorting, a print dialog, and a shared global store.

## Basic usage

```tsx
import type { GridColDef } from '@mui/x-data-grid-pro';
import { PspList, SelectionPanel } from '@psp/core';
import type { SortOption } from '@psp/core';

const leftColumns: GridColDef[] = [
  { field: 'wardCode', headerName: 'Ward', width: 65 },
  { field: 'bed', headerName: 'Bed', width: 100 },
  { field: 'name', headerName: 'English Name', flex: 1, minWidth: 200 },
];

const rightColumns: GridColDef[] = [
  { field: 'caseNo', headerName: 'Episode', width: 152 },
  { field: 'admissionDtm', headerName: 'Admission Date/Time', type: 'dateTime', width: 202 },
  { field: 'sexAge', headerName: 'Sex/Age', width: 82 },
];

const sortOptions: SortOption[] = [
  {
    label: 'By Ward → Bed → Name',
    keys: [
      { field: 'wardCode', direction: 'ASC' },
      { field: 'bed', direction: 'ASC' },
      { field: 'name', direction: 'ASC' },
    ],
  },
  {
    label: 'By Admission Date',
    keys: [{ field: 'admissionDtm', direction: 'ASC' }],
  },
];

function NormalPatientList({ rows, onPatientSelect }) {
  return (
    <>
      <SelectionPanel>Normal Patient List</SelectionPanel>
      <PspList
        rows={rows}
        leftColumns={leftColumns}
        rightColumns={rightColumns}
        sortOptions={sortOptions}
        defaultSortIndex={0}
        onPatientSelect={onPatientSelect}
      />
    </>
  );
}
```

`PspList` renders the dual-grid layout with keyboard navigation (Arrow keys, Home/End, PgUp/PgDn, Enter to submit), a right-click sort menu, sticky column headers, and theming.

Every row must have an `id: string` field.

---

### Custom sort comparators

Some fields like "Sex/Age" (`M/72`) or priority codes don't sort correctly as strings. You can override comparison per sort key with `compare`:

```tsx
const sortOptions: SortOption[] = [
  {
    label: 'By Age',
    keys: [
      { field: 'sexAge', direction: 'ASC', compare: (a, b) => parseAge(a) - parseAge(b) },
    ],
  },
  {
    label: 'By Priority (numeric), then Name',
    keys: [
      { field: 'priority', direction: 'ASC', compare: 'numeric' },
      { field: 'name', direction: 'ASC' },
    ],
  },
];
```

Built-in presets: `'string'`, `'numeric'`, `'dateTime'`. Column types (`type: 'number'`, `type: 'dateTime'` on `GridColDef`) are auto-detected, so you only need explicit `compare` when the default doesn't work.

### Column header sorting

Users can click column headers to sort (standard DataGrid behavior). Column header sort takes precedence over the right-click sort preset. Clicking a sort preset clears the column header sort.

### Print dialog

Some lists need multiple print formats (e.g. English/Chinese, with/without inline spacing). `PrintDialog` lets the user pick a variant before printing:

```tsx
import { useState } from 'react';
import { PrintDialog } from '@psp/core';

function ListWithPrint() {
  const [printOpen, setPrintOpen] = useState(false);

  return (
    <>
      <button onClick={() => setPrintOpen(true)}>Print</button>
      <PrintDialog
        open={printOpen}
        onClose={() => setPrintOpen(false)}
        onPrint={(variant) => {
          console.log('Print variant:', variant);
        }}
        variants={[
          { label: 'English', value: 'en' },
          { label: 'Chinese', value: 'zh' },
          { label: 'English with Inline Space', value: 'en-space' },
          { label: 'Chinese with Inline Space', value: 'zh-space' },
        ]}
      />
    </>
  );
}
```

Omit `variants` for a single "Standard Print" option.

### Global store

When multiple plugins run in the same page (Module Federation), they need to share state like the current language and layout mode. `usePspGlobal` is a singleton store that handles this. It's created at module scope, so as long as `@psp/core` is shared as a singleton in the federation config, every plugin reads and writes to the same instance.

```tsx
import { usePspGlobal } from '@psp/core';

function LanguageToggle() {
  const langMode = usePspGlobal((s) => s.langMode);
  const toggleLang = usePspGlobal((s) => s.toggleLang);
  return <button onClick={toggleLang}>{langMode === 'en' ? '中文' : 'ENG'}</button>;
}
```

#### Outside React

If you need to read or write from outside a component (e.g. in a utility function or event handler), use `getState()`:

```ts
import { usePspGlobal } from '@psp/core';

const current = usePspGlobal.getState();
console.log(current.langMode); // 'en'

usePspGlobal.getState().setPspState({ langMode: 'zh' });

const unsub = usePspGlobal.subscribe((state) => {
  console.log('langMode changed to', state.langMode);
});
```

#### Adding new shared state

Add the field to `PspGlobalState` in `packages/psp-list-core/src/store/pspGlobalStore.ts` and set its default in the `create()` call. It becomes available through `setPspState` immediately.

### Customizing appearance

Row height (default 28px):

```tsx
<PspList rowHeight={36} {...rest} />
```

Panel split (default 35% left, 65% right):

```tsx
<PspList defaultSplit={40} {...rest} />
```

Row color scheme (default `'gray'`):

```tsx
<PspList colorScheme="blue" {...rest} />
```

Custom row classes (composed with built-in striping):

```tsx
<PspList
  getRowClassName={(params) => (params.row.isUrgent ? 'urgent-row' : '')}
  {...rest}
/>
```

---

## TypeScript

All props and types are exported. `PspList` accepts a generic for the row type:

```tsx
import { PspList } from '@psp/core';
import type { PspListProps, SortOption } from '@psp/core';

interface MyPatient {
  id: string;
  name: string;
  wardCode: string;
  admissionDtm: string;
}

<PspList<MyPatient>
  rows={patients}
  onPatientSelect={(patient) => openChart(patient.wardCode)}
  {...rest}
/>
```

### Exported types

```tsx
// Components
PspListProps, SelectionPanelProps, PrintDialogProps, PrintVariant

// Global store
PspGlobalStore, PspGlobalState, PspGlobalActions, LangMode, FrameMode

// Sorting
SortOption, SortKey, SortDirection, SortComparePreset, SortCompare
```

---

## API reference

### `<PspList>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rows` | `T[]` | — | Row data. Each row must have `id: string`. |
| `leftColumns` | `GridColDef[]` | — | Left grid columns (identifiers). |
| `rightColumns` | `GridColDef[]` | — | Right grid columns (details). |
| `sortOptions` | `SortOption[]` | — | Right-click sort presets. |
| `defaultSortIndex` | `number \| null` | `null` | Initial sort preset index. `null` preserves server order. |
| `onPatientSelect` | `(patient: T) => void` | — | Called on double-click or Enter. |
| `defaultSplit` | `number` | `35` | Left panel width (%). |
| `rowHeight` | `number` | `28` | Row height in px. |
| `colorScheme` | `RowColorScheme` | `'gray'` | Alternating row color scheme. |
| `getRowClassName` | `(params: GridRowParams) => string` | — | Additional row CSS classes. |
| `pageSize` | `number` | `12` | Rows per PgUp/PgDn jump. |

### `<SelectionPanel>`

Styled header bar. Pass children as the title text.

```tsx
<SelectionPanel>Normal Patient List</SelectionPanel>
```

### `<PrintDialog>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Controls dialog visibility. |
| `onClose` | `() => void` | — | Close handler. |
| `onPrint` | `(variant: string) => void` | — | Called with the selected variant value. |
| `variants` | `PrintVariant[]` | `[{ label: 'Standard Print', value: 'standard' }]` | Print format options. |
| `title` | `string` | `'Print Patient List'` | Dialog title. |

### `usePspGlobal`

Use a selector to only re-render when the selected value changes:

```tsx
const lang = usePspGlobal((s) => s.langMode);
```

Calling without a selector re-renders on every store change:

```tsx
const store = usePspGlobal();
```

| State | Type | Default |
|-------|------|---------|
| `langMode` | `'en' \| 'zh'` | `'en'` |
| `frameMode` | `'expand' \| 'compact'` | `'expand'` |

| Action | Description |
|--------|-------------|
| `setPspState(patch)` | Merge partial state. |
| `toggleLang()` | Toggle `langMode` between `'en'` and `'zh'`. |
| `toggleFrame()` | Toggle `frameMode` between `'expand'` and `'compact'`. |

---

## Architecture

`PspList` wraps `ThemeProvider` → `PspListProvider` → `SortMenu` → `DualGrid`, which renders two `DataGridPro` instances with `autoHeight` inside a `PanelGroup`, wrapped by a shared scroll container.

Both grids expand to full height (no virtualization). A single parent div scrolls both. Column headers stay pinned via JS `transform: translateY(scrollTop)` on every scroll event.

Keyboard navigation runs three steps synchronously before React renders: DOM highlight toggle, scroll position write, then `startTransition` for the state update. The browser paints the first two immediately while React handles the third in the background. This keeps arrow key repeat (~83ms) responsive with 400+ rows in the DOM.

---

## Setup

### Packages

- **`@psp/core`** (`packages/psp-list-core`) — the library
- **`psp-demo`** (`demo`) — development demo app

### Using in another project

Clone, build, and link:

```bash
git clone <repo-url>
cd psp
pnpm install
pnpm build
```

From the consuming project root:

```bash
pnpm link <path-to-psp>/packages/psp-list-core
```

Then import:

```tsx
import { PspList } from '@psp/core';
```

Rebuild after making changes:

```bash
cd <path-to-psp>
pnpm build
```

### Module Federation

Mark `@psp/core` as a singleton in every federated app (host and all remotes):

```js
// webpack.config.js
new ModuleFederationPlugin({
  shared: {
    '@psp/core': { singleton: true, eager: true },
    react:       { singleton: true },
    'react-dom': { singleton: true },
  },
});
```

`singleton: true` ensures one copy of the package and one store instance across all plugins. `eager: true` on the host makes the store available before any remote initializes.

### Troubleshooting

**"Invalid hook call" (duplicate React)** — both projects are bundling their own copy of React. Alias it in the consuming project's bundler config:

```ts
// vite.config.ts
resolve: {
  alias: {
    react: path.resolve('./node_modules/react'),
    'react-dom': path.resolve('./node_modules/react-dom'),
  },
}
```

**Link disappeared after `pnpm install`** — linking creates a symlink but doesn't write to `package.json`. Re-run the link command after reinstalling dependencies.

### Peer dependencies

```
react >= 17.0.0
react-dom >= 17.0.0
```

Bundled dependencies (not required to install separately):

- `@mui/x-data-grid-pro` v5
- `@mui/material` v5
- `react-resizable-panels` v2
- `zustand` v5

---

## Development

```bash
pnpm dev    # run demo app
pnpm test   # run all tests
pnpm build  # build @psp/core
```
