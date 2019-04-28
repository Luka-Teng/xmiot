exports.eslintRules = {
  "space-before-function-paren": ["error", "always"]
}

exports.tslintRules = {
  "space-before-function-paren": [true, "always"]
}

exports.prettierRules = {
  "semi": false,
  "bracketSpacing": true,
  "singleQuote": true
}

/* 
 * 不需要被格式化的文件
 * 这个放在这边感觉不好
 */
exports.ignores = [
  '**/entry/**/*.js',
  '**/index.common.js',
  '**/index.esm.js',
  '**/packageTemplates/**/*.js',
]