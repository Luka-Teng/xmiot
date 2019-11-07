import schema, { RuleItem, ErrorList } from 'async-validator'

type Field<T extends string = string> = {
  name: T
  dirty: boolean
  trigger: string
  valuePropName: string
  validates: RuleItem[]
  value: any
  errors: string[]
}

type Fields = { [key in string]: Field<key> }

type ValidateDescriptor = { [key in string]: RuleItem[] }

/* 实际上错误是会返回undefined */
type ActualErrorList = ErrorList | undefined

class FieldStore {
  fields: Fields = {}

  /* set a field */
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
    field.value = (options && options.value) || field.value || null
    field.errors = (options && options.errors) || field.errors || []
  }

  /* get a field */
  getField = (name: string) => {
    if (this.fields[name]) {
      return this.fields[name]
    }
  }

  /* remove a field */
  removeField = (name: string) => {
    if (this.fields[name]) {
      delete this.fields[name]
    }
  }

  /* reset a field */
  resetFieldValue = (name: string) => {
    if (this.fields[name]) {
      this.fields[name].dirty = false
      this.fields[name].value = null
      this.fields[name].errors = []
    }
  }

  /* reset a set of fields */
  resetFieldsValue = (names: string[]) => {
    names.forEach(name => {
      this.resetFieldValue(name)
    })
  }

  /* get the value of a field */
  getFieldValue = (name: string) => {
    if (this.fields[name]) {
      return this.fields[name].value
    }
  }

  /* get values of a set of fields */
  getFieldsValue = (names: string[]) => {
    return names.map(name => {
      return this.getFieldValue(name)
    })
  }

  /* set the value of a field */
  setFieldValue = (field: {
    name: string
    value: any
    checkDirty?: boolean
  }) => {
    const { name, checkDirty = false, value } = field

    if (checkDirty && this.fields[name]) {
      this.fields[name].value = this.fields[name].dirty
        ? this.fields[name].value
        : value
    }

    if (!checkDirty && this.fields[name]) {
      this.fields[name].value = value
    }
  }

  /* set values of a set of fields */
  setFieldsValue = (
    fields: {
      name: string
      value: any
      checkDirty?: boolean
    }[]
  ) => {
    fields.forEach(field => {
      this.setFieldValue(field)
    })
  }

  /* update errors for a field, remove old errors, and apply new errors */
  updateFieldErrors = (errors: ActualErrorList) => {
    if (errors === undefined) return

    const errorMap = errors.reduce<{ [key in string]: string[] }>(
      (acc, error) => {
        const { field, message } = error
        if (!acc[field]) acc[field] = []
        acc[field].push(message)
        return acc
      },
      {}
    )

    Object.keys(errorMap).forEach(name => {
      this.getField(name) &&
        this.setField(name, {
          errors: errorMap[name]
        })
    })
  }

  /* validate a field */
  validateField = (name: string) => {
    if (this.fields[name] && this.fields[name].validates.length > 0) {
      const validator = new schema({ [name]: this.fields[name].validates })
      validator.validate(
        { [name]: this.fields[name].value },
        {},
        (errors: ActualErrorList) => {
          this.updateFieldErrors(errors)
        }
      )
    }
  }

  /* validate fields */
  validateFields = (names: string[]) => {
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
      this.updateFieldErrors(errors)
    })
  }
}

export default FieldStore
