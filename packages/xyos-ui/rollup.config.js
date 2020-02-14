const getRollupConfig = require('../../utils/getRollupConfig')
const path = require('path')
const fs = require('fs')
const packageJson = require('./package.json')

const src = path.resolve(__dirname, './src')

/* 读取src文件下的目录 */
const srcContents = fs.readdirSync(src)

/* 声明文件 */
const declares = []

const validDirs = srcContents
  .map((content) => {
    const dir = path.join(src, content)

    /* 判断是否是文件夹 */
    if (fs.statSync(dir).isFile()) {
      return null
    }

    /* 判断是否存在声明文件，并加入队列 */
    try {
      if (fs.statSync(path.join(dir, 'index.d.ts')).isFile()) {
        declares.push(content)
      }
    } catch (e) {}

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
    external: [...Object.keys(packageJson.dependencies), 'react', 'react-dom']
  }
}

const extraOptions = format => ({
  buildPaths: [path.resolve(__dirname, 'entry', format)],
  styleOptions: {
    autoUse: true,
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
      },
      {
        test: /src\/Icon/,
        filename: 'Icon/index.css'
      },
      {
        test: /src\/Notice/,
        filename: 'Notice/index.css'
      },
      {
        test: /src\/Tooltip/,
        filename: 'Tooltip/index.css'
      },
    ]
  },
  copyOptions: declares.map(declare => ({
    src: path.resolve(__dirname, 'src', declare + '/index.d.ts'),
    dest: path.resolve(__dirname, 'entry', format, declare)
  }))
})

export default [
  getRollupConfig(getOptions('cjs'), extraOptions('cjs')),
  getRollupConfig(getOptions('es'), extraOptions('es'))
]
