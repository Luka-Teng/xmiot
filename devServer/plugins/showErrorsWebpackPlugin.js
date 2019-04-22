class ShowErrors {
  apply (compiler) {
    compiler.hooks.done.tap('test', (stats) => {
      console.log(stats.compilation.errors)
      if (stats.compilation.errors.length > 0) {
        console.log(stats.compilation.errors)
      }
    })
  }
}

module.exports = ShowErrors