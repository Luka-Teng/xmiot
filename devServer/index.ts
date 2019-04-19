import c from './test'

let a = 111

function decorator (a) {
  a.b = 22222222
}

@decorator
class A {
  a = 1
}

console.log(c)

let k = {a: 1, b: 2, c: 3}
console.log(k)

export default { a }

