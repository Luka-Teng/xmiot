import * as React from 'react'

type Type = 'warning' | 'success' | 'error' | 'info' 


export interface NoticeProps{
  size?:string
  message:string
  type:Type
  title?:string
  closable?:boolean
}


declare class Notice extends React.Component<NoticeProps> {}

export default Notice
