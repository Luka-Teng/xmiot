export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export const tuple = <T extends string[]>(...args: T) => args
export const tupleNum = <T extends number[]>(...args: T) => args
export const omit = (
  source: { [propName: string]: any },
  target: string[]
): object => {
  let tempSource = { ...source }
  target.map(item => delete tempSource[item])
  return tempSource
}
