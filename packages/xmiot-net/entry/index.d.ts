declare type genObject = {
  [key: string]: any
}

interface VerbMock {
  (
    url: string,
    body?: {
      data?: genObject
      params?: genObject
    }
  ): {
    reply: Reply
    replyOnce: Reply
  }
}

interface Reply {
  (
    code: number,
    response: any,
    options?: {
      delay?: number
      errorMessage?: string
    }
  ): Net
}

declare class Net {
  /* constructor */
  constructor (axiosInstance: any, preventRepeat?: boolean)

  /* net.pre((config, stop) => {}) */
  public pre: (callback: (config: genObject, stop: Function) => any) => Net

  /* net.postSuccess((response, stop) => {}) */
  public postSuccess: (
    callback: (response: genObject, stop: Function) => any
  ) => Net

  /* net.postError((error, stop) => {}) */
  public postError: (callback: (error: genObject, stop: Function) => any) => Net

  /* net.onCache */
  public onCache: (
    options: {
      url: string
      method: string
      timeout: number
      ignoreParams: string[]
      ignoreData: string[]
    }
  ) => void

  /* net.prevent */
  public prevent: (
    options: {
      ignores: string[]
    }
  ) => void

  /* net.onResend */
  public onResend: (
    options: {
      url: string
      method: string
      times: number
    }
  ) => void

  /* net.mockBase */
  public mockBase: (baseUrls: string[]) => void

  /* get post put delete */
  public get: VerbMock
  public post: VerbMock
  public put: VerbMock
  public delete: VerbMock
}

export = Net

export as namespace Net
