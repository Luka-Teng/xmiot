/* 判断types */
type Types =
  | 'object'
  | 'array'
  | 'function'
  | 'string'
  | 'number'
  | 'regExp'
  | 'undefined'
  | 'boolean'
type MatchTypes = Types[] | Types

export const is = (
  input: any,
  matchTypes: MatchTypes,
  errorMessage: string
) => {
  const types: { [key in Types]: string } = {
    object: '[object Object]',
    array: '[object Array]',
    function: '[object Function]',
    string: '[object String]',
    number: '[object Number]',
    regExp: '[object RegExp]',
    undefined: '[object Undefined]',
    boolean: '[object Boolean]'
  }

  const inputType = Object.prototype.toString.call(input)
  const typeForMatchTypes = Object.prototype.toString.call(matchTypes)

  const match = (inputType: string, type: Types) => {
    if (types[type] && types[type] === inputType) return true
    return false
  }

  if (typeForMatchTypes === types.string) {
    if (match(inputType, matchTypes as Types)) return true
  }

  if (typeForMatchTypes === types.array) {
    for (let i in matchTypes as Types[]) {
      if (match(inputType, matchTypes[i] as Types)) return true
    }
  }

  throw new Error(errorMessage)
}
