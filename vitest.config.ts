import * as path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
    resolve: {
        tsconfigPaths: true,
    },
    test: {
        setupFiles: [path.join(__dirname, "test", "setup-file.ts")],
        globalSetup: [path.join(__dirname, "test", "setup-global.ts")],
        include: ["./test/**/*.test.ts"],
        fakeTimers: {
            toFake: undefined,
        },
        fileParallelism: false,
        sequence: {
            concurrent: true,
        },
        // Every concurrent test slot can be bootstrapping its own dind
        // container (docker build + boot + readiness wait) - on the 4-core CI
        // runners the default of 5 concurrent bootstraps contend so badly
        // that layer construction blows through its timeout.
        maxConcurrency: process.env["CI"] !== undefined ? 2 : 5,
        reporters: ["default", "hanging-process", ["junit", { outputFile: "./coverage/junit.xml" }]],
        coverage: {
            provider: "v8",
            include: ["src/**/*.ts"],
            exclude: ["src/generated/**/*.ts", "src/schemas/**/*.ts", "src/blob/**/*.ts"],
            reporter: ["cobertura", "text"],
            reportsDirectory: "coverage",
        },
    },
});
