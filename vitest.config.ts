import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        setupFiles: ["./test/setup-file.ts"],
        globalSetup: "./test/setup-global.ts",
        include: ["./test/**/*.test.ts"],
        coverage: { provider: "v8", include: ["src/**/*.ts"], reporter: ["cobertura", "text"] },
        reporters: ["default", "hanging-process", ["junit", { outputFile: "./coverage/junit.xml" }]],
    },
    resolve: {
        alias: {
            "the-moby-effect": path.resolve(__dirname, "src"),
        },
    },
});
