// 将所有的环境变量整合
exports.getClientEnvironment = () => {
  const raw = Object.keys(process.env)
    .reduce(
      (env, key) => {
        env[key] = process.env[key]
        return env
      },
      {
        NODE_ENV: process.env.NODE_ENV || 'development',
        API_ENV: process.env.API_ENV || 'development'
      }
    )

  // Stringify all values so we can feed into rollup replace
  let stringified = {}
  Object.keys(raw).forEach((key) => {
    stringified[`process.env.${key}`] = JSON.stringify(raw[key])
  })

  return { raw, stringified }
}
