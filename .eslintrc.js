// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier", // Integración con Prettier
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    // Habilita `fixAll.eslint` al guardar
    "prettier/prettier": ["error", { endOfLine: "never" }],
  },
  settings: {
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true,
    },
    "[typescript]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.formatOnSave": true,
    },
  },
};
