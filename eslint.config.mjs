import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  prettier,
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    ignores: ["node_modules/", "dist/"],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 2022,
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": tseslint
    },
    rules: {
      // Error on unused variables
      "no-unused-vars": "off", // Turning off base rule
      "@typescript-eslint/no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrors": "all",
        "caughtErrorsIgnorePattern": "^_"
      }],

      // Enforce single quotes
      "quotes": ["error", "single"],

      // Prevent common/generic variable names
      "id-denylist": ["error", 
        "data",
        "item",
        "items",
        "value",
        "values",
        "obj",
        "object",
        "temp",
        "tmp",
        "foo",
        "bar"
      ],

      // Enforce meaningful variable names (min 2 chars, with exceptions)
      // "id-length": ["error", { 
      //   "min": 2,
      //   "exceptions": ["i", "j", "k", "x", "y", "z"] 
      // }],

      // Strict TypeScript rules
      // "@typescript-eslint/no-explicit-any": "error", // Prevent 'any' type
      // "@typescript-eslint/explicit-function-return-type": "error", // Require return types
      "@typescript-eslint/explicit-member-accessibility": "error", // Require accessibility modifiers
      "@typescript-eslint/no-non-null-assertion": "error", // Prevent non-null assertions

      // Code style and best practices
      "semi": ["error", "always"], // Require semicolons
      "no-console": "warn", // Warn on console.log usage
      "eqeqeq": ["error", "always"], // Require === and !==
      "no-var": "error", // Prevent var usage
      "prefer-const": "error", // Prefer const over let
      "no-multiple-empty-lines": ["error", { "max": 1 }], // Max one empty line
      "max-len": ["error", { "code": 100 }], // Max line length
      // "complexity": ["error", 12], // Max cyclomatic complexity
      "no-redeclare": "off",

      // Function rules
      "max-params": ["error", 5], // Max 3 parameters per function
      "max-lines-per-function": ["error", 100], // Max 50 lines per function

      // Object rules
      "object-curly-spacing": ["error", "never"], // меняем с "always" на "never"
      "object-shorthand": ["error", "always"], // Use object shorthand

      // Array rules
      "array-callback-return": "error", // Require return in array methods
      "prefer-spread": "error", // Prefer spread operator

      // Error handling
      "no-throw-literal": "error", // Only throw Error objects
      "handle-callback-err": "error", // Handle callback errors

      // Import/Export rules
      "sort-imports": ["error", {
        "ignoreCase": true,
        "ignoreDeclarationSort": true
      }],

      // Пробелы после if
      "keyword-spacing": ["error", {
        "before": true, // пробел перед скобкой
        "after": true   // пробел после ключевого слова
      }],

      "padding-line-between-statements": [ "error", {
        blankLine: "always",
        prev: "*",
        next: "if"
      }]
    }
  }
];