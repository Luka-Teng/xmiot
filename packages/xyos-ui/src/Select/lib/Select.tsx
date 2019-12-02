import React, { Children } from 'react'
import classNames from 'classnames'
import RcSelect, { Option as RcOption, SelectProps } from 'rc-select'
import { OptionData } from 'rc-select/lib/interface/index'
// import 'rc-select/assets/index.less'
import './select.less'

interface OptionProps extends OptionData {
  label?: string
  children?: React.ReactNode
  className?: string
}

interface Props extends SelectProps {
  size?: string
  optionLabelProp?: string
}

const Option = (RcOption as {}) as React.FC<OptionProps>

class Select extends React.Component<Props> {
  static Option = (Option as {}) as React.FC<OptionProps>
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
      mode,
      getPopupContainer,
      removeIcon,
      clearIcon,
      menuItemSelectedIcon,
      showArrow,
      ...restProps
    } = this.props

    const prefixCls = 'rc-select'
    const cls = classNames(
      {
        [`${prefixCls}-lg`]: size === 'large',
        [`${prefixCls}-sm`]: size === 'small',
        [`${prefixCls}-show-arrow`]: showArrow
      },
      className
    )

    const modeConfig = {
      multiple: mode === 'multiple',
      tags: mode === 'tags',
      combobox: this.isCombobox()
    }

    const { ...rest } = this.props
    let { optionLabelProp } = this.props

    if (this.isCombobox()) {
      // children 带 dom 结构时，无法填入输入框
      optionLabelProp = optionLabelProp || 'value'
    }

    return (
      <RcSelect
        showArrow={showArrow}
        {...rest}
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

/**
 * 1、符合基本的使用
 * 2、
 *
 */
