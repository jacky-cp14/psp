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

## Development

```bash
pnpm dev    # run demo app
pnpm test   # run all tests
pnpm build  # build @psp/core
```
