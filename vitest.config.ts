import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        setupFiles: ["./test/setup-file.ts"],
        globalSetup: "./test/setup-global.ts",
        include: ["./test/**/*.test.ts"],
        coverage: {
            provider: "v8",
            include: ["src/**/*.ts"],
            exclude: ["src/generated/**/*.ts", "src/schemas/**/*.ts", "src/blob/**/*.ts"],
            reporter: ["cobertura", "text"],
        },
        reporters: ["default", "hanging-process", ["junit", { outputFile: "./coverage/junit.xml" }]],
    },
    server: {
        watch: {
            ignored: [
                "**/node_modules/**",
                "**/.git/**",
                "**/submodules/**",
                "**/patches/**",
                "**/dist/**",
                "**/build/**",
                "**/experiments/**",
                "**/coverage/**",
                "**/ui/**",
            ],
        },
    },
});
