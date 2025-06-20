import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import reactPlugin from 'eslint-plugin-react'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tseslint from 'typescript-eslint'

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
      'unused-imports': unusedImports,
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
              pattern: './interface',
              group: 'sibling',
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
      'unused-imports/no-unused-imports': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react/prop-types': 'off',
    },
  },
]
