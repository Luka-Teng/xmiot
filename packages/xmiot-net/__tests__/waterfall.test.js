import WaterfallHook from '../src/netHook/waterfallHook'

let wHook1 = null
let wHook2 = null

beforeEach(() => {
  wHook1 = new WaterfallHook('name')
  wHook2 = new WaterfallHook('name')
})

test('a waterfallHook can pass args', async () => {
  const mockFn = jest
    .fn()
    .mockImplementationOnce(param => param + 1)
    .mockImplementationOnce(param => undefined)
    .mockImplementationOnce(param => param + 1)

  wHook1.listen(mockFn)
  wHook1.listen(mockFn)
  wHook1.listen(mockFn)

  const result = await wHook1.run('luka')
  expect(mockFn.mock.calls[0][0]).toBe('luka')
  expect(mockFn.mock.calls[1][0]).toBe('luka1')
  expect(mockFn.mock.calls[2][0]).toBe('luka1')
  expect(result).toBe('luka11')
})

test('a waterfallHook can stop the chain', async () => {
  const mockFn = jest
    .fn()
    .mockImplementationOnce(param => param + 1)
    .mockImplementationOnce((param, stop) => {
      stop()
    })
    .mockImplementationOnce(param => param + 1)

  wHook1.listen(mockFn)
  wHook1.listen(mockFn)
  wHook1.listen(mockFn)

  const result = await wHook1.run('luka')
  expect(mockFn.mock.calls.length).toBe(2)
  expect(result).toBe('luka1')
})

test('functions bound with connected waterfallHooks will be dropped', async () => {
  const mockFn1 = jest
    .fn()
    .mockImplementationOnce(param => param + 1)
    .mockImplementationOnce((param, stop) => {
      stop()
    })
    .mockImplementation(param => param + 1)
  const mockFn2 = jest.fn(param => param + 1)
  const cMockFn1 = jest.fn(param => param + 1)
  const cMockFn2 = jest.fn(param => param + 1)

  wHook1.listen(mockFn1)
  wHook2.listen(mockFn2)
  wHook1.listen(mockFn1)
  wHook2.listen(mockFn2)
  wHook1.connect(wHook2)(cMockFn1, cMockFn2)
  wHook1.listen(mockFn1)
  wHook2.listen(mockFn2)

  const result1 = await wHook1.run('luka')
  const result2 = await wHook2.run('luka')

  expect(mockFn1.mock.calls.length).toBe(2)
  expect(mockFn2.mock.calls.length).toBe(3)
  expect(cMockFn1.mock.calls.length).toBe(0)
  expect(cMockFn2.mock.calls.length).toBe(0)
  expect(result1).toBe('luka1')
  expect(result2).toBe('luka111')
})
