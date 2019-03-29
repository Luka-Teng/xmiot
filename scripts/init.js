/*
 * usage: init dest(包名)
 * prompts: name(不可重复)，type（global, react），modules（需要安装的额外npm包）
 * 运行完执行lerna bootstrap
 */
const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const render = require('consolidate').handlebars.render
const { prompt, gitUser } = require('./utils')
const logger = require('../utils/logger')
const path = require('path')
const exists = require('fs').existsSync
const match = require('minimatch')

const { eachWithNext, eachWithAll } = require('../utils/function')
const { npmInstall } = require('../utils/runCommand')

// 注册handlebars的helper
Handlebars.registerHelper('if_eq', function (a, b, opts) {
  return a === b ? opts.fn(this) : opts.inverse(this)
})

Handlebars.registerHelper('unless_eq', function (a, b, opts) {
  return a === b ? opts.inverse(this) : opts.fn(this)
})

/*
 * 初始化的运行方法
 * from: 模板地址
 * to: 包地址
 * prompts: 需要的提问的参数 {type, name, default, message, choices}
 */
const run = ({ from, to, prompts }) => {
  const metalsmith = Metalsmith(from)
  let metadata = metalsmith.metadata()

  // 提问并且存取去metaldata
  metalsmith.use((files, metalsmith, done) => {
    eachWithNext(
      Object.keys(prompts),
      (key, next) => {
        prompt(metadata, key, prompts[key], next)
      },
      done
    )
  })

  metalsmith.use((files, metalsmith, done) => {
    for (let fileName in files) {
      if (metadata.isTs && match(fileName, '**/.eslintrc', { dot: true })) {
        delete files[fileName]
      }

      if (!metadata.isTs && match(fileName, '**/tsconfig.json', { dot: true })) {
        delete files[fileName]
      }
    }
    done()
  })

  // 对模板进行渲染
  metalsmith.use((files, metalsmith, done) => {
    // 异步渲染模板文件
    eachWithAll(
      Object.keys(files),
      (file, next, error) => {
        const str = files[file].contents.toString()
        // do not attempt to render files that do not have mustaches
        if (!/{{([^{}]+)}}/g.test(str)) {
          return next()
        }
        render(str, metadata, (err, res) => {
          if (err) {
            error(err)
          }
          files[file].contents = Buffer.from(res, 'utf8')
          next()
        })
      },
      done
    )
  })

  // metalsmith的构建
  metalsmith
    .clean(true)
    .source('.')
    .destination(to)
    .build((err, files) => {
      if (err) {
        logger.warn(err)
        logger.fatal('初始化失败')
      }
      logger.success('初始化成功')
      const stop = logger.load('安装依赖中')
      npmInstall(to)
      stop()
    })
}

// 外部参数的获得
const name = process.argv[2]
if (!name) logger.fatal('必须输入目录名')
let to = path.resolve(__dirname, '../packages', name)
if (exists(to)) logger.fatal('已存在该目录')
let outerAnswers = {}
const outerPrompts = {
  type: {
    message: '项目类型',
    type: 'list',
    choices: [
      {
        name: 'react',
        value: 'react'
      },
      {
        name: 'global',
        value: 'global'
      }
    ]
  }
}

eachWithNext(
  Object.keys(outerPrompts),
  (key, next) => {
    prompt(outerAnswers, key, outerPrompts[key], next)
  },
  () => {
    const { type } = outerAnswers
    let from = ''
    if (type === 'react') {
      from = path.resolve(__dirname, './packageTemplates', 'reactTemplate')
    } else if (type === 'global') {
      from = path.resolve(__dirname, './packageTemplates', 'globalTemplate')
    } else {
      logger.fatal('不存在该类型')
    }

    // 配置问题
    const prompts = {
      projectName: {
        type: 'input',
        message: '项目名',
        default: name
      },
      author: {
        type: 'input',
        message: '作者',
        default: gitUser()
      },
      description: {
        type: 'input',
        message: '描述'
      },
      isTs: {
        message: '是否使用typescript',
        type: 'confirm'
      }
    }

    // 运行
    run({
      from,
      to,
      prompts
    })
  }
)
