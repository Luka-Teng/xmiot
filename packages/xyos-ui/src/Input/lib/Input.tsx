import * as React from 'react'
import * as PropTypes from 'prop-types'
import classNames from 'classnames'
import ClearableLabeledInput, { hasPrefixSuffix } from './ClearableInput'
import { tuple, Omit, omit } from './type'
import './Input.less'

export const InputSizes = tuple('small', 'default', 'large')
export type GetPrefixCls = (
  suffixCls: string,
  customizePrefixCls?: string
) => string
export interface InputProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
      'size' | 'prefix'
    > {
  prefixCls?: string
  size?: (typeof InputSizes)[number]
  onPressEnter?: React.KeyboardEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >
  addonBefore?: React.ReactNode
  addonAfter?: React.ReactNode
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  allowClear?: boolean
  errors?: string[]
}

export function fixControlledValue<T> (value: T) {
  if (typeof value === 'undefined' || value === null) {
    return ''
  }
  return value
}

export function resolveOnChange (
  target: HTMLInputElement | HTMLTextAreaElement,
  e:
    | React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    | React.MouseEvent<HTMLElement, MouseEvent>,
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
) {
  if (onChange) {
    let event = e
    if (e.type === 'click') {
      // click clear icon
      event = Object.create(e)
      event.target = target
      event.currentTarget = target
      // change target ref value cause e.target.value should be '' when clear input
      target.value = ''
      target.focus()
      onChange(event as React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >)
      return
    }
    onChange(event as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)
  }
}

export function getInputClassName (
  prefixCls?: string,
  size?: (typeof InputSizes)[number],
  disabled?: boolean
) {
  return classNames(prefixCls, {
    [`${prefixCls}-sm`]: size === 'small',
    [`${prefixCls}-lg`]: size === 'large',
    [`${prefixCls}-disabled`]: disabled
  })
}

export interface InputState {
  value: any
}

class Input extends React.Component<InputProps, InputState> {
  static defaultProps = {
    type: 'text'
  }

  static propTypes = {
    size: PropTypes.oneOf(InputSizes),
    disabled: PropTypes.bool,
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    className: PropTypes.string,
    addonBefore: PropTypes.node,
    addonAfter: PropTypes.node,
    prefixCls: PropTypes.string,
    onPressEnter: PropTypes.func,
    onKeyDown: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    prefix: PropTypes.node,
    suffix: PropTypes.node,
    allowClear: PropTypes.bool
  }

  input!: HTMLInputElement
  clearableInput!: ClearableLabeledInput

  constructor (props: InputProps) {
    super(props)
    const value =
      typeof props.value === 'undefined' ? props.defaultValue : props.value
    this.state = {
      value
    }
  }

  static getDerivedStateFromProps (nextProps: InputProps) {
    if ('value' in nextProps) {
      return {
        value: nextProps.value
      }
    }
    return null
  }

  // Since polyfill `getSnapshotBeforeUpdate` need work with `componentDidUpdate`.
  // We keep an empty function here.
  componentDidUpdate () {}

  focus () {
    this.input.focus()
  }

  blur () {
    this.input.blur()
  }

  // select () {
  //   this.input.select()
  // }

  saveInput = (input: HTMLInputElement) => {
    this.input = input
  }

  setValue (value: string, callback?: () => void) {
    if (!('value' in this.props)) {
      this.setState({ value }, callback)
    }
  }

  handleReset = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setValue('', () => {
      this.focus()
    })
    resolveOnChange(this.input, e, this.props.onChange)
  }

  renderInput = (prefixCls: string) => {
    const {
      className,
      addonBefore,
      addonAfter,
      size,
      disabled,
      errors
    } = this.props
    // Fix https://fb.me/react-unknown-prop
    const otherProps = omit(this.props, [
      'prefixCls',
      'onPressEnter',
      'addonBefore',
      'addonAfter',
      'prefix',
      'suffix',
      'allowClear',
      // Input elements must be either controlled or uncontrolled,
      // specify either the value prop, or the defaultValue prop, but not both.
      'defaultValue',
      'size',
      'inputType'
    ])
    return (
      <input
        {...otherProps}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        onBlur={this.handleBlur}
        className={classNames(getInputClassName(prefixCls, size, disabled), {
          [className!]: className && !addonBefore && !addonAfter
        })}
        ref={this.saveInput}
      />
    )
  }

  saveClearableInput = (input: ClearableLabeledInput) => {
    this.clearableInput = input
  }

  getPrefixCls = (suffixCls: string, customizePrefixCls?: string) => {
    const { errors } = this.props
    const prefixCls = errors && errors.length ? 'xy-error' : 'xy'

    if (customizePrefixCls) return customizePrefixCls

    return suffixCls ? `${prefixCls}-${suffixCls}` : prefixCls
  }

  renderComponent = () => {
    const { value } = this.state
    const { prefixCls: customizePrefixCls } = this.props
    const prefixCls = this.getPrefixCls('input', customizePrefixCls)
    return (
      <ClearableLabeledInput
        {...this.props}
        prefixCls={prefixCls}
        inputType="input"
        value={fixControlledValue(value)}
        element={this.renderInput(prefixCls)}
        handleReset={this.handleReset}
        ref={this.saveClearableInput}
      />
    )
  }

  handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    this.setValue(e.target.value)
    resolveOnChange(this.input, e, this.props.onChange)
  }

  handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { onBlur } = this.props
    if (onBlur) {
      onBlur(e)
    }
  }

  handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { onPressEnter, onKeyDown } = this.props
    if (e.keyCode === 13 && onPressEnter) {
      onPressEnter(e)
      this.blur()
    }
    if (onKeyDown) {
      onKeyDown(e)
    }
  }

  render () {
    return this.renderComponent()
  }
}

export default Input
