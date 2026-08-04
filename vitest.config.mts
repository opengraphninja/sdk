import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // The SDK is browser-only (it touches `document` and `btoa`).
    environment: "jsdom",
    globals: true,
    include: ["test/**/*.test.ts"],
  },
});
