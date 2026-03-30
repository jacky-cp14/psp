# @psp/core

MUI DataGrid wrapper for the dual-grid patient list layout. It takes rows and columns as props and renders the split-panel grid.

Includes keyboard navigation, multi-key sorting, a print dialog, a shared global store, and a singleton event bus so the host can react to patient selection from federated list plugins.

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

function NormalPatientList({ rows }: { rows: { id: string }[] }) {
  return (
    <>
      <SelectionPanel>Normal Patient List</SelectionPanel>
      <PspList
        rows={rows}
        leftColumns={leftColumns}
        rightColumns={rightColumns}
        sortOptions={sortOptions}
        defaultSortIndex={0}
      />
    </>
  );
}
```

`PspList` renders the dual-grid layout with keyboard navigation (Arrow keys, Home/End, PgUp/PgDn, Enter to submit), a right-click sort menu, sticky column headers, and theming. On double-click or Enter it notifies a **module-scoped patient-select bus** (see [Patient select](#patient-select-module-federation)) so the host can listen without wiring props through remotes. Pass `onPatientSelect` only when the list plugin needs an extra local callback; it runs **before** `usePatientSelectEvent` listeners in the shell.

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

### Patient select (Module Federation)

When the list runs inside a remote and the shell cannot pass callbacks through props, the host subscribes with `usePatientSelectEvent`. `PspList` notifies the shared singleton bus internally on submit (double-click or Enter). There is no separate `emit` API for plugins to call.

**Order:** (1) optional `onPatientSelect` on that `PspList` (plugin-local), (2) all `usePatientSelectEvent` listeners (e.g. host shell). With `@psp/core` shared as `singleton: true`, host and remotes share one listener set.

**Host (shell):**

```tsx
import { usePatientSelectEvent } from '@psp/core';

function AppShell() {
  usePatientSelectEvent((patient) => {
    // navigate, open chart, sync CMS session, etc.
    console.log('Selected patient', patient);
  });
  return <RemoteListSlot />;
}
```

**Remote (list plugin):** render `PspList` as usual. No wiring is required for the host to receive events. Pass `onPatientSelect` only if the plugin needs extra local handling; it runs before host listeners.

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
  onPatientSelect={(patient) => trackLocalSelection(patient)}
  {...rest}
/>
```

`onPatientSelect` is optional. Omit it when only the host needs to react — use `usePatientSelectEvent` in the shell instead.

### Exported types

```tsx
// Components
PspListProps, SelectionPanelProps, PrintDialogProps, PrintVariant

// Global store
PspGlobalStore, PspGlobalState, PspGlobalActions, LangMode, FrameMode

// Hooks (also exported as functions)
usePspGlobal, usePatientSelectEvent

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
| `onPatientSelect` | `(patient: T) => void` | — | Optional. Local callback on double-click or Enter; runs before host `usePatientSelectEvent` listeners. |
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

| State | Type | Default | Description |
|-------|------|---------|-------------|
| `langMode` | `'en' \| 'zh'` | `'en'` | Display language. |
| `frameMode` | `'expand' \| 'compact'` | `'expand'` | Layout width. |
| `defaultWard` | `string` | `''` | User's login ward, set once at init. |
| `currentWard` | `string` | `''` | Active ward selection, shared across all lists. |

| Action | Description |
|--------|-------------|
| `setPspState(patch)` | Merge partial state. |
| `toggleLang()` | Toggle `langMode` between `'en'` and `'zh'`. |
| `toggleFrame()` | Toggle `frameMode` between `'expand'` and `'compact'`. |
| `setDefaultWard(ward)` | Set `defaultWard` and reset `currentWard` to match. Called once by the consuming app at init. |
| `setCurrentWard(ward)` | Update `currentWard`. Called by list ward combo on select. |

The library does not fetch ward data. The consuming app must obtain the user's default ward (from a backend API or CMS session) and call `setDefaultWard(ward)` at plugin activation.

### `usePatientSelectEvent`

Subscribe in the host (or any component) to patient submit events from any `PspList` in the same singleton `@psp/core` instance. Fires after that list’s optional `onPatientSelect` (if any). The handler ref updates every render; you do not need `useCallback` on it. Unsubscribe runs on unmount.

```tsx
usePatientSelectEvent<MyPatient>((patient) => {
  navigate(`/chart/${patient.id}`);
});
```

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

`singleton: true` ensures one copy of the package, one Zustand store, and one patient-select event bus across all plugins. `eager: true` on the host makes shared module state available before any remote initializes.

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

---

## Session data: ExtJS → React mapping

The original ExtJS PSP ran inside a JSP-rendered iframe. Session data came from two sources: **server-injected `<script>` globals** (set by `cmsPSP.jsp` from Java session/DB) and **parent frame JS variables** (set by the CMS host window). Every list file read these bare globals directly.

In the React architecture, the CMS Hub provides session data through `@cmschassis/cms-js`. The PSP plugin reads it via `cms.api.session.get()`.

### Session constants (set once, read everywhere)

| Original ExtJS global | Source | React equivalent |
|---|---|---|
| `localHospCode` | JSP: `var localHospCode = "<%=hospCode%>"` | `cms.api.session.get().environment.hospitalCode` |
| `loginUser` | JSP: `var loginUser = "<%=loginId%>"` | `cms.api.session.get().user.cmsUserId` |
| `loginUser` (CORP ID) | JSP | `cms.api.session.get().user.corpId` |
| `pcEnv` | JSP: `var pcEnv = "PC"` | `cms.api.session.get().environment.os` + `.browser` |
| `loginUserSpecDesc` | JSP | `cms.api.session.get().user.specialtyCode` |

### Ward state (shared across lists 0, 1, 3, 6, 9)

| Original | Source | React equivalent |
|---|---|---|
| `top.parent.pspCurrentWard` | CMS parent frame `window` property, set from user login ward | No CMS API equivalent — PSP must fetch the user's default ward from a PSP config/user-profile API |
| `defaultWard` | Prototype property: `defaultWard: top.parent.pspCurrentWard` — captured once at JS parse time, never changes | Fetched once at PSP init, stored in Zustand global store as `defaultWard` |
| `currentWard` | Runtime: set by ward combo `select` handler per list | Zustand global store `currentWard` — survives list unmount/remount |
| `currentWardInfo.ward` | JSP-rendered shared JS object — bridge between PSP and parent frame | Replaced by the store; no cross-frame bridge needed |
| `top.parent.pspCurrentWard` (write-back) | Lists 0,1,3,9 write to parent frame on ward select | Not needed — ward state lives in the store, not the parent frame |

Ward state persistence across list switches: in ExtJS, `currentWardInfo.ward` and `top.parent.pspCurrentWard` acted as shared mutable state that all lists read on activate. In React, the Zustand store (`currentWard`) serves the same purpose — when a user selects a ward on list 0 then switches to list 1, list 1 reads `currentWard` from the store.

**The consuming app (parent) is responsible for wiring the default ward.** The library does not fetch ward data itself — it only stores and shares the value. At PSP plugin activation, the consuming app must obtain the user's default ward (from a PSP backend API, CMS session, or other source) and call `setDefaultWard(ward)` on the global store. This sets both `defaultWard` and `currentWard` to the same initial value. After that, individual lists call `setCurrentWard(ward)` when the user picks a different ward from the combo.

```typescript
// Consuming app — plugin activation
const ward = await fetchUserDefaultWard(userId, hospCode);
usePspGlobal.getState().setDefaultWard(ward);

