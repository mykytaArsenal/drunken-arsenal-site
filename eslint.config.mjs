// eslint.config.mjs
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import nextPlugin from '@next/eslint-plugin-next'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettier from 'eslint-plugin-prettier'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Игнор
  {
    ignores: ['node_modules/', '.next/', 'dist/'],
  },

  // Базовые правила JS
  js.configs.recommended,

  // Рекомендованные правила TS
  ...tseslint.configs.recommended,

  // Основной конфиг для файлов проекта
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@next/next': nextPlugin,
      prettier: eslintPluginPrettier,
    },
    rules: {
      // Next core-web-vitals
      ...nextPlugin.configs['core-web-vitals'].rules,

      // Отключаем конфликтующие с Prettier правила
      ...(eslintConfigPrettier.rules ?? {}),

      // Ругаемся на неотформатированный код
      'prettier/prettier': 'error',

      // Твой кастом
      'linebreak-style': ['error', 'unix'],
    },
  },
]
