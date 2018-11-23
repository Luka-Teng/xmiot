/*
  根据传入的prompts进行提问
  回答的答案直接写入data（metadata）
*/
const evaluate = require('./eval')
const inquirer = require('inquirer')
const { eachWithNext } = require('../utils')

module.exports = (prompts, data, done) => {
  // 遍历处理prompts下的每一个字段
  eachWithNext(
    Object.keys(prompts),
    (key, next) => {
      prompt(data, key, prompts[key], next)
    },
    done
  )
}

function prompt (data, key, prompt, done) {
  // 跳过提问，当when条件失败时
  if (prompt.when && !evaluate(prompt.when, data)) {
    return done()
  }
  let promptDefault = prompt.default
  inquirer
    .prompt([
      {
        type: prompt.type,
        name: key,
        message: prompt.message,
        default: promptDefault,
        choices: prompt.choices || [],
        validate: prompt.validate || (() => true)
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
