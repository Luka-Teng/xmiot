const getStyleLoaders = preProcessor => {
  const loaders = [
    require.resolve('style-loader'),
    require.resolve('css-loader'),
    {
      loader: require.resolve('postcss-loader'),
      options: {
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009'
            },
            stage: 3
          })
        ]
      }
    }
  ].filter(Boolean)
  if (preProcessor) {
    if (typeof preProcessor === 'string') {
      loaders.push(require.resolve(preProcessor))
    } else if (Object.prototype.toString.call(preProcessor) === '[object Object]') {
      loaders.push(preProcessor)
    }
  }
  return loaders
}

module.exports = getStyleLoaders
