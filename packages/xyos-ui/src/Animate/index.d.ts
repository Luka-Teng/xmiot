import React from 'react'

type PropsForPreset = {
  preset?: 'fade' | 'fadeInLeft' | 'fadeInRight'
  offset?: number
  duration?: number
} & React.HTMLAttributes<React.ReactElement>

type PropsForScroll = {
  delay?: number
} & React.HTMLAttributes<HTMLDivElement>

declare class AnimatePreset extends React.Component<PropsForPreset> {}

declare class ScrollTrigger extends React.Component<PropsForScroll> {}

export {
  AnimatePreset,
  ScrollTrigger
}