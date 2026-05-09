const js = require('@eslint/js');
const globals = require('globals');
const vuePlugin = require('eslint-plugin-vue');
const vueParser = require('vue-eslint-parser');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  { ignores: ['dist/**', 'build/**', 'coverage/**', 'node_modules/**', 'playwright-report/**', 'test-results/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { ecmaVersion: 2022, globals: globals.browser },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }]
    }
  },
  {
    files: ['**/*.vue'],
    plugins: { vue: vuePlugin },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2022,
        sourceType: 'module',
        extraFileExtensions: ['.vue']
      },
      globals: globals.browser
    },
    rules: {
      ...vuePlugin.configs.recommended.rules,
      'no-console': ['warn', { allow: ['warn', 'error'] }]
    }
  }
);
