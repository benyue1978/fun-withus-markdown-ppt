module.exports = {
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
    // Add any custom rules here
  },
  overrides: [
    {
      files: ['*.config.js', 'jest.setup.js'],
      env: {
        node: true,
      },
      rules: {
        'no-undef': 'off',
      },
    },
  ],
};
