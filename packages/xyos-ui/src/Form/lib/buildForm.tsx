import React, { Component } from 'react'
import ReactDom from 'react-dom'
import FieldStore, { Field } from './FieldStore'

type FormFuncs = {
  addField: (
    name: string,
    options: Pick<Field<string>, 'value'> &
      Partial<
        Pick<Field<string>, 'validates' | 'ref' | 'valuePropName' | 'trigger'>
      >
  ) => void
  removeField: (name: string) => void
  getFieldValue: (name: string) => any
  getFieldsValue: (names: string[]) => any[]
  getFieldErrors: (name: string) => any[]
  getCriticalProps: (
    name: string
  ) => { trigger: string; valuePropName: string; errors: string[] }
  setFieldValue: (name: string, value: any) => void
  setFieldsValue: (fields: { [x: string]: any }) => void
  setFieldValueWithDirty: (name: string, value: any) => void
  setFieldValidates: (
    name: string,
    validates: Field<string>['validates']
  ) => void
  validateField: (name: string, callback?: Function) => void
  validateFields: (names: string[], callback?: Function | undefined) => void
  validateFieldsToScroll: (
    names: string[],
    callback?: Function | undefined
  ) => void
  resetFieldValue: (name: string) => void
  resetFieldsValue: (names?: string[]) => void
}

type State = {
  hasError: boolean
}

type Props = Partial<JSX.IntrinsicElements['div']>

export type ExportedFunc = Pick<
  FormFuncs,
  | 'addField'
  | 'removeField'
  | 'getFieldValue'
  | 'getCriticalProps'
  | 'setFieldValue'
  | 'setFieldValueWithDirty'
  | 'setFieldValidates'
  | 'validateField'
>

const buildForm = (Provider: React.Provider<ExportedFunc>) => {
  return class Form extends Component<Props, State> {
    fieldStore = new FieldStore()

    state = {
      hasError: false
    }

    static getDerivedStateFromError (error: any) {
      if (error) {
        return { hasError: true }
      } else {
        return { hasError: false }
      }
    }

    addField: FormFuncs['addField'] = (name, options) => {
      if (this.fieldStore.getField(name)) {
        throw new Error('存在相同的fieldName')
      }
      this.fieldStore.setField(name, options)
    }

    removeField: FormFuncs['removeField'] = name => {
      this.removeField(name)
    }

    getFieldValue: FormFuncs['getFieldValue'] = name => {
      return this.fieldStore.getFieldValue(name)
    }

    getFieldsValue: FormFuncs['getFieldsValue'] = names => {
      return this.fieldStore.getFieldsValue(names)
    }

    getFieldErrors: FormFuncs['getFieldErrors'] = name => {
      return this.fieldStore.getFieldErrors(name)
    }

    getCriticalProps: FormFuncs['getCriticalProps'] = (name: string) => {
      const field = this.fieldStore.getField(name)
      return {
        trigger: field ? field.trigger : 'onChange',
        valuePropName: field ? field.valuePropName : 'value',
        errors: field ? field.errors : []
      }
    }

    setFieldValue: FormFuncs['setFieldValue'] = (name, value) => {
      // 需要把field设置为dirty
      this.fieldStore.setFieldDirty(name)
      this.fieldStore.setFieldValue(
        {
          name,
          value
        },
        field => {
          field && this.fieldStore.updateField(field.name)
        }
      )
    }

    setFieldValueWithDirty: FormFuncs['setFieldValueWithDirty'] = (
      name,
      value
    ) => {
      // 需要把field设置为dirty
      this.fieldStore.setFieldValue({
        name,
        value,
        checkDirty: true
      })
    }

    setFieldsValue: FormFuncs['setFieldsValue'] = fields => {
      const names = Object.keys(fields)
      const mappedFields = names.map(name => ({
        name,
        value: fields[name]
      }))

      // 需要把field设置为dirty
      this.fieldStore.setFieldsDirty(names)

      this.fieldStore.setFieldsValue(mappedFields, field => {
        field && this.fieldStore.updateField(field.name)
      })
    }

    setFieldValidates: FormFuncs['setFieldValidates'] = (name, validates) => {
      this.fieldStore.setField(name, {
        validates: validates
      })
    }

    validateField: FormFuncs['validateField'] = (name, callback) => {
      this.fieldStore.validateField(name, callback)
      this.fieldStore.updateField(name)
    }

    validateFields: FormFuncs['validateFields'] = (names, callback) => {
      this.fieldStore.validateFields(names, callback)
      names.forEach(name => {
        this.fieldStore.updateField(name)
      })
    }

    validateFieldsToScroll: FormFuncs['validateFieldsToScroll'] = (
      names,
      callback
    ) => {
      this.fieldStore.validateFields(names, (errors: any) => {
        if (errors) {
          const firstError = errors[0]
          const firstErrorField = this.fieldStore.getField(firstError.field)
          if (firstErrorField && firstErrorField.ref) {
            const dom = ReactDom.findDOMNode(firstErrorField.ref)
            dom &&
              window.scrollTo({
                top: (dom as HTMLElement).getBoundingClientRect().top
              })
          }
        }
        callback && callback(errors)
      })
      names.forEach(name => {
        this.fieldStore.updateField(name)
      })
    }

    resetFieldValue: FormFuncs['resetFieldValue'] = name => {
      this.fieldStore.resetFieldValue(name, field => {
        field && this.fieldStore.updateField(field.name)
      })
    }

    resetFieldsValue: FormFuncs['resetFieldsValue'] = names => {
      this.fieldStore.resetFieldsValue(names || 'all', field => {
        field && this.fieldStore.updateField(field.name)
      })
    }

    render () {
      const { children, ...rest } = this.props
      return !this.state.hasError ? (
        <Provider
          value={{
            addField: this.addField,
            removeField: this.removeField,
            setFieldValue: this.setFieldValue,
            setFieldValueWithDirty: this.setFieldValueWithDirty,
            setFieldValidates: this.setFieldValidates,
            getFieldValue: this.getFieldValue,
            getCriticalProps: this.getCriticalProps,
            validateField: this.validateField
          }}
        >
          <div {...rest}>{children}</div>
        </Provider>
      ) : (
        <div>Something went wrong</div>
      )
    }
  }
}

export default buildForm
