import React, { Children } from 'react'
import classNames from 'classnames'
import RcSelect, {
  Option as RcOption,
  OptGroup as RcOptionGroup,
  SelectProps
} from 'rc-select'
import { OptionData } from 'rc-select/lib/interface/index'
import Icon from '../../Icon/index'
import './select.less'

type X = Pick<SelectProps, Exclude<keyof SelectProps, 'onChange'>>

interface OptionProps extends OptionData {
  label?: string
  children?: React.ReactNode
  className?: string
}

interface Props extends X {
  size?: string
  optionLabelProp?: string
  mode?: 'multiple' | 'tags'
  onChange?: (e: Event) => void
}

export interface OptGroupProps {
  label?: React.ReactNode
}

export interface SelectState {
  values: any
}

const Option = (RcOption as {}) as React.FC<OptionProps>

const OptionGroup = (RcOptionGroup as {}) as React.FC<OptGroupProps>

class Select extends React.Component<Props, SelectState> {
  static Option = (Option as {}) as React.FC<OptionProps>

  static OptGroup = (OptionGroup as {}) as React.FC<OptGroupProps>

  private rcSelect: any

  constructor (props: Props) {
    super(props)
    const values =
      typeof props.value === 'undefined' ? props.defaultValue : props.value
    this.state = {
      values
    }
  }

  static getDerivedStateFromProps (nextProps: Props) {
    if ('value' in nextProps) {
      if (!nextProps.value) {
        return {
          values: null
        }
      }
      if (nextProps.labelInValue && !nextProps.mode) {
        return {
          values: {
            value: nextProps.value,
            label: nextProps.value,
            key: nextProps.value
          }
        }
      }

      if (nextProps.mode && !(nextProps.value instanceof Array)) {
        return {
          values: [nextProps.value]
        }
      }

      return {
        values: nextProps.value
      }
    }
    return null
  }

  saveSelect = (node: any) => {
    this.rcSelect = node
  }
  focus () {
    this.rcSelect.focus()
  }

  blur () {
    this.rcSelect.blur()
  }

  setValue (value: any) {
    if (!('value' in this.props)) {
      this.setState({ values: value })
    }
  }

  render () {
    const {
      prefixCls: customizePrefixCls,
      className = '',
      size,
      getPopupContainer,
      removeIcon,
      clearIcon,
      menuItemSelectedIcon,
      showArrow,
      onChange,
      errors,
      value,
      ...restProps
    } = this.props

    const prefixCls = 'rc-select'
    const cls = classNames(
      {
        [`${prefixCls}-lg`]: size === 'large',
        [`${prefixCls}-sm`]: size === 'small',
        [`${prefixCls}-mid`]: size === 'mid',
        [`${prefixCls}-show-arrow`]: showArrow,
        [`${prefixCls}-error`]: errors && errors.length
      },
      className
    )

    const finalRemoveIcon = (removeIcon &&
      (React.isValidElement<{ className?: string }>(removeIcon)
        ? React.cloneElement(removeIcon, {
            className: classNames(
              removeIcon.props.className,
              `${prefixCls}-remove-icon`
            )
          })
        : removeIcon)) || (
      <Icon className={`${prefixCls}-remove-icon`} type="clear" />
    )

    const finalClearIcon = (clearIcon &&
      (React.isValidElement<{ className?: string }>(clearIcon)
        ? React.cloneElement(clearIcon, {
            className: classNames(
              clearIcon.props.className,
              `${prefixCls}-clear-icon`
            )
          })
        : clearIcon)) || (
      <Icon className={`${prefixCls}-clear-icon`} type="clear" />
    )

    const modeConfig = {
      multiple: this.props.mode === 'multiple' ? 'multiple' : null,
      tags: this.props.mode === 'tags' ? 'tags' : null
    }

    let { optionLabelProp } = this.props
    const { ...rest } = this.props

    const restChange = (value: any) => {
      this.setValue(value)
      if (onChange) {
        onChange({
          target: {
            value: value
          }
        } as any)
      }
    }

    const { values } = this.state

    console.log(values, 'values')

    return (
      <RcSelect
        dropdownClassName={
          this.props.mode === 'tags' || this.props.mode === 'multiple'
            ? 'rc-select-groupTag'
            : ''
        }
        showArrow={showArrow}
        clearIcon={finalClearIcon}
        removeIcon={finalRemoveIcon}
        value={typeof values === 'undefined' ? '' : values}
        {...restProps}
        onChange={restChange}
        {...modeConfig}
        prefixCls={prefixCls}
        className={cls}
        optionLabelProp={optionLabelProp || 'children'}
        ref={this.saveSelect}
      />
    )
  }
}

export default Select
