import fns from '../src/index.ts'

test('test', async () => {
  expect(fns.FormatDate(1554275233811)).toBe(false)
})

console.log(fns.FormatDate(1554275434290), '8888')
