const match = require('minimatch')

exports.matchFile = (globs, file) => {
  return globs.some(glob => match(file, glob))
}

/* 判断是文件类型 */
exports.getScriptType = file => {
  const jsExtensions = ['.js', '.jsx']
  const tsExtentions = ['.ts', '.tsx']
  if (jsExtensions.some(e => file.endsWith(e))) {
    return 'js'
  } else if (tsExtentions.some(e => file.endsWith(e))) {
    return 'ts'
  } else {
    return 'other'
  }
}
