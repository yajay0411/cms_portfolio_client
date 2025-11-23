// eslint.config.js

import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Plugins
import prettierPlugin from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

// Prettier flat config
import prettierConfig from 'eslint-config-prettier';

export default [
  // ⛔ Ignore folders
  {
    ignores: ['dist', 'node_modules', 'test-playwright', 'coverage', '*.cjs']
  },

  // =============================
  // 1️⃣ Untyped Linting (configs)
  // =============================
  {
    files: ['*.config.{js,ts,mjs,cjs}'],

    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node
    },

    plugins: {
      prettier: prettierPlugin
    },

    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },

  // =============================
  // 2️⃣ Typed Linting (src/**/*)
  // =============================
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,

  {
    files: ['src/**/*.{ts,tsx}'],

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        project: './tsconfig.app.json', // RUN TYPED RULES ONLY HERE
        tsconfigRootDir: import.meta.dirname
      }
    },

    plugins: {
      prettier: prettierPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },

    rules: {
      'prettier/prettier': 'error',

      // React hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Fast refresh
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
];
