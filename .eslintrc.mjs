/** @type {import('eslint').Linter.Config} */
export default {
  extends: ['next/core-web-vitals'],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
  },
  overrides: [
    {
      files: ['*.config.js', 'jest.setup.js', '.eslintrc.js'],
      env: {
        node: true,
      },
      rules: {
        // Add any custom rules here
      },
    },
  ],
};
