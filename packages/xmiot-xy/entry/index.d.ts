export declare type genObject = {
  [key: string]: any
}

declare namespace XY {
  const call: (functionName: string, params: genObject) => Promise<any>
  const on: (functionName: string, callback: Function) => void
}

export default XY
