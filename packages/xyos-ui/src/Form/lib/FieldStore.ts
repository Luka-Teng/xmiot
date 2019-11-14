import schema, { RuleItem, ErrorList } from 'async-validator'
import React from 'react'
import { is, params } from './utils'

export type Field<T extends string = string> = {
  name: T
  dirty: boolean
  trigger: string
  valuePropName: string
  validates: RuleItem[]
  value: any
  errors: string[]
  ref: React.Component
}

type Fields = { [key in string]: Field<key> }

type ValidateDescriptor = { [key in string]: RuleItem[] }

/* 实际上错误是会返回undefined */
type ActualErrorList = ErrorList | undefined

class FieldStore {
  fields: Fields = {}

  /* set a field */
  @params('string', ['object', 'undefined'])
  setField = (
    name: string,
    options?: Partial<Omit<Fields[string], 'name'>>
  ) => {
    const field = (this.fields[name] = this.fields[name] || {})
    field.name = name
    field.dirty = (options && options.dirty) || field.dirty || false
    field.trigger = (options && options.trigger) || field.trigger || 'onChange'
    field.valuePropName =
      (options && options.valuePropName) || field.valuePropName || 'value'
    field.validates = (options && options.validates) || field.validates || []
    field.value = (options && options.value) || field.value || ''
    field.errors = (options && options.errors) || field.errors || []
    field.ref = (options && options.ref) || field.ref || null
  }

  /* get a field */
  @params('string')
  getField = (name: string) => {
    if (this.fields[name]) {
      return this.fields[name]
    }
  }

  /* remove a field */
  @params('string')
  removeField =(name: string) => {
    if (this.fields[name]) {
      delete this.fields[name]
    }
  }

  /* reset a field */
  @params('string')
  resetFieldValue = (name: string) => {
    if (this.fields[name]) {
      this.fields[name].dirty = false
      this.fields[name].value = null
      this.fields[name].errors = []
    }
  }

  /* reset a set of fields */
  @params('array')
  resetFieldsValue = (names: string[]) => {
    names.forEach(name => {
      this.resetFieldValue(name)
    })
  }

  /* get the value of a field */
  @params('string')
  getFieldValue = (name: string) => {
    if (this.fields[name]) {
      return this.fields[name].value
    }
  }

  /* get values of a set of fields */
  @params('array')
  getFieldsValue = (names: string[]) => {
    return names.map(name => {
      return this.getFieldValue(name)
    })
  }

  /* set the value of a field */
  @params('object', ['function', 'undefined'])
  setFieldValue = (field: {
    name: string
    value: any
    checkDirty?: boolean
  }, callback?: (field: Field | undefined) => void) => {
    const { name, checkDirty = false, value } = field
    is(name, 'string', 'name must be a string')
    is(checkDirty, ['boolean', 'undefined'], 'checkDirty must be a boolean')

    if (checkDirty && this.fields[name]) {
      this.fields[name].value = this.fields[name].dirty
        ? this.fields[name].value
        : value
    }

    if (!checkDirty && this.fields[name]) {
      this.fields[name].value = value
    }

    callback && callback(this.fields[name])
  }

  /* get the errors of a field */
  @params('string')
  getFieldErrors = (name: string) => {
    const field = this.getField(name)
    return field ? field.errors : []
  }

  /* update errors for a field, remove old errors, and apply new errors */
  updateFieldErrors = (errors: ActualErrorList, names: string[]) => {
    errors = errors || []

    const errorMap = errors.reduce<{ [key in string]: string[] }>(
      (acc, error) => {
        const { field, message } = error
        if (!acc[field]) acc[field] = []
        acc[field].push(message)
        return acc
      },
      {}
    )

    names.forEach(name => {
      this.getField(name) &&
        this.setField(name, {
          errors: errorMap[name] || []
        })
    })
  }

  /* validate a field */
  @params('string', ['function', 'undefined'])
  validateField = (name: string, callback?: Function) => {
    if (this.fields[name] && this.fields[name].validates.length > 0) {
      const validator = new schema({ [name]: this.fields[name].validates })
      validator.validate(
        { [name]: this.fields[name].value },
        {},
        (errors: ActualErrorList) => {
          callback && callback(errors)
          this.updateFieldErrors(errors, [name])
        }
      )
    }
  }

  /* validate fields */
  @params('array', ['function', 'undefined'])
  validateFields = (names: string[], callback?: Function) => {
    let descriptor: ValidateDescriptor = {}
    let values: { [key in string]: any } = {}

    names.forEach(name => {
      if (this.fields[name] && this.fields[name].validates.length > 0) {
        descriptor[name] = this.fields[name].validates
        values[name] = this.fields[name].value
      }
    })

    const validator = new schema(descriptor)

    validator.validate(values, {}, (errors: ActualErrorList) => {
      callback && callback(errors)
      this.updateFieldErrors(errors, names)
    })
  }

  /* update the field */
  @params('string')
  updateField = (name: string) => {
    const field = this.getField(name)
    field && field.ref && field.ref.forceUpdate()
  }
  
  /* set a field dirty */
  @params('string')
  setFieldDirty = (name: string) => {
    this.getField(name) && this.setField(name, { dirty: true })
  }

  /* set a set of fields dirty */
  @params('array')
  setFieldsDirty = (names: string[]) => {
    names.forEach(name => {
      this.setFieldDirty(name)
    })
  }

  @params('string')
  isDirty = (name: string) => {
    if (this.fields[name]) {
      return this.fields[name].dirty
    }
  }
}

export default FieldStore
