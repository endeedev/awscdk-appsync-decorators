const eslint = require('@eslint/js');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const globals = require('globals');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
    {
        ignores: ['**/dist/**'],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...tseslint.configs.stylistic,
    {
        plugins: {
            'simple-import-sort': simpleImportSort,
        },
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
        rules: {
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
        },
    },
    {
        files: ['**/*.js'],
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
        },
    },
);
