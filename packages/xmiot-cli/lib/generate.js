const chalk = require('chalk')
const Metalsmith = require('metalsmith')
const path = require('path')
const Handlebars = require('handlebars')
const render = require('consolidate').handlebars.render
const getOptions = require('./options')
const { eachWithAll } = require('../utils')
const ask = require('./ask')
const filter = require('./filter')
const logger = require('./logger')

/*
* name: 项目名
* src: 模板本地地址
* dest: 构建目标地址
* done: 构建错误回调
*/

module.exports = (name, src, dest, done) => {
  // 获取模板metadata.json/metadata.js的数据
  // getOptions会赋值prompts.name.default = name
  const opts = getOptions(name, src)

  // 初始化metalsmith和metadata
  const metalsmith = Metalsmith(path.join(src, 'template'))
  const data = Object.assign(metalsmith.metadata(), {
    destDirName: name,
    inPlace: dest === process.cwd(),
    noEscape: true
  })

  // metalsmith中间件，(files, metalsmith, done) => {}
  metalsmith
    .use(askQuestions(opts.prompts))
    .use(filterFiles(opts.filters))
    .use(renderTemplateFiles())

  // metalsmith的构建
  metalsmith
    .clean(true)
    .source('.')
    .destination(dest)
    .build((err, files) => {
      if (err) done(err)
      if (typeof opts.complete === 'function') {
        // 配置对象有complete函数则执行
        const helpers = { chalk, logger, files }
        opts.complete(data, helpers)
      } else {
        // 配置对象有completeMessage，执行logMessage函数
        logMessage(opts.completeMessage, data)
      }
    })

  return data
}

// 注册handlebars的helper
Handlebars.registerHelper('if_eq', function (a, b, opts) {
  return a === b ? opts.fn(this) : opts.inverse(this)
})

Handlebars.registerHelper('unless_eq', function (a, b, opts) {
  return a === b ? opts.inverse(this) : opts.fn(this)
})

// 渲染模板文件
function renderTemplateFiles () {
  return (files, metalsmith, done) => {
    const keys = Object.keys(files)
    const metalsmithMetadata = metalsmith.metadata()

    // 异步渲染模板文件
    eachWithAll(
      keys,
      (file, next, error) => {
        const str = files[file].contents.toString()

        // do not attempt to render files that do not have mustaches
        if (!/{{([^{}]+)}}/g.test(str)) {
          return next()
        }

        render(str, metalsmithMetadata, (err, res) => {
          if (err) {
            error(err)
          }
          files[file].contents = Buffer.from(res, 'utf8')
          next()
        })
      },
      done
    )
  }
}

// 提问模块
function askQuestions (prompts) {
  return (files, metalsmith, done) => {
    ask(prompts, metalsmith.metadata(), done)
  }
}

// 文件过滤模块
function filterFiles (filters) {
  return (files, metalsmith, done) => {
    filter(files, filters, metalsmith.metadata(), done)
  }
}

function logMessage (message, data) {
  if (!message) return
  render(message, data, (err, res) => {
    if (err) {
      console.error(
        '\n   Error when rendering template complete message: ' +
          err.message.trim()
      )
    } else {
      console.log(
        '\n' +
          res
            .split(/\r?\n/g)
            .map(line => '   ' + line)
            .join('\n')
      )
    }
  })
}
