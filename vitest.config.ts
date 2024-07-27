/// <reference types="vitest" />

import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
    test: {
        globals: true,
        pool: "forks",
        fileParallelism: false,
        globalSetup: "./test/setup.ts",
        include: ["./test/*.test.ts"],
        reporters: ["default"],
        coverage: {
            provider: "v8",
        },
    },
    resolve: {
        alias: {
            "the-moby-effect": path.resolve(__dirname, "src"),
        },
    },
});
