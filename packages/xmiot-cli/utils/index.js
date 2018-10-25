const path = require('path')
const checkVersion = require('./check-version')

// 异步方法遍历，每个方法有next交替权
const eachWithNext = (items, handler, complete) => {
  let i = 0
  const next = () => {
    const item = items[i++]
    if (!item) {
      if (complete && typeof complete === 'function') complete()
      return
    }
    handler(item, next)
  }
  next()
}

// 异步方法遍历，所有方法以Promise.all执行
const eachWithAll = (items, handler, complete) => {
  let queues = []
  items.forEach(item => {
    queues.push(
      new Promise((resolve, reject) => {
        handler(item, resolve, reject)
      })
    )
  })
  Promise.all(queues).then(() => {
    if (complete && typeof complete === 'function') complete()
  })
}

/*
* 判断是否是本地地址
* 只能以'.', '/', '字母:'这三种情况开头
*/
const isLocalPath = templatePath => {
  return /^[./]|(^[a-zA-Z]:)/.test(templatePath)
}

/*
* 获取本地模板路径
* 本地模板只能存放在程序运行所在目录
* 需要做修改
*/
const getTemplatePath = templatePath => {
  return path.isAbsolute(templatePath)
    ? templatePath
    : path.normalize(path.join(process.cwd(), templatePath))
}

module.exports = {
  eachWithNext,
  eachWithAll,
  isLocalPath,
  getTemplatePath,
  checkVersion
}
