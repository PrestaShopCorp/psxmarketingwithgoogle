module.exports = {
    env: {
        node: true,
        es2022: true,
    },
    extends: [
        "prestashop",
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
    ],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
    },
    plugins: ["@typescript-eslint"],
    rules: {},
};
