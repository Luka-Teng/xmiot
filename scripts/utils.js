const inquirer = require('inquirer')
const { execCommand } = require('../utils/runCommand')

/*
 * 对初始化进行提问
 * data: 对提出的问题进行存储
 * key: 问题的key
 * prompt: 问题的具体配置
 * done:回答完后的回调
 */
exports.prompt = (data, key, prompt, done) => {
  inquirer
    .prompt([
      {
        type: prompt.type,
        name: key,
        message: prompt.message,
        default: prompt.default,
        choices: prompt.choices || []
      }
    ])
    .then(answers => {
      if (Array.isArray(answers[key])) {
        // 当答案是一个数组时
        data[key] = {}
        answers[key].forEach(multiChoiceAnswer => {
          data[key][multiChoiceAnswer] = true
        })
      } else if (typeof answers[key] === 'string') {
        // 当答案是一个字符串时
        data[key] = answers[key].replace(/"/g, '\\"')
      } else {
        // 其他情况
        data[key] = answers[key]
      }
      done()
    })
    .catch(done)
}

// 获取git的用户数据
exports.gitUser = () => {
  let name
  let email

  try {
    name = execCommand('git config --get user.name')
    email = execCommand('git config --get user.email')
  } catch (e) {}

  name = name && JSON.stringify(name.toString().trim()).slice(1, -1)
  email = email && ' <' + email.toString().trim() + '>'
  return (name || '') + (email || '')
}
