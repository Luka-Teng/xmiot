import React, { Component } from 'react'
import ReactDom from 'react-dom'
import FieldStore, { Field } from './FieldStore'
import { isArray } from './utils'
import wrongPng from '../assets/wrong.png'

type FormFuncs = {
  addField: (
    name: string,
    options: Pick<Field<string>, 'initialValue'> &
      Partial<
        Pick<Field<string>, 'validates' | 'ref' >
      >
  ) => void
  removeField: (name: string) => void
  getFieldValue: (name: string) => any
  getFieldsValue: (names: string[]) => any[]
  getFieldErrors: (name: string) => any[]
  setFieldValue: (name: string, value: any) => void
  setFieldsValue: (fields: { [x: string]: any }) => void
  setFieldValueWithDirty: (name: string, value: any) => void
  setFieldValidates: (
    name: string,
    validates: Field<string>['validates']
  ) => void
  validateField: (name: string, callback?: Function) => void
  validateFields: ((names: string[], callback?: Function | undefined) => void) &
    ((callback?: Function | undefined) => void)
  validateFieldsToScroll: ((
    names: string[],
    callback?: Function | undefined
  ) => void) &
    ((callback?: Function | undefined) => void)
  resetFieldValue: (name: string) => void
  resetFieldsValue: (names?: string[]) => void
}

type State = {
  hasError: boolean
}

export type ExportedFunc = Pick<
  FormFuncs,
  | 'addField'
  | 'removeField'
  | 'getFieldValue'
  | 'setFieldValue'
  | 'setFieldValueWithDirty'
  | 'setFieldValidates'
  | 'validateField'
  | 'getFieldErrors'
>

const buildForm = (Provider: React.Provider<ExportedFunc>) => {
  return class Form extends Component<{}, State> {
    fieldStore = new FieldStore()

    state = {
      hasError: false
    }

    static getDerivedStateFromError (error: any) {
      if (error) {
        console.error(error)
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
      this.fieldStore.removeField(name)
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
      this.fieldStore.validateField(name, (_name: string, errors: any) => {
        this.fieldStore.updateField(_name)
        callback && callback(errors)
      })
    }

    validateFields: FormFuncs['validateFields'] = (arg1?: any, arg2?: any) => {
      let names: string[] = []
      let callback: Function | null = null

      if (isArray(arg1)) {
        names = arg1
        callback = arg2 || callback
      } else {
        names = this.fieldStore.getFieldsKeys()
        callback = arg1 || callback
      }

      this.fieldStore.validateFields(names, (_names, errors) => {
        _names.forEach(name => {
          this.fieldStore.updateField(name)
        })
        callback && callback(errors)
      })
    }

    validateFieldsToScroll: FormFuncs['validateFieldsToScroll'] = (
      arg1?: any,
      arg2?: any
    ) => {
      let names: string[] = []
      let callback: Function | null = null

      if (isArray(arg1)) {
        names = arg1
        callback = arg2 || callback
      } else {
        names = this.fieldStore.getFieldsKeys()
        callback = arg1 || callback
      }

      this.fieldStore.validateFields(names, (_names: string[], errors: any) => {
        if (errors) {
          const firstError = errors[0]
          const firstErrorField = this.fieldStore.getField(firstError.field)
          if (firstErrorField && firstErrorField.ref) {
            const dom = ReactDom.findDOMNode(firstErrorField.ref) as Element
            dom &&
              dom.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
              })
          }
        }
        _names.forEach(name => {
          this.fieldStore.updateField(name)
        })
        callback && callback(errors)
      })
    }

    resetFieldValue: FormFuncs['resetFieldValue'] = name => {
      this.fieldStore.resetFieldValue(name, field => {
        field && this.fieldStore.updateField(field.name)
      })
    }

    resetFieldsValue: FormFuncs['resetFieldsValue'] = names => {
      names = names || this.fieldStore.getFieldsKeys()
      this.fieldStore.resetFieldsValue(names, field => {
        field && this.fieldStore.updateField(field.name)
      })
    }

    render () {
      const { children } = this.props
      return !this.state.hasError ? (
        <Provider
          value={{
            addField: this.addField,
            removeField: this.removeField,
            setFieldValue: this.setFieldValue,
            setFieldValueWithDirty: this.setFieldValueWithDirty,
            setFieldValidates: this.setFieldValidates,
            getFieldValue: this.getFieldValue,
            validateField: this.validateField,
            getFieldErrors: this.getFieldErrors
          }}
        >
          <div>{children}</div>
        </Provider>
      ) : (
        <div style={styles.wrongDiv}>
          <img src={wrongPng} alt="wentWrong" />
          <p style={styles.wrongP}>Something wrong in this Form, please check the error log.</p>
        </div>
      )
    }
  }
}

const styles: ReactStyle = {
  wrongDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  wrongP: {
    margin: '10px 0px 0px',
    color: '#666',
    fontSize: '15px'
  }
}

export default buildForm
