import fns from '../src/index.ts'

test('test', async () => {
  expect(fns.FormatDate(1554275233811)).toBe('2019-04-03 15:07:13')
})
