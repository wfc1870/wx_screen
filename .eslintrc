module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module'
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // We are targeting on browser for this project, also with jquery support
  "env": {
    "browser": true,
    "jquery": true
  },
  // add your custom rules here
  'rules': {
    semi: ["error", "always"],          // 必须使用分号结尾
    quotes: ["off", "double"],          // 字符串引号不做单引号和双引号的限制
    eqeqeq: ["error", "smart"],         // 对于判断相等，采用smart的方式
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
