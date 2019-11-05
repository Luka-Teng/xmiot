type Fields = {
  [key in string]: {
    name: key
    dirty: boolean
    trigger: string
    valuePropName: string
    validate: any[]
    value: any
  }
}

class FieldStore {
  fields: Fields = {}

  /* get a field */
  setField = (name: string, options: Partial<Omit<Fields[string], 'name'>>) => {
    this.fields[name] = {
      name,
      dirty: options.dirty || false,
      trigger: options.trigger || 'onChange',
      valuePropName: options.valuePropName || 'value',
      validate: options.validate || [],
      value: options.value || null
    }
  }

  /* set a field */
  getField = () => {}

  //
}
