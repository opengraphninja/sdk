# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is yarn (yarn.lock, v1).

```sh
yarn build            # tsup (cjs/esm/iife) + tsc for declarations
yarn dev              # tsup --watch
yarn test             # vitest run
yarn test:watch       # vitest
yarn test -t "name"   # run a single test by name
yarn test test/api.test.ts        # run a single test file
yarn typecheck        # tsc --noEmit (covers src, test and the config files)
yarn lint             # oxlint
yarn format           # oxfmt (in place); format:check to verify only
yarn size             # size-limit against the three bundles
```

All of the above pass on a clean checkout. `prepare` runs `build`, so `yarn install` and
`npm publish` both produce `dist`.

Two behaviours worth knowing:

- **`yarn lint` prints nothing and exits 0 when clean**, and oxlint's default severity for most
  rules is `warning`, which does **not** fail the command. If you need lint to gate anything, pass
  `--deny-warnings` — the scripts deliberately use oxlint/oxfmt defaults otherwise.
- **oxfmt formats markdown too**, including this file, at a 100-column default print width.

## Toolchain constraints

These are load-bearing; changing them tends to break the build in non-obvious ways.

- **Declarations come from `tsc -p tsconfig.build.json`, not from tsup.** tsup's dts builder injects
  the `baseUrl` compiler option, which TypeScript 6 deprecated and TypeScript 7 rejects outright.
  `tsup.config.ts` therefore has no `dts: true`.
- **`src/types.ts` must not be renamed back to `types.d.ts`.** tsc does not copy hand-written `.d.ts`
  files into `outDir`, so as a `.d.ts` it never reached `dist` while `dist/api.d.ts` still imported
  from `./types` — which broke type resolution for every consumer. It has to be a real `.ts` module.
- **jsdom is pinned to `^29`.** jsdom 30 requires Node `^24.15.0`; the dev machine runs 24.13.
- **`vitest.config.mts` needs the `.mts` extension.** As `.ts` it is loaded as CommonJS and Vite
  warns about the ESM syntax.
- Removing oxlint in favour of typescript-eslint would cap TypeScript at `<6.1.0` — that peer range
  is why the package sat on TS 6 before oxlint replaced eslint.

## Architecture

Standalone package (`@opengraphninja/sdk`, git remote `opengraphninja/sdk`). `open-graph-ninja-react`
and `open-graph-ninja-web` are **sibling directories with their own git repos** — not a monorepo, no
workspaces.

The whole library is two source files:

- `src/api.ts` — a single fetch against `https://opengraph.ninja/api/v1?encodedUrl=<btoa(href)>`. The
  URL is base64-encoded with `btoa`, so this is browser-only. Non-ok responses throw a real `Error`
  carrying the API's message, with the raw body as `cause`.
- `src/index.ts` — exports the sole public API, the **named** `initialize(options?)`. It queries
  `linkSelector` (default `main p > a:only-child`), skips links whose parent `<p>` holds other text
  or that sit under `[data-ogn-ignore]`, then replaces the parent's `innerHTML` with the preview.

`src/types.ts` is a hand-written mirror of the API's `Details` payload (OpenGraph/Twitter/Dublin
Core/etc. metadata keys, with an `[key: string]: any` escape hatch).

`initialize` is deliberately fire-and-forget: it starts one request per link and returns without
waiting. Don't change it to return a promise — that's a public API change. Tests poll with
`vi.waitFor` instead. Every skip condition is checked _before_ the request, so negative cases can be
asserted synchronously via `expect(fetchMock).not.toHaveBeenCalled()`.

The preview markup is assembled as a string from third-party `<meta />` content, so everything
interpolated into it goes through `escapeHtml` in `src/index.ts`. Keep that up if you touch the
template — `test/index.test.ts` has a regression test for it.

`styles.css` lives at the repo root (not in `src`) and ships as-is. Its class names
(`.ogn-container`, `.ogn-image`, `.ogn-content`, `.ogn-title`, `.ogn-description`, `.ogn-url`) are
the contract with the template in `src/index.ts` — rename in one place and you must rename in the
other. The `exports` map declares `./styles.css` explicitly; dropping that entry breaks
`import "@opengraphninja/sdk/styles.css"` for consumers.

## Build outputs

`--global-name OpenGraphNinja` and the keyed tsup entry drive the filenames:

| Output                                        | Format | Purpose                                           |
| --------------------------------------------- | ------ | ------------------------------------------------- |
| `dist/opengraphninja.js`                      | cjs    | `main`, `require`                                 |
| `dist/opengraphninja.mjs`                     | esm    | `module`, `import`                                |
| `dist/opengraphninja.min.js`                  | iife   | `unpkg`, `<script src>`; the only minified output |
| `dist/index.d.ts` + `api.d.ts` + `types.d.ts` | —      | emitted by tsc                                    |

Before 0.2.0 these were named `opensourceninja.*` (the build passed `--name OpenSourceNinja`), and
`package.json`/README pointed at a third set of names that never existed. If you change the entry key
or global name, update `main`/`module`/`unpkg`/`exports`, the `size-limit` paths, and the README's
unpkg URL together.
