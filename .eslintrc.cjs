module.exports = {
    env: {
        browser: true,
        es2018: true,
        node: true,
        mocha: true,
    },
    extends: "eslint:recommended",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    rules: {
        "no-cond-assign": 0,
    },
};
