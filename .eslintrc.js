module.exports = {
  'extends': 'airbnb-base',
  'env': {
      'browser': false,
      'node': true,
      'jest': true
  },
  'rules': {
      // enable additional rules
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
      'no-unused-vars':['error',{'args':'all'}],
      'no-console': 'off', // default is warning
      // disable rules from base configurations
      'import/no-extraneous-dependencies': 'off',
      'import/no-unresolved': 'off',
      'arrow-body-style': ['error', 'always'],
      'no-use-before-define': 'off',
      'no-underscore-dangle': 'off',
      'no-prototype-builtins': 'off',
      'no-useless-escape': 'off',
      'no-undef': 'off',
  },
  'parserOptions': {
      'ecmaVersion': 2017,
      'sourceType': 'module',
  },
}
// dont' use resolver lib dependency 
// https://github.com/benmosher/eslint-plugin-import/issues/496