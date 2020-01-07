const postcss = require('postcss')
const chalk = require('chalk')
const path = require('path')
const base64 = require('postcss-base64')
const cssnano = require('cssnano')
const lessLoader = require('./lessLoader')
const { series } = require('./utils')

module.exports = {
  /* 目前只开放less，css */
  test: /(\.less$)|(\.css$)/,
  process: (code, options) => {
    const { id, plugins = [], extract } = options

    /* 需要被引入的loaders */
    const loaders = []

    /* 根据路径判断是否需要某个loader的支持 */
    const registerLoader = loader => {
      if (loader.test.test(id)) {
        loaders.push(loader.process)
      }
    }

    /* 目前只开放less注册, 最后要统一经过postcss处理 */
    registerLoader(lessLoader)
    loaders.push((code, options) => {
      return postcss(poscssPlugins)
        .process(code, options)
        .then(data => {
          return data.css
        })
        .catch(e => {
          console.warn(chalk.red('errors in postcssLoader'))
          throw new Error(e.message)
        })
    })

    /* postcss 插件 */
    const poscssPlugins = [
      ...plugins,
      /* 默认对css进行压缩，和注释去除 */
      cssnano({
        preset: [
          'default',
          {
            discardComments: {
              removeAll: true
            }
          }
        ]
      }),
      /* 图片默认用base64 */
      base64({
        extensions: ['png', 'gif', 'jpg'],
        root: path.dirname(id)
      })
    ]

    /* postcss配置，目前不需要sourceMap */
    const postcssOpts = {
      from: id,
      to: id,
      map: false
    }

    return series(loaders, code, postcssOpts).then(code => {
      /* 默认是注入形式 */
      if (!extract) {
        code = `import styleInject from 'xmiotStyleInject'\nstyleInject('${code}')`
      }

      return code
    })
  }
}
