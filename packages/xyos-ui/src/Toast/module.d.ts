declare module 'rc-notification' {
  import * as React from 'react'

  export interface Props {
    content: React.ReactNode
    duration: number | null
    type: string
    onClose?: () => void
    icon?: React.ReactNode
    key?: string | number
  }

  export default class Toast extends React.Component<Props> {
    static newInstance (
      props: {
        prefixCls: string
        style: Object
        transitionName: string
        maxCount: number
        getContainer: Function
        className?: string
        closeIcon?: React.ReactNode
      },
      notification
    ): void
  }
}
