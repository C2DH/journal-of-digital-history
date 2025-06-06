import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import importPlugin from 'eslint-plugin-import'
import globals from 'globals'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      react: reactPlugin,
      import: importPlugin,
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node.js builtins like fs, path
            'external', // External libraries
            'internal', // Aliased internal modules (e.g., '@/components')
            ['parent', 'sibling'], // Relative imports
            'index', // index.ts
            'object', // Side-effect / CSS imports (we'll map them here)
          ],
          pathGroups: [
            {
              pattern: 'react|react-dom',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '**/*.+(css|scss|sass|less|styl)',
              group: 'object',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['react', 'react-dom'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react/prop-types': 'off',
    },
  },
]
