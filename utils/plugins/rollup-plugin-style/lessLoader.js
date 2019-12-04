const less = require('less')
const chalk = require('chalk')

/**
 * 直接编译返回
 * 不需要options
 */

module.exports = {
  test: /\.less$/,
  process: (code, options) => {
    /* 直接返回code */
    return less.render(code, {
      javascriptEnabled: true,
      filename: options.from
    }).then(data => {
      return data.css
    }).catch(e => {
      console.warn(chalk.red('errors in lessLoader, please check the less files'))
      throw new Error(e.message)
    })
  }
}

