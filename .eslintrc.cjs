// This is a workaround for https://github.com/eslint/eslint/issues/3458
require("@rushstack/eslint-config/patch/modern-module-resolution");

module.exports = {
    root: true,
    extends: [
        "@rushstack/eslint-config/profile/node",
        "@rushstack/eslint-config/mixins/tsdoc",
        "@rushstack/eslint-config/mixins/friendly-locals",
        "plugin:unicorn/recommended",
        "plugin:prettier/recommended",
    ],
    plugins: ["unicorn", "prettier"],
    env: { node: true, es2022: true },
    parser: "@typescript-eslint/parser",
    parserOptions: { ecmaVersion: 2022, sourceType: "module" },
    rules: {
        "no-console": "warn",
        "tsdoc/syntax": "off",
        "unicorn/no-array-callback-reference": "off",
        "@typescript-eslint/naming-convention": [
            "error",
            { format: null, selector: "parameter", filter: { regex: "^_", match: false } },
        ],
    },
    overrides: [
        {
            files: ["./src/schemas.ts"],
            rules: {
                "max-lines": "off",
                "@typescript-eslint/typedef": "off",
                "unicorn/prevent-abbreviations": "off",
            },
        },
        {
            files: ["./examples/**/*.ts"],
            rules: {
                "no-console": "off",
            },
        },
    ],
    ignorePatterns: ["dist/", ".eslintrc.cjs"],
};
