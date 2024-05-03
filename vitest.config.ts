/// <reference types="vitest" />

import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
    test: {
        include: ["./test/**/*.test.ts"],
        globals: true,
        coverage: {
            provider: "v8",
        },
        reporters: ["hanging-process", "github-actions", "default"],
    },
    resolve: {
        alias: {
            "the-wireguard-effect": path.resolve(__dirname, "src"),
        },
    },
});
