const getRollupConfig = require('../../utils/getRollupConfig')
const path = require('path')
const fs = require('fs')

const src = path.resolve(__dirname, './src')

/* 读取src文件下的目录 */
const srcContents = fs.readdirSync(src)

const validDirs = srcContents.map((content, index) => {
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
  } catch {}

  try {
    if (fs.statSync(path.join(dir, 'index.tsx')).isFile()) {
      return [content, 'index.tsx']
    }
  } catch {}

  return null
}).filter(Boolean)

const mapToInput = (dir, modules) => {
  return modules.reduce((result, module) => {
    result[`${dir}/${module[0]}`] = `${src}/${module[0]}/${module[1]}`
    return result
  }, {})
}
function getOptions (format) {
  return {
    input: mapToInput(format, validDirs),
    output: {
      entryFileNames: `[name].js`,
      chunkFileNames: `${format}/common/[name].js`,
      dir: './entry',
      format
    },
    external: (id) => {
      if (
        /^rc\-/.test(id)
      ) {
        return true
      }
    }
  }
}

export default [
  getRollupConfig(getOptions('cjs')),
  getRollupConfig(getOptions('es'))
]
