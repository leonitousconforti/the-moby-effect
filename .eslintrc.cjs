module.exports = {
    root: true,
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:unicorn/recommended",
        "plugin:prettier/recommended",
    ],
    plugins: ["unicorn", "prettier"],
    env: { node: true, es2022: true },
    parser: "@typescript-eslint/parser",
    rules: {
        "no-console": "warn",
        "unicorn/no-array-callback-reference": "off",
        "@typescript-eslint/naming-convention": [
            "error",
            { format: null, selector: "parameter", filter: { regex: "^_", match: false } },
        ],
    },
    ignorePatterns: ["dist/", ".eslintrc.cjs"],
};
