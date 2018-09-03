module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.common.js'
      }
    }
  },
  extends: ['airbnb'],
  rules: {
    'global-require': 0,
    'no-plusplus': 0,
    'import/no-extraneous-dependencies': 0,
    'jsx-a11y/label-has-for': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'react/prop-types': 0,
    'react/destructuring-assignment': 0,
    'react/jsx-one-expression-per-line': 0,
  }
};
