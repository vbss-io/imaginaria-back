import js from "@eslint/js"
import prettier from "eslint-plugin-prettier"
import { defineConfig } from "eslint/config"
import globals from "globals"
import tseslint from "typescript-eslint"

export default defineConfig([
  {
    ignores: [
      "build/**",
      "coverage/**",
      "logs/**",
      "node_modules/**",
    ]
  },
  { files: ["**/*.{js,mjs,cjs,ts}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: ".",
        sourceType: "module"
      }
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "prettier": prettier
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/consistent-type-imports": ["error", { "prefer": "type-imports" }],
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "no-debugger": "error",
      "no-duplicate-imports": "error",
      "no-unused-expressions": "error",
      "no-var": "error",
      "prefer-const": "error",
      "prefer-arrow-callback": "error",
      "prefer-template": "error",
      "eqeqeq": ["error", "always"],
      "no-multiple-empty-lines": ["error", { "max": 1 }],
      "prettier/prettier": ["error", {
        "semi": false,
        "trailingComma": "none",
        "singleQuote": true,
        "printWidth": 120,
        "tabWidth": 2,
        "useTabs": false,
        "bracketSpacing": true,
        "arrowParens": "always",
        "endOfLine": "auto"
      }]
    }
  }
])
