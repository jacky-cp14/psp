# PSP

Monorepo for PSP list components.

## Packages

- **`@psp/core`** (`packages/psp-list-core`) — a thin MUI DataGrid wrapper providing dual-grid layout, keyboard navigation, print dialog, and column presets for PSP list views.
- **`psp-demo`** (`demo`) — development demo app for testing list views.

## Using `@psp/core` in another project

### 1. Clone and build

```bash
git clone <repo-url>
cd psp
pnpm install
pnpm build
```

### 2. Link into your project

From the consuming project root:

```bash
# pnpm
pnpm link <path-to-psp>/packages/psp-list-core

# npm
npm link <path-to-psp>/packages/psp-list-core
```

Both `pnpm link <path>` and `npm link <path>` accept a direct path and create a symlink — no global registration, works even though the package is marked `private`.

Then import:

```tsx
import { PspList } from '@psp/core';
```

### 3. After making changes

Rebuild before the consuming project can pick up updates:

```bash
cd <path-to-psp>
pnpm build
```

### Troubleshooting

**"Invalid hook call" (duplicate React)** — both projects bundle their own React. Alias it in the consuming project's bundler:

```ts
// vite.config.ts
resolve: {
  alias: {
    react: path.resolve('./node_modules/react'),
    'react-dom': path.resolve('./node_modules/react-dom'),
  },
}
```

```js
// webpack.config.js
resolve: {
  alias: {
    react: path.resolve('./node_modules/react'),
    'react-dom': path.resolve('./node_modules/react-dom'),
  },
}
```

**Link disappeared after `npm install` / `pnpm install`** — linking only creates a symlink, it doesn't write to `package.json`. Re-run the link command after reinstalling dependencies.

## Global Store (shared state across plugins)

`@psp/core` includes a global store that holds state shared across all plugins — language mode, frame mode, and any other cross-plugin state. The store is created at module scope, so when `@psp/core` is loaded as a Module Federation singleton, every plugin reads and writes to the **same store instance**. Changes in one plugin are immediately visible in all others.

### Module Federation config

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

`singleton: true` ensures one copy of the package — and therefore one store instance — across all plugins. `eager: true` on the host makes the store available before any remote initializes.

### Reading state

`usePspGlobal` is a React hook — it can only be called inside a component or another hook. The component re-renders only when the selected value changes.

```tsx
import { usePspGlobal } from '@psp/core';

function MyComponent() {
  // Subscribe to a single field — re-renders only when langMode changes
  const langMode = usePspGlobal((s) => s.langMode);

  return <div>{langMode === 'en' ? 'English' : '中文'}</div>;
}
```

You can select multiple fields:

```tsx
function StatusBar() {
  const { langMode, frameMode } = usePspGlobal((s) => ({
    langMode: s.langMode,
    frameMode: s.frameMode,
  }));

  return <div>{langMode} / {frameMode}</div>;
}
```

### Updating state

**`setPspState`** — generic setter, accepts any partial state:

```tsx
function SettingsPanel() {
  const setPspState = usePspGlobal((s) => s.setPspState);

  return (
    <>
      <button onClick={() => setPspState({ langMode: 'zh' })}>中文</button>
      <button onClick={() => setPspState({ langMode: 'en', frameMode: 'compact' })}>
        English + Compact
      </button>
    </>
  );
}
```

**Toggle helpers** — convenience actions for binary toggles:

```tsx
function Toolbar() {
  const toggleLang = usePspGlobal((s) => s.toggleLang);
  const toggleFrame = usePspGlobal((s) => s.toggleFrame);

  return (
    <>
      <button onClick={toggleLang}>Toggle Language</button>
      <button onClick={toggleFrame}>Toggle Frame</button>
    </>
  );
}
```

### Reading outside React

The store can also be read outside of components (e.g., in utility functions or event handlers):

```ts
import { usePspGlobal } from '@psp/core';

// Read current state (no subscription, no re-render)
const current = usePspGlobal.getState();
console.log(current.langMode); // 'en'

// Write state
usePspGlobal.getState().setPspState({ langMode: 'zh' });

// Subscribe to changes outside React
const unsub = usePspGlobal.subscribe((state) => {
  console.log('langMode changed to', state.langMode);
});
```

### Available state

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `langMode` | `'en' \| 'zh'` | `'en'` | Display language |
| `frameMode` | `'expand' \| 'compact'` | `'expand'` | Layout width |

### Adding new shared state

Add the field to `PspGlobalState` in `packages/psp-list-core/src/store/pspGlobalStore.ts`, set its default in the `create()` call, and it's immediately available via `setPspState`. No new setter needed.

## Development

```bash
pnpm dev    # run demo app
pnpm test   # run all tests
pnpm build  # build @psp/core
```
