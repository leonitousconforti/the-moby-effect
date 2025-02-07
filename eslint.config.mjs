import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import codegen from "eslint-plugin-codegen";
import prettierPlugin from "eslint-plugin-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import sortDestructureKeys from "eslint-plugin-sort-destructure-keys";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    {
        ignores: ["**/dist", "**/build", "**/docs", "**/*.md", "src/index.ts"],
    },
    ...compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        // FIXME: Enable this when the plugin is available
        // "plugin:@effect/recommended",
        "plugin:prettier/recommended"
    ),
    {
        plugins: {
            "sort-destructure-keys": sortDestructureKeys,
            "simple-import-sort": simpleImportSort,
            prettier: prettierPlugin,
            codegen,
        },

        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2022,
            sourceType: "module",
        },

        settings: {
            "import/parsers": {
                "@typescript-eslint/parser": [".ts", ".tsx"],
            },

            "import/resolver": {
                typescript: {
                    alwaysTryTypes: true,
                },
            },
        },

        rules: {
            "no-console": "warn",
            "no-case-declarations": "off",
            "codegen/codegen": "error",
            "object-shorthand": "error",
            "@typescript-eslint/no-namespace": "off",
            "@typescript-eslint/no-empty-object-type": "off",
            "sort-destructure-keys/sort-destructure-keys": "error",
            "@typescript-eslint/array-type": ["warn", { default: "generic", readonly: "generic" }],
            "@typescript-eslint/consistent-type-imports": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],
            "@effect/dprint": "off",
        },
    },
];
