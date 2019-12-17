import React, { Children } from 'react'
import classNames from 'classnames'
import RcSelect, {
  Option as RcOption,
  OptGroup as RcOptionGroup,
  SelectProps
} from 'rc-select'
import { OptionData } from 'rc-select/lib/interface/index'
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
  onChange?: (e: Event) => void
}

export interface OptGroupProps {
  label?: React.ReactNode
}

const Option = (RcOption as {}) as React.FC<OptionProps>

const OptionGroup = (RcOptionGroup as {}) as React.FC<OptGroupProps>

class Select extends React.Component<Props> {
  static Option = (Option as {}) as React.FC<OptionProps>

  static OptGroup = (OptionGroup as {}) as React.FC<OptGroupProps>

  private rcSelect: any

  isCombobox = () => {
    const { mode } = this.props
    return mode === 'combobox'
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
      ...restProps
    } = this.props

    const prefixCls = 'rc-select'
    const cls = classNames(
      {
        [`${prefixCls}-lg`]: size === 'large',
        [`${prefixCls}-sm`]: size === 'small',
        [`${prefixCls}-mid`]: size === 'mid',
        [`${prefixCls}-show-arrow`]: showArrow
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
        : removeIcon)) || <span className={`${prefixCls}-remove-icon`} />

    const finalClearIcon = (clearIcon &&
      (React.isValidElement<{ className?: string }>(clearIcon)
        ? React.cloneElement(clearIcon, {
            className: classNames(
              clearIcon.props.className,
              `${prefixCls}-clear-icon`
            )
          })
        : clearIcon)) || <span className={`${prefixCls}-clear-icon`}>ii</span>

    const modeConfig = {
      multiple: this.props.mode === 'multiple',
      tags: this.props.mode === 'tags',
      combobox: this.isCombobox()
    }

    let { optionLabelProp } = this.props
    const { ...rest } = this.props

    if (this.isCombobox()) {
      // children 带 dom 结构时，无法填入输入框
      optionLabelProp = optionLabelProp || 'value'
    }

    const restChange = (value: any) => {
      if (onChange) {
        onChange({
          target: {
            value: value
          }
        } as any)
      }
    }

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
