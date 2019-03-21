import WaterfallHook from '../src/netHook/waterfallHook'

test('waterfallHook能传递单参数', async () => {
  const hook = new WaterfallHook('name')
  const mockFn1 = jest.fn().mockImplementation(param => param + 1)
  const mockFn2 = jest.fn().mockImplementation(() => {})
  const mockFn3 = jest.fn().mockImplementation(param => param + 1)

  hook.listen(mockFn1)
  hook.listen(mockFn2)
  hook.listen(mockFn3)

  const result = await hook.run('luka')

  /* 确保单参数情况下的正常传递 */
  expect(mockFn1.mock.calls[0][0]).toBe('luka')
  expect(mockFn2.mock.calls[0][0]).toBe('luka1')
  expect(mockFn3.mock.calls[0][0]).toBe('luka1')

  /* 确保stop参数可以正常传入 */
  expect(mockFn1.mock.calls[0][1]).toBeInstanceOf(Function)
  expect(mockFn2.mock.calls[0][1]).toBeInstanceOf(Function)
  expect(mockFn3.mock.calls[0][1]).toBeInstanceOf(Function)

  /* 确保返回值的正常输出 */
  expect(result).toBe('luka11')
})

test('waterHook能传递多参数', async () => {
  const multiHook = new WaterfallHook('name', 'gender')
  const mockFn1 = jest.fn().mockImplementation((name, gender) => {
    console.log(name, gender)
    return name + 1
  })
  const mockFn2 = jest.fn().mockImplementation((name, gender) => {
    console.log(name, gender)
    return undefined
  })
  const mockFn3 = jest.fn().mockImplementation((name, gender) => {
    console.log(name, gender)
    return name + 1
  })

  multiHook.listen(mockFn1)
  multiHook.listen(mockFn2)
  multiHook.listen(mockFn3)

  const spyConsole = jest.spyOn(console, 'log')
  const result = await multiHook.run('luka', 'male')

  /* 确保多参数情况下的正常传递 */
  expect(spyConsole).toHaveBeenCalledWith('luka', 'male')
  expect(spyConsole).toHaveBeenCalledWith('luka1', 'male')
  expect(spyConsole).toHaveBeenCalledWith('luka1', 'male')

  /* 确保stop参数可以正常传入 */
  expect(mockFn1.mock.calls[0][2]).toBeInstanceOf(Function)
  expect(mockFn2.mock.calls[0][2]).toBeInstanceOf(Function)
  expect(mockFn3.mock.calls[0][2]).toBeInstanceOf(Function)

  /* 确保结果是符合预期 */
  expect(result).toBe('luka11')
})

test('相同的方法只能监听一次', async () => {
  const hook = new WaterfallHook('name')
  const mockFn = jest.fn().mockImplementation(name => {
    return name + 1
  })

  hook.listen(mockFn)
  hook.listen(mockFn)

  const result = await hook.run('luka')

  /* 确保函数只运行一次 */
  expect(mockFn.mock.calls.length).toBe(1)

  /* 确保结果是符合预期 */
  expect(result).toBe('luka1')
})

test('使用stop会中断队列', async () => {
  const hook = new WaterfallHook('name')
  const mockFn1 = jest.fn().mockImplementation(param => param + 1)
  const mockFn2 = jest.fn().mockImplementation((param, stop) => {
    stop()
  })
  const mockFn3 = jest.fn().mockImplementation(param => param + 1)

  hook.listen(mockFn1)
  hook.listen(mockFn2)
  hook.listen(mockFn3)

  const result = await hook.run('luka')

  /* 确保mockFn1，mockFn2成功运行，mockFn3没有运行 */
  expect(mockFn1.mock.calls.length).toBe(1)
  expect(mockFn2.mock.calls.length).toBe(1)
  expect(mockFn3.mock.calls.length).toBe(0)

  /* 确保结果是符合预期 */
  expect(result).toBe('luka1')
})

test('主hook与另一个hook通过connect绑定事件，则主hook绑定事件的移除会同步影响到被绑定的hook', async () => {
  const hook1 = new WaterfallHook('name')
  const hook2 = new WaterfallHook('name')

  const mockFn1 = jest.fn().mockImplementation(param => param + 1)
  const mockFn2 = jest.fn().mockImplementation((param, stop) => {
    stop()
  })
  const mockFn3 = jest.fn().mockImplementation(param => param + 1)
  const mockFn4 = jest.fn().mockImplementation(param => param + 1)

  hook1.listen(mockFn1)
  hook1.listen(mockFn2)
  hook2.listen(mockFn1)
  hook1.connect(hook2)(mockFn3, mockFn3)
  hook2.listen(mockFn4)

  const result1 = await hook1.run('luka')
  const result2 = await hook2.run('luka')

  /* 确保各个方法运行的次数 */
  expect(mockFn1.mock.calls.length).toBe(2)
  expect(mockFn2.mock.calls.length).toBe(1)
  expect(mockFn3.mock.calls.length).toBe(0)
  expect(mockFn4.mock.calls.length).toBe(1)

  /* 确保结果是符合预期 */
  expect(result1).toBe('luka1')
  expect(result2).toBe('luka11')
})
