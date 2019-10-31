const { basename, dirname, isAbsolute, resolve } = require('path')
const fs = require('fs')

function isFile (dest) {
  try {
    return fs.statSync(dest).isFile()
  } catch (err) {
    return false
  }
}

function isDirectory (dest) {
  try {
    return fs.statSync(dest).isDirectory()
  } catch (err) {
    return false
  }
}

function addExtensionIfNecessary (file, extensions) {
  try {
    const name = basename(file)
    const files = fs.readdirSync(dirname(file))

    // 如果能直接找到该文件，直接返回该文件
    if (isFile(file)) return file

    // 如果有以该文件名开头的其他扩展文件，返回该文件
    for (const ext of extensions) {
      if (isFile(`${file}${ext}`)) {
        return `${file}${ext}`
      }
    }

    // 如果存在该文件名命名的文件夹，查找该文件下的index
    if (isDirectory(file)) {
      for (const ext of extensions) {
        if (isFile(`${file}/index${ext}`)) {
          return `${file}/index${ext}`
        }
      }
    }
  } catch (err) {
    // noop
  }

  return null
}

function extensions (extensions) {
  if (!extensions || !extensions.length) {
    throw new Error(`Must specify extensions: [..] as non-empty array!`)
  }

  return {
    name: 'extensions',

    resolveId (importee, importer) {
      // absolute paths are left untouched
      if (isAbsolute(importee)) {
        return addExtensionIfNecessary(resolve(importee), extensions)
      }

      // if this is the entry point, resolve against cwd
      if (importer === undefined) {
        return addExtensionIfNecessary(
          resolve(process.cwd(), importee),
          extensions
        )
      }

      // external modules are skipped at this stage
      if (importee[0] !== '.') return null

      return addExtensionIfNecessary(
        resolve(dirname(importer), importee),
        extensions
      )
    }
  }
}

module.exports = extensions
