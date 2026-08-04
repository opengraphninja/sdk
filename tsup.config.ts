import { defineConfig } from "tsup";

// The entry is keyed so every output is named `opengraphninja.*` rather than
// `index.*` — the script-tag/unpkg URL in the README points straight at it.
const entry = { opengraphninja: "src/index.ts" };
const target = "es2020";

export default defineConfig([
  {
    entry,
    target,
    format: ["cjs", "esm"],
    // Declarations come from `tsc -p tsconfig.build.json` — see that file.
    sourcemap: true,
    clean: true,
  },
  {
    // Loaded directly in a browser via <script src>, so this is the only
    // output worth minifying — bundlers handle that for cjs/esm themselves.
    entry,
    target,
    format: ["iife"],
    globalName: "OpenGraphNinja",
    minify: true,
    sourcemap: true,
    outExtension: () => ({ js: ".min.js" }),
  },
]);
