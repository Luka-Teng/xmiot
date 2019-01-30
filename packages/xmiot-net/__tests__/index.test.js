import Hook from '../src/netHook/waterfallHook'
// import pest from '../src'
test('adds 1 + 2 to equal 3', () => {
  const hook = new Hook('name')
  hook.listen(name => {
    return name
  })
  hook.run('aa').then(data => {
    expect(data).toBe('aa')
  })
})
