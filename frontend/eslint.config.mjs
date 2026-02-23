import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

import tseslint from 'typescript-eslint'
import prettierPlugin from 'eslint-plugin-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: 'readonly',
      },
    },
    plugins: {
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],

      'prettier/prettier': 'error',

      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
      'no-alert': 'warn',

      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            ['^react$', '^react/'],
            ['^@?\\w'],
            ['^@auth', '^@public', '^@admin', '^@error'],
            ['^@/'],
            ['^\\.\\.(?!/?$)', '^\\./'],
            ['\\.css$', '\\.scss$', '\\.less$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'warn',

      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
    },
  },

  globalIgnores([
    'node_modules/**',
    '.next/**',
    'out/**',
    'dist/**',
    'build/**',
    'next-env.d.ts',
    'public/vendor/**',
  ]),
])
