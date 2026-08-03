# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is yarn (yarn.lock, v1). Verified working on Node 24.

```sh
yarn install          # also runs `prepare` -> `yarn build`
yarn build            # tsdx build --format cjs,esm,umd --name OpenSourceNinja
yarn start            # tsdx watch
yarn test             # tsdx test (jest); add --ci in non-interactive runs
yarn test -t "name"   # run a single test by name
yarn test path/to/file.test.ts   # run a single test file
yarn lint             # tsdx lint src test (eslint + prettier); --fix to autofix
```

`yarn build` and `yarn install` work. Three commands **currently fail** on a clean checkout — treat as pre-existing, not something you broke:

- `yarn test` — `test/blah.test.ts` is untouched tsdx scaffolding importing a nonexistent `sum` from `../src`. There is effectively no test suite.
- `yarn lint` — 5 prettier errors (`src/index.ts`, `test/blah.test.ts`) plus a `no-throw-literal` warning for `src/api.ts:25`.
- `yarn size` / `yarn analyze` — the `size-limit` paths in package.json point at `dist/sdk.*` files the build never produces (see below).

Build toolchain is **tsdx 0.14**, which is archived and unmaintained. It bundles its own rollup/jest/eslint/prettier, so there are no separate config files for those — behaviour changes only via tsdx itself.

## Architecture

Standalone package (`@opengraphninja/sdk`, git remote `opengraphninja/sdk`). `open-graph-ninja-react` and `open-graph-ninja-web` are **sibling directories with their own git repos** — not a monorepo, no workspaces.

The whole library is two source files:

- `src/api.ts` — single fetch against `https://opengraph.ninja/api/v1?encodedUrl=<btoa(href)>`. The URL is base64-encoded via `btoa`, so this is browser-only. Non-ok responses `throw body` (a plain `{ error }` object, not an `Error`).
- `src/index.ts` — exports the sole public API, the **named** `initialize(options?)`. It queries `linkSelector` (default `main p > a:only-child`), skips links whose parent `<p>` has extra text or that sit under `[data-ogn-ignore]`, then replaces the parent element's `innerHTML` with the preview markup.

`src/types.d.ts` is a hand-written mirror of the API's `Details` payload (all OpenGraph/Twitter/Dublin Core/etc. metadata keys, with an `[key: string]: any` escape hatch).

Preview markup is built by string interpolation into `innerHTML` using third-party page metadata (`body.title`, `body.description`, image URL/alt) with no escaping. Any change to that template should keep this in mind.

`styles.css` lives at the repo root (not in `src`) and is shipped as-is; consumers import `@opengraphninja/sdk/styles.css`. Its class names (`.ogn-container`, `.ogn-image`, `.ogn-content`, `.ogn-title`, `.ogn-description`, `.ogn-url`) are the contract with the template in `src/index.ts` — rename in one place and you must rename in the other.

## Publishing and the naming mismatch

`prepare: npm run build` means `npm publish` rebuilds `dist` (gitignored, but shipped via `files`, along with `src` and `styles.css`).

The build's `--name OpenSourceNinja` (note: *Source*, not *Graph*) drives every output filename and the UMD global. Several declarations were never updated to match, and all of these are wrong today:

| Declared | Actual |
| --- | --- |
| `"module": "dist/sdk.esm.js"` (package.json) | `dist/opensourceninja.esm.js` |
| `size-limit` paths `dist/sdk.cjs.production.min.js`, `dist/sdk.esm.js` | `dist/opensourceninja.cjs.production.min.js`, `dist/opensourceninja.esm.js` |
| README UMD src `dist/umd/opengraphninja.umd.production.min.js` | `dist/opensourceninja.umd.production.min.js` (no `dist/umd/` dir) |
| README `window.OpenGraphNinja()` | global is `OpenSourceNinja`, and it's a namespace — call `.initialize()` |
| README `import initOpenGraphNinja from "@opengraphninja/sdk"` | no default export; use `import * as OpenGraphNinja` / `{ initialize }` |

Also: `dist/api.d.ts` emits `import { Details } from "./types"`, but tsc does not copy hand-written `.d.ts` files, so `dist/types.d.ts` doesn't exist and consumer type resolution breaks.

The README's `import "@opengraphninja/sdk/styles.css"` does work — there is no `exports` field, so it resolves by legacy path lookup. Adding an `exports` map would break it unless `./styles.css` is declared explicitly.
