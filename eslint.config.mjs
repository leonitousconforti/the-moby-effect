import * as effectEslint from "@effect/eslint-plugin";
import eslint from "@eslint/js";
import * as tsResolver from "eslint-import-resolver-typescript";
import importPlugin from "eslint-plugin-import-x";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import sortDestructureKeys from "eslint-plugin-sort-destructure-keys";
import * as Path from "node:path";
import * as Url from "node:url";
import tseslint from "typescript-eslint";

const __filename = Url.fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);

export default tseslint.config(
    {
        ignores: ["**/dist", "**/build", "**/docs", "**/*.md"],
    },
    eslint.configs.recommended,
    tseslint.configs.strict,
    importPlugin.flatConfigs.recommended,
    importPlugin.flatConfigs.typescript,
    effectEslint.configs.dprint,
    {
        plugins: {
            "simple-import-sort": simpleImportSort,
            "sort-destructure-keys": sortDestructureKeys,
        },

        languageOptions: {
            parser: tseslint.parser,
            ecmaVersion: 2018,
            sourceType: "module",
        },

        settings: {
            "import-x/resolver": {
                name: "tsResolver",
                resolver: tsResolver,
                options: {
                    alwaysTryTypes: true,
                },
            },
        },

        rules: {
            "no-console": "error",
            "object-shorthand": "error",
            "@typescript-eslint/no-namespace": "off",
            "@typescript-eslint/no-empty-object-type": "off",
            "@typescript-eslint/no-non-null-assertion": "warn",
            "sort-destructure-keys/sort-destructure-keys": "error",
            "prefer-destructuring": "off",
            "sort-imports": "off",
            "import-x/export": "off",
            "import-x/first": "error",
            "import-x/newline-after-import": "error",
            "import-x/no-duplicates": "error",
            "import-x/no-named-as-default-member": "off",
            "import-x/no-unresolved": "off",
            "import-x/order": "off",
            "simple-import-sort/imports": "off",
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
            // "@effect/dprint": [
            //     "error",
            //     {
            //         config: {
            //             indentWidth: 2,
            //             lineWidth: 120,
            //             semiColons: "asi",
            //             quoteStyle: "alwaysDouble",
            //             trailingCommas: "never",
            //             operatorPosition: "maintain",
            //             "arrowFunction.useParentheses": "force",
            //         },
            //     },
            // ],
        },
    }
);
