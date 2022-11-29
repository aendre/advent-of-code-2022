module.exports = {
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: ['./tsconfig.json']
  },

  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
  ],
  rules: {
    'no-console': 'off',
    'no-new': 'off',
    'import/prefer-default-export': 'off',
    'object-curly-newline': ['error', {
      ObjectExpression: {
        consistent: true,
      },
      ObjectPattern: {
        multiline: true,
      },
      ImportDeclaration: 'never',
      ExportDeclaration: {
        multiline: true, minProperties: 3,
      },
    }],
  },
};

