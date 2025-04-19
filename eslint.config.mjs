import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import configPrettier from "eslint-config-prettier";
import pluginImport from "eslint-plugin-import";
import pluginPromise from "eslint-plugin-promise";

/**
 * Configure ESLint rules for import order.
 * @type {import('typescript-eslint').InfiniteDepthConfigWithExtends}
 */
const importConfig = {
  extends: [
    pluginImport.flatConfigs.recommended,
    pluginImport.flatConfigs.typescript,
  ],
  rules: {
    "import/order": [
      "error",
      {
        groups: [
          "builtin", // Node.js built-in modules
          "external", // npm packages
          "internal", // paths aliased in tsconfig
          "parent", // imports from parent directories
          "sibling", // imports from sibling directories
          "index", // imports from the same directory
          "object", // object imports
          "type", // type imports
        ],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
};

const promiseConfig = {
  extends: [pluginPromise.configs["flat/recommended"]],
};

export default tseslint.config([
  // Ignore the following files and add globals for Node and Vitest
  {
    ignores: ["**/dist/**"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.vitest,
      },
    },
  },

  // JS
  eslint.configs.recommended,

  // TS
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    // Adds type information to the linting process
    // @see https://typescript-eslint.io/getting-started/typed-linting/
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  importConfig,
  promiseConfig,

  // (!) Keep Prettier last so it gets the chance to override all other configs
  configPrettier,
]);
