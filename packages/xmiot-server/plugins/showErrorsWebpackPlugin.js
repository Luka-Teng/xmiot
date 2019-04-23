class ShowErrors {
  apply (compiler) {
    compiler.hooks.done.tap('test', stats => {})
  }
}

module.exports = ShowErrors
