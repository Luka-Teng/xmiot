import fns from '../src/index.ts'

test('test', async () => {
  expect(fns.isTel('1')).toBe(false)
})