// Inside a list component — ward combo select
const setCurrentWard = usePspGlobal((s) => s.setCurrentWard);
const handleWardChange = (ward: string) => setCurrentWard(ward);

// Any list reads the shared ward
const currentWard = usePspGlobal((s) => s.currentWard);
const defaultWard = usePspGlobal((s) => s.defaultWard);
const isNonDefaultWard = currentWard !== defaultWard;
```

### Configuration parameters (60+ `psp_*` globals)

In ExtJS, the JSP queried the `static_parameter` database table and rendered each value as an inline `<script>` variable (`var psp_show_mrn = "Y"`). All lists read these globals directly.

In React, PSP needs a **config API endpoint** that returns these as JSON:

```
GET /api/v1/psp/config?hospCode=QMH
→ { psp_normal_pat_list: "english", psp_show_mrn: "Y", psp_day_discharged_from_source: 7, ... }
```

Key config parameters used across multiple lists:

| Parameter | Lists | What it controls |
|---|---|---|
| `psp_alt_rowcolor_option` | ALL | Row color scheme (Y/G/B) |
| `psp_day_discharged_from_source` | 0,1,3,5,6,8,9 | Source code red-coloring threshold |
| `psp_show_mrn` | 0,2,3,4,6,7 | MRN column visibility |
| `psp_non_default_ward_color` | 0, 9 | Non-default ward row highlighting |
| `psp_non_default_ward_alt_color` | 0, 9 | Alternating rows in non-default highlight |
| `psp_team_non_default_ward_color` | 9 | Team list non-default ward color gate |
| `psp_choice_patient_list` | ALL | List availability/default bitmap |
| `psp_day_discharged_from_source` | 0,1,3,5,6,8,9 | Discharge day threshold |
| `pspEnableSearch` | ALL | Search field visibility |

### CMS session API reference (`@cmschassis/cms-js`)

```typescript
import cms from "./cms-plugin/cms-api-provider";

const session = cms.api.session.get();

session.environment.hospitalCode  // "QMH" — replaces localHospCode
session.environment.clinicCode    // "NTK" or undefined
session.environment.mode          // "clinic" | "ward" (CMS4X/4XE only)
session.environment.shell         // "4X" | "4XE" | "MX"
session.environment.os            // "ios" | "windows" | "android" | "macos"
session.user.cmsUserId            // "@CMSIT" — replaces loginUser
session.user.corpId               // "ABC123"
session.user.specialtyCode        // "MED"
session.user.departmentCode       // "MED"
session.patient?.patientKey       // selected patient (if any)
session.patient?.hkid
session.episode?.caseNo           // selected episode (if any)
session.episode?.wardCode         // patient's ward, NOT user's default ward

// Subscribe to changes (CMS MX only)
cms.api.session.subscribe(
  ({ episode }) => episode,
  (episode) => { /* handle episode change */ }
);
```
