import React from 'react'
import { ExportedFunc } from './buildForm'
import { Field } from './FieldStore'
import { initValueConfig } from './config'

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
  validateTrigger?: string
  errorComponent?: React.ComponentClass<any, any> | React.FunctionComponent<any>
}

const buildFormItem = (context: React.Context<ExportedFunc>) => {
  return class FormItem extends React.Component<Props> {
    static contextType = context

    prevProps: Props | null = null

    /* 设置默认值，会被覆盖 */
    context: ExportedFunc = null as any

    componentWillUnmount () {
      // 删除field，注意的是错误的情况也要
      this.context.removeField(this.props.name)
    }

    onChange = (e: CompositeSyntheticEvent) => {
      // 添加变化事件依赖
      this.context.setFieldValue(this.props.name, e.target.value)
    }

    /**
     * 用于管理fieldStore相关属性的创建和更新
     * react在render中抛出错误，会再实例化一遍Component，并render
     * 导致render方法会在不同实例内render两次、、、
     */
    manageProps = (props: Props) => {
      if (!this.context) {
        throw new Error('FormItem should be inside the Form Component')
      }

      if (this.props.children instanceof Array) {
        throw new Error('FormItem的只能存在一个子元素')
      }

      if (this.props.children === undefined || this.props.children === null) {
        throw new Error('FormItem的子元素不能为空')
      }

      if (typeof this.props.children !== 'object') {
        throw new Error('FormItem的子元素不能为TEXT_NODE')
      }

      let { name, initialValue, validates } = props

      /* 如果没有设置initialValue, 根据initValueConfig配置进行初始值赋值 */
      if (initialValue === undefined) {
        const uniqueName = (this.props.children as genObject).type.uniqueName
        if (uniqueName && initValueConfig[uniqueName]) {
          initialValue = initValueConfig[uniqueName]
        }
      }

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
          ref: this
        })
      } else {
        /**
         * forceUpdate在事件中也会被合并，所以不用担心触发多次
         * valuePropName, trigger几乎不存在改变，因为formItem和wrappedElement只会使用一套valuePropName, trigger
         * 因此99.9%的情况不需要对这两个变量进行重新赋值
         */
        this.context.setFieldValidates(name, validates || [])
        this.context.setFieldValueWithDirty(name, initialValue)
      }

      this.prevProps = props
    }

    /**
     * 将事件绑定在子组件
     */
    buildChildren = (children: React.ReactNode) => {
      const errors = this.context.getFieldErrors(this.props.name)
      const value = this.context.getFieldValue(this.props.name)
      const {
        validateTrigger,
        valuePropName = 'value',
        trigger = 'onChange'
      } = this.props

      if (React.isValidElement(children)) {
        const props = {
          [valuePropName]: value,
          errors: errors
        }

        if (validateTrigger === trigger) {
          props[trigger] = (e: CompositeSyntheticEvent) => {
            children.props[trigger] && children.props[trigger](e)
            this.onChange(e)
            this.context.validateField(this.props.name)
          }
        } else {
          props[trigger] = (e: CompositeSyntheticEvent) => {
            children.props[trigger] && children.props[trigger](e)
            this.onChange(e)
          }
          if (validateTrigger) {
            props[validateTrigger] = (e: CompositeSyntheticEvent) => {
              children.props[validateTrigger] &&
                children.props[validateTrigger](e)
              this.context.validateField(this.props.name)
            }
          }
        }

        return React.cloneElement(children, props)
      }

      return children
    }

    render () {
      const {
        children,
        name,
        initialValue,
        validates,
        errorComponent: ErrorComponent
      } = this.props
      this.manageProps({
        name,
        initialValue,
        validates
      })
      const builtChildren = this.buildChildren(children)
      const errors = this.context.getFieldErrors(name)

      return (
        <div>
          {builtChildren}
          {ErrorComponent ? <ErrorComponent errors={errors} /> : null}
        </div>
      )
    }
  }
}

export default buildFormItem
