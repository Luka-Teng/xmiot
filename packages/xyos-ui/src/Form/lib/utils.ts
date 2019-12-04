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

/* 在装饰器中判断类型 */
type extendedPropertyDescriptor = PropertyDescriptor & {
  initializer: Function | null
}

export const params = (...types: MatchTypes[]) => {
  return (((
    target: any,
    name: string,
    descriptor: extendedPropertyDescriptor
  ) => {
    const { initializer } = descriptor

    if (!initializer) {
      throw new Error('该装饰器只能装饰初始化属性')
    }

    if (initializer && typeof initializer !== 'function') {
      throw new Error('装饰函数目前仅支持实例方法')
    }

    descriptor.initializer = function () {
      return (...args: any[]) => {
        types.forEach((type, index) => {
          is(
            args[index],
            type,
            `argument-${index} should be one of the types [${type}] in ${name} in ${
              target.constructor.name
            }`
          )
        })
        return initializer.call(this)(...args)
      }
    }

    return descriptor
  }) as unknown) as ((target: any, propertyKey: string) => void)
}

/* 深比较 */
export const isObject = (source: any) => {
  return Object.prototype.toString.call(source) === '[object Object]'
}

export const isArray = (source: any) => {
  return Array.isArray(source)
}

export const isFunction = (source: any) => {
  return Object.prototype.toString.call(source) === '[object Function]'
}

export const deepEqual = (source: any, target: any): Boolean => {
  const typeOfSource = Object.prototype.toString.call(source)
  const typeOfTarget = Object.prototype.toString.call(target)

  if (typeOfSource !== typeOfTarget) return false

  if (!isObject(source) && !isArray(source)) {
    return source === target
  }

  if (isObject(source)) {
    const sKeys = Object.keys(source)
    const tKeys = Object.keys(target)
    const keys = sKeys > tKeys ? sKeys : tKeys
    return keys.every(key => deepEqual(source[key], target[key]))
  }

  if (isArray(source)) {
    const pickedOne = source.length > target.length ? source : target
    return pickedOne.every((s: any, i: number) =>
      deepEqual(source[i], target[i])
    )
  }

  return false
}
