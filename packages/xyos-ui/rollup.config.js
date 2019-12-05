const getRollupConfig = require('../../utils/getRollupConfig')
const path = require('path')
const fs = require('fs')

const src = path.resolve(__dirname, './src')

/* 读取src文件下的目录 */
const srcContents = fs.readdirSync(src)

const validDirs = srcContents
  .map((content, index) => {
    const dir = path.join(src, content)

    /* 判断是否是文件夹 */
    if (fs.statSync(dir).isFile()) {
      return null
    }

    /* 判断文件夹内部是否有入口文件 */
    try {
      if (fs.statSync(path.join(dir, 'index.ts')).isFile()) {
        return [content, 'index.ts']
      }
    } catch (e) {}

    try {
      if (fs.statSync(path.join(dir, 'index.tsx')).isFile()) {
        return [content, 'index.tsx']
      }
    } catch (e) {}

    return null
  })
  .filter(Boolean)

const mapToInput = (dir, modules) => {
  return modules.reduce((result, module) => {
    result[`${dir}/${module[0]}/index`] = `${src}/${module[0]}/${module[1]}`
    return result
  }, {})
}

function getOptions (format) {
  return {
    input: mapToInput(format, validDirs),
    output: {
      entryFileNames: `[name].js`,
      chunkFileNames: `${format}/common/[name].js`,
      assetFileNames: `${format}/[name][extname]`,
      dir: './entry',
      format
    },
    external: id => {
      if (/(^rc\-)/.test(id)) {
        return true
      }

      if (['react', 'react-dom', 'async-validator'].includes(id)) {
        return true
      }
    }
  }
}

const extraOptions = format => ({
  buildPaths: [path.resolve(__dirname, 'entry', format)],
  styleOptions: {
    extract: [
      {
        test: /src\/Animate/,
        filename: 'Animate/index.css'
      },
      {
        test: /src\/Button/,
        filename: 'Button/index.css'
      },
      {
        test: /src\/Checkbox/,
        filename: 'Checkbox/index.css'
      },
      {
        test: /src\/Radio/,
        filename: 'Radio/index.css'
      },
      {
        test: /src\/Toast/,
        filename: 'Toast/index.css'
      },
      {
        test: /src\/Select/,
        filename: 'Select/index.css'
      },
      {
        test: /src\/Label/,
        filename: 'Label/index.css'
      },
      {
        test: /src\/Input/,
        filename: 'Input/index.css'
      }
    ]
  }
})

export default [
  getRollupConfig(getOptions('cjs'), extraOptions('cjs')),
  getRollupConfig(getOptions('es'), extraOptions('es'))
]
