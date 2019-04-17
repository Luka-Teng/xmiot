import React, { Component } from 'react'
import { Input } from 'antd'
import { SketchPicker } from 'react-color'

import { FormItemProps } from '../types'
import { wrapField } from './utils'

type ColorPickerStates = {
  pickerVisible: boolean
  selectedColor?: string
}

const getRgbaObject = (rgba: string) => {
  const pattern = /^rgba\((\s*\d{1,3}\s*),(\s*\d{1,3}\s*),(\s*\d{1,3}\s*),(\s*\d{1,3}\s*)\)$/
  if (pattern.test(rgba)) {
    const values = rgba.match(pattern)
    if (values) {
      return {
        r: values[1],
        g: values[2],
        b: values[3],
        a: values[4]
      }
    }
    return null
  }
  return null
}

class ColorPicker extends Component<
  FormItemProps<'colorPicker'>,
  ColorPickerStates
> {
  constructor(props: FormItemProps<'colorPicker'>) {
    super(props)
    document.addEventListener('click', e => {
      const picker = document.querySelector('.sketch-picker')
      if (
        picker &&
        !(picker.parentElement as Element).contains(e.target as Element)
      ) {
        this.hidePicker()
      }
    })

    const { config: { initialValue = 'rgba(0, 0, 0, 1)' } = {} } = this.props
    this.state = {
      pickerVisible: false,
      selectedColor: initialValue
    }
  }

  showPicker = () => {
    this.setState({
      pickerVisible: true
    })
  }

  handleChangeComplete = (color: any) => {
    const {
      form: { setFieldsValue },
      name
    } = this.props
    const {
      rgb: { r, g, b, a }
    } = color
    this.setState({
      selectedColor: `rgba(${r}, ${g}, ${b}, ${a})`
    })
    setFieldsValue({
      [name]: `rgba(${r}, ${g}, ${b}, ${a})`
    })
  }

  hidePicker = () => {
    this.setState({
      pickerVisible: false
    })
  }

  render() {
    const {
      name,
      label,
      styles,
      config: { initialValue = 'rgba(0, 0, 0, 1)', rules = [] } = {},
      form: { getFieldDecorator, getFieldValue }
    } = this.props

    const { pickerVisible } = this.state

    const colors = [
      '#4D4D4D',
      '#999999',
      '#FFFFFF',
      '#F44E3B',
      '#FE9200',
      '#FCDC00',
      '#DBDF00',
      '#A4DD00',
      '#68CCCA',
      '#73D8FF',
      '#AEA1FF',
      '#FDA1FF',
      '#333333',
      '#808080',
      '#cccccc',
      '#D33115',
      '#E27300',
      '#FCC400',
      '#B0BC00',
      '#68BC00',
      '#16A5A5',
      '#009CE0',
      '#7B64FF',
      '#FA28FF',
      '#000000',
      '#666666',
      '#B3B3B3',
      '#9F0500',
      '#C45100',
      '#FB9E00',
      '#808900',
      '#194D33',
      '#0C797D',
      '#0062B1',
      '#653294',
      '#AB149E'
    ]

    return wrapField(
      getFieldDecorator(name, {
        initialValue,
        rules
      })(
        <Input
          onFocus={this.showPicker}
          prefix={
            <div
              style={{
                backgroundColor: getFieldValue(name),
                ..._styles.prefixStyles
              }}
            />
          }
        />
      ),
      {
        appendElement: pickerVisible ? (
          <SketchPicker
            onChangeComplete={this.handleChangeComplete}
            color={this.state.selectedColor}
            width="300px"
            presetColors={colors}
          />
        ) : null
      },
      name,
      label
    )
  }
}

const _styles = {
  prefixStyles: {
    width: '15px',
    height: '15px',
    borderRadius: '2px'
  }
}

export default ColorPicker
