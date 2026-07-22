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
