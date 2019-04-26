const CLIEngine = require("eslint").CLIEngine
const { eslintRules } = require('./config')

const extentions = ['.js', '.jsx']

const cli = new CLIEngine({
  useEslintrc: false,
  rules: eslintRules,
  extentions,
  fix: true
})

var report = cli.executeOnFiles(['./scripts/prettier/test.js'])
  CLIEngine.outputFixes(report)
  console.log(report && report.results[0].messages)
module.exports = (file) => {
  var report = cli.executeOnFiles(['./scripts/prettier/test.js'])
  CLIEngine.outputFixes(report)
  console.log(report)
}