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
  ref: React.Component | null
}

type Fields = { [key in string]: Field<key> }

type ValidateDescriptor = { [key in string]: RuleItem[] }

/* 实际上错误是会返回undefined */
type ActualErrorList = ErrorList | undefined

class FieldStore {
  fields: Fields = {}

  /* 获取fields的keys，用做于缓存 */
  keys: string[] = []

  updateFieldsKeys = () => {
    this.keys = Object.keys(this.fields)
  }

  getFieldsKeys = () => this.keys

  /* set a field */
  @params('string', ['object', 'undefined'])
  setField = (name: string, options: Partial<Omit<Fields[string], 'name'>>) => {
    if (this.fields[name]) {
      this.fields[name] = {
        ...this.fields[name],
        ...options
      }
    } else {
      this.fields[name] = {
        name,
        dirty: options.dirty || false,
        trigger: options.trigger || 'onChange',
        valuePropName: options.valuePropName || 'value',
        validates: options.validates || [],
        value: options.value || '',
        errors: options.errors || [],
        ref: options.ref || null
      }
    }

    this.updateFieldsKeys()
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
  removeField = (name: string) => {
    if (this.fields[name]) {
      delete this.fields[name]
      this.updateFieldsKeys()
    }
  }

  /* reset a field */
  @params('string')
  resetFieldValue = (name: string, callback?: (field: Field) => void) => {
    if (this.fields[name]) {
      this.fields[name].dirty = false
      this.fields[name].value = null
      this.fields[name].errors = []
      callback && callback(this.fields[name])
    }
  }

  /* reset a set of fields */
  @params('array', ['function', 'undefined'])
  resetFieldsValue = (names: string[], callback?: (field: Field) => void) => {
    names.forEach(name => {
      this.resetFieldValue(name, field => {
        callback && callback(field)
      })
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
  setFieldValue = (
    field: {
      name: string
      value: any
      checkDirty?: boolean
    },
    callback?: (field: Field | undefined) => void
  ) => {
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

  /* set the value of a set of field */
  @params('array', ['function', 'undefined'])
  setFieldsValue = (
    fields: {
      name: string
      value: any
      checkDirty?: boolean
    }[],
    callback?: (field: Field | undefined) => void
  ) => {
    fields.forEach(field => {
      this.setFieldValue(field, _field => {
        callback && callback(_field)
      })
    })
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
  validateField = (
    name: string,
    callback?: (name: string, errors: any) => void
  ) => {
    if (this.fields[name] && this.fields[name].validates.length > 0) {
      const validator = new schema({ [name]: this.fields[name].validates })
      validator.validate(
        { [name]: this.fields[name].value },
        {},
        (errors: ActualErrorList) => {
          this.updateFieldErrors(errors, [name])
          callback && callback(name, errors)
        }
      )
    }
  }

  /* validate fields */
  @params(['array'], ['function', 'undefined'])
  validateFields = (
    names: string[],
    callback?: (names: string[], errors: any) => void
  ) => {
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
      this.updateFieldErrors(errors, names as string[])
      callback && callback(names, errors)
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
