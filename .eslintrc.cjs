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
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json", "./tsconfig.base.json"],
    },
    rules: {
        "no-console": "warn",
    },
    overrides: [
        {
            files: ["./src/api.ts"],
            rules: {
                "max-lines": "off",
                "tsdoc/syntax": "off",
                "dot-notation": "off",
                "require-yield": "off",
                "@typescript-eslint/typedef": "off",
                "unicorn/prevent-abbreviations": "off",
                "unicorn/no-array-callback-reference": "off",
                "@typescript-eslint/naming-convention": [
                    "error",
                    { format: null, selector: "parameter", filter: { regex: "^_", match: false } },
                ],
            },
        },
        {
            files: ["./gen/main.cts"],
            rules: {
                "unicorn/prefer-module": "off",
            },
        },
    ],
    ignorePatterns: ["dist/", ".eslintrc.cjs"],
};
