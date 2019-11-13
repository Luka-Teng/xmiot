import React from 'react'
import { ExportedFunc } from './buildForm'
import { Field } from './FieldStore'

type CompositeSyntheticEvent = React.SyntheticEvent & {
  target: {
    value: any
  }
}

type Props = {
  name: string
  initialValue?: any
  validates?: Field['validates']
  valuePropName?: string
  trigger?: string
}

const buildFormItem = (context: React.Context<ExportedFunc>) => {
  return class FormItem extends React.Component<Props> {
    static contextType = context

    prevProps: Props | null = null

    /* 设置默认值，会被覆盖 */
    context: ExportedFunc = null as any
  
    componentWillUnmount () {
      // 删除field
      this.context.removeField(this.props.name)
    }
  
    onChange = (e: CompositeSyntheticEvent) => {
      // 添加变化事件依赖
      this.context.setFieldValue(this.props.name, e.target.value)
      this.context.validateField(this.props.name)
    }
  
    manageProps = (props: Props) => {
      if (!this.context) {
        throw new Error('FormItem should be inside the Form Component')
      }

      const { name, initialValue, validates, valuePropName, trigger } = this.props

      /**
       * 这边只需要对name做diff，直接赋值效率更高
       * validate重新赋值
       * value重新赋值
       * name判断是否一致，否则删除field，并重新绑定
       */
      if (this.prevProps === null || this.prevProps.name !== name) {
        this.prevProps && this.context.removeField(this.prevProps.name)
        this.context.addField(name, {
          value: initialValue,
          validates,
          ref: this,
          valuePropName,
          trigger
        })
      } else {
        /* forceUpdate在事件中也会被合并，所以不用担心触发多次 */
        this.context.setFieldValidates(name, validates || [])
        this.context.setFieldValueWithDirty(name, initialValue)
      }

      this.prevProps = this.props
    }

    buildChildren = (children: React.ReactNode) => {
      const { valuePropName, trigger, errors } = this.context.getCriticalProps(this.props.name)
      const value = this.context.getFieldValue(this.props.name)
      
      if (React.isValidElement(children)) {
        return React.cloneElement(children, {
          [trigger]: (e: CompositeSyntheticEvent) => {
            children.props.onChange && children.props.onChange(e)
            this.onChange(e)
          },
          [valuePropName]: value
        })
      } else if (children instanceof Array) {
        throw new Error('FormItem的只能存在一个子元素')
      }
      
      return children
    }
  
    render () {
      this.manageProps(this.props)
      const children = this.buildChildren(this.props.children)

      return <div>{children}</div>
    }
  }
}



export default buildFormItem