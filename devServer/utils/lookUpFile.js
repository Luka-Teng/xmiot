/**
 * 向上递归寻找文件
 */

const path = require('path')
const fs = require('fs-extra')

const isDir = (path) => {
  try {
    const stats = fs.statSync(path)
    return stats.isDirectory()
  } catch (e) {
    throw new Error('无法找到文件')
  }
}

/**
 * @param {string} dir1 
 * @param {string} dir2 
 * result: containing equal contained unequal
 */
const getDirsStatus = (_dir1, _dir2) => {
  const dir1 = path.resolve(_dir1)
  const dir2 = path.resolve(_dir2)

  const dirsStatus = (dir1, dir2) => {
    if (dir1.startsWith(dir2)) {
      const remain = dir1.replace(dir2, '')
      if (remain[0] === '/') return 'contained'
      if (remain[0] === undefined) return 'equal'
    }

    if (dir2.startsWith(dir1)) {
      const remain = dir2.replace(dir1, '')
      if (remain[0] === '/') return 'containing'
    }
  }

  return dirsStatus(dir1, dir2) || 'unequal'
}

const lookUpFile = ({
  rootDir,
  startDir,
  file
}) => {
  if (!(rootDir && startDir && file)) {
    throw new Error('参数不能为空')
  }

  /* 保证地址为绝对路径 */
  const _rootDir = path.resolve(rootDir)
  const _startDir = path.resolve(startDir)

  if (!isDir(_rootDir) || !isDir(_startDir)) {
    throw new Error('rootDir和startDir必须是目录, file必须是文件')
  }

  const getFile = (_path, file) => {
    const filePath = path.resolve(_path, file)
    return fs.existsSync(filePath) && filePath
  }

  switch (getDirsStatus(_rootDir, _startDir)) {
    case 'equal':
      return getFile(_startDir, file)

    case 'unequal':
    case 'contained':
      throw new Error('rootDir层级必须高于startDir')

    case 'containing':
      return getFile(_startDir, file) || lookUpFile({
        rootDir: _rootDir, 
        startDir: path.resolve(_startDir, '..'), 
        file: file
      })

    default:
      break;
  }
}

module.exports = lookUpFile