import React, { Component } from 'react'
import ReactDom from 'react-dom'
import FieldStore, { Field } from './FieldStore'

type FormFuncs = {
  addField: (
    name: string,
    options: Pick<Field<string>, "value"> & Partial<Pick<Field<string>, "validates" | 'ref' | 'valuePropName' | 'trigger'>>) => void
  removeField: (name: string) => void
  getFieldValue: (name: string) => any
  getFieldsValue: (names: string[]) => any[]
  getCriticalProps: (name: string) => { trigger: string, valuePropName: string, errors: string[] }
  setFieldValue: (name: string, value: any) => void
  setFieldsValue: (fields: { [x: string]: any }) => void
  setFieldValueWithDirty: (name: string, value: any) => void
  setFieldValidates: (name: string, validates: Field<string>['validates']) => void
  validateField: (name: string, callback?: Function) => void
  validateFields: (names: string[], callback?: Function | undefined) => void
  validateFieldsToScroll: (names: string[], callback?: Function | undefined) => void
}

export type ExportedFunc = Pick<FormFuncs, 
  'addField' | 'removeField' | 'getFieldValue' | 'getCriticalProps' | 'setFieldValue' | 'setFieldValueWithDirty' | 'setFieldValidates' | 'validateField'
>

const buildForm = (Provider: React.Provider<ExportedFunc>) => {

  return class Form extends Component {
    fieldStore = new FieldStore()
  
    addField: FormFuncs['addField'] = (name, options) => {
      if (this.fieldStore.getField(name)) {
        throw new Error('存在相同的fieldName')
      }
      this.fieldStore.setField(name, options)
    }
  
    removeField: FormFuncs['removeField'] = (name) => {
      this.removeField(name)
    }
  
    getFieldValue: FormFuncs['getFieldValue'] = (name) => {
      return this.fieldStore.getFieldValue(name)
    }
  
    getFieldsValue: FormFuncs['getFieldsValue'] = (names) => {
      return this.fieldStore.getFieldsValue(names)
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
      this.fieldStore.setFieldDirty('name')
      this.fieldStore.setFieldValue({
        name,
        value
      }, (field) => {
        field && this.fieldStore.updateField(name)
      })
    }

    setFieldValueWithDirty: FormFuncs['setFieldValueWithDirty'] = (name, value) => {
      // 需要把field设置为dirty
      this.fieldStore.setFieldDirty(name)
      this.fieldStore.setFieldValue({
        name,
        value,
        checkDirty: true
      })
    }
  
    setFieldsValue: FormFuncs['setFieldsValue'] = (fields) => {
      const names = Object.keys(fields)

      // 需要把field设置为dirty
      this.fieldStore.setFieldsDirty(names)

      names.forEach(name => {
        this.fieldStore.setFieldValue({
          name,
          value: fields[name]
        }, (field) => {
          field && this.fieldStore.updateField(name)
        })
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

    validateFieldsToScroll: FormFuncs['validateFieldsToScroll'] = (names, callback) => {
      this.fieldStore.validateFields(names, (errors: any) => {
        if (errors) {
          const firstError = errors[0]
          const firstErrorField = this.fieldStore.getField(firstError.field)
          if (firstErrorField && firstErrorField.ref) {
            const dom = ReactDom.findDOMNode(firstErrorField.ref)
            dom && window.scrollTo({
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
  
    render () {
      (window as any).i = this
      return (
        <Provider value={{
          addField: this.addField,
          removeField: this.removeField,
          setFieldValue: this.setFieldValue,
          setFieldValueWithDirty: this.setFieldValueWithDirty,
          setFieldValidates: this.setFieldValidates,
          getFieldValue: this.getFieldValue,
          getCriticalProps: this.getCriticalProps,
          validateField: this.validateField
        }}>
          { this.props.children }
        </Provider>
      )
    }
  }
}



export default buildForm