module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': 0,
    semi: ['error', 'never'],
    'linebreak-style': 0,
    'prefer-destructuring': 0,
    'no-alert': 0,
    'consistent-return': 0,
    'no-template-curly-in-string': 0,
  },
}
