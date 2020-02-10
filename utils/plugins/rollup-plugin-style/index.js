/**
 * options
 * @prop { extract[number].test } regex 被打包的组
 * @prop { extract[number].filename } string 打包出来的文件名
 * @prop { autoUse } boolean 是否要在入口文件自动引入样式
 */

const loader = require('./loader')
const { is } = require('./utils')

module.exports = ({ extract, plugins = [], autoUse = false } = {}) => {
  is(extract, ['array', 'undefined'], 'extract should be an array')
  is(plugins, 'array', 'plugins should be an array')

  const extractedStyles = {}

  return {
    resolveId (importee) {
      /* 将xmiotStyleInject模块直接返回，否则托管给默认的resolve会被定义为external跳过，导致模块查找失败 */
      if (importee === 'xmiotStyleInject') {
        return 'xmiotStyleInject'
      }
    },

    async load (id) {
      /* 返回xmiotStyleInject的代码 */
      if (id === 'xmiotStyleInject') {
        return `
          function styleInject (css, ref) {
            if ( ref === void 0 ) ref = {};
            var insertAt = ref.insertAt;
          
            if (!css || typeof document === 'undefined') { return; }
          
            var head = document.head || document.getElementsByTagName('head')[0];
            var style = document.createElement('style');
            style.type = 'text/css';
          
            if (insertAt === 'top') {
              if (head.firstChild) {
                head.insertBefore(style, head.firstChild);
              } else {
                head.appendChild(style);
              }
            } else {
              head.appendChild(style);
            }
          
            if (style.styleSheet) {
              style.styleSheet.cssText = css;
            } else {
              style.appendChild(document.createTextNode(css));
            }
          }
          
          export default styleInject
        `
      }
    },

    async transform (code, id) {
      /* 判断是不是less，css结尾的文件 */
      if (!loader.test.test(id)) return null

      const options = {
        id,
        extract,
        plugins
      }

      const _code = await loader.process(code, options)

      if (extract) {
        extractedStyles[id] = _code
        /* css文件被摘出，模块返回空文本即可 */
        return ''
      }

      return _code
    },

    /**
     * 被分组css，会被打入一个chunk，并存在放在指定文件下
     * 未被分组的css，会被打入到remainingCss下
     */
    async generateBundle (options, bundle) {
      if (!extract) return

      const newAssets = {}
      const extractedStylesKeys = Object.keys(extractedStyles)
      const extractKeys = Object.keys(extract)

      for (let extractedStylesKey of extractedStylesKeys) {
        for (let extractKey of extractKeys) {
          if (extract[extractKey].test.test(extractedStylesKey)) {
            newAssets[extract[extractKey].filename] =
              newAssets[extract[extractKey].filename] || ''
            newAssets[extract[extractKey].filename] +=
              '\n' + extractedStyles[extractedStylesKey]
            delete extractedStyles[extractedStylesKey]
            break
          }
        }

        if (extractedStyles[extractedStylesKey] !== undefined) {
          newAssets['common.css'] = newAssets['common.css'] || ''
          newAssets['common.css'] += '\n' + extractedStyles[extractedStylesKey]
        }
      }

      /**
       * todo
       * 这边和业务强耦合，后期需要做额外思考，一定要改、、、
       * 将每一个配置过extractentryChunk都加上 `import './index.css'`
       * 通过这种暴力的方式引入打包出来的样式
       */
      if (autoUse) {
        const isExtract = path => {
          return extract.some(e => e.test.test(path))
        }
        const format = options.format
        Object.keys(bundle).forEach(chunkName => {
          const chunk = bundle[chunkName]
          /* 自引用common */
          if (newAssets['common.css'] !== undefined) {
            chunk.code =
              (format === 'es'
                ? `import '../common.css' \n`
                : `require('../common.css') \n`) + chunk.code
          }
          /* 自引用内部模块chunk */
          if (chunk.isEntry && isExtract(chunk.facadeModuleId)) {
            chunk.code =
              (format === 'es'
                ? `import './index.css' \n`
                : `require('./index.css') \n`) + chunk.code
          }
        })
      }

      Object.keys(newAssets).forEach(assetKey => {
        this.emitFile({
          type: 'asset',
          id: assetKey,
          name: assetKey,
          source: newAssets[assetKey]
        })
      })
    }
  }
}
