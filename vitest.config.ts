/// <reference types="vitest" />

import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
    test: {
        globals: true,
        setupFiles: ["./test/setup-file.ts"],
        globalSetup: "./test/setup-global.ts",
        include: ["./test/**/*.test.ts"],
        reporters: ["default"],
        coverage: {
            provider: "v8",
        },
    },
    server: {
        watch: {
            ignored: [
                "**/node_modules/**",
                "**/.git/**",
                "**/submodules/**",
                "**/reflection/**",
                "**/docs/**",
                "**/examples/**",
            ],
        },
    },
    resolve: {
        alias: {
            "the-moby-effect": path.resolve(__dirname, "src"),
        },
    },
});
