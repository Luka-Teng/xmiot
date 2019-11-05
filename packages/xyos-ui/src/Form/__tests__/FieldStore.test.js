import FieldStore from '../FieldStore'

describe('FieldStore in module(xyos-ui/Form)', () => {
  /* the instance of FieldStore */
  let store

  let getInitialField = name => ({
    name: name,
    dirty: false,
    trigger: 'onChange',
    valuePropName: 'value',
    validates: [],
    value: null,
    errors: []
  })

  beforeEach(() => {
    store = new FieldStore()
  })

  it('setField could initialize a new field', () => {
    store.setField('a')
    expect(store.fields.a).toMatchObject(getInitialField('a'))
  })

  it('setField could override an existing field', () => {
    store.setField('a', { value: 'prev', trigger: 'onSelect' })
    store.setField('a', { value: 'next' })
    expect(store.fields.a.value).toBe('next')
    expect(store.fields.a.trigger).toBe('onSelect')
  })

  it('getField须返回field对象，如果发现field存在', () => {
    store.setField('a')
    expect(store.getField('b')).toBeUndefined()
    expect(store.getField('a')).not.toBeUndefined()
  })

  it('resetFieldValue会dirty，error，value三个值进行初始化', () => {
    store.setField('a', {
      dirty: true,
      errors: ['aaa'],
      value: '2222',
      trigger: 'onSelect'
    })
    expect(store.getField('a')).toMatchObject({
      name: 'a',
      dirty: true,
      trigger: 'onSelect',
      valuePropName: 'value',
      validates: [],
      value: '2222',
      errors: ['aaa']
    })
    store.resetFieldValue('a')
    expect(store.getField('a')).toMatchObject({
      name: 'a',
      dirty: false,
      errors: [],
      trigger: 'onSelect',
      valuePropName: 'value',
      validates: [],
      value: null
    })
  })

  it('validateField会将错误存储在filed.errors上', () => {
    store.setField('a', {
      validates: [
        {
          required: true,
          message: 'ccc'
        },
        {
          pattern: /^aaa/,
          message: 'aaa'
        },
        {
          pattern: /^bbb/,
          message: 'bbb'
        }
      ]
    })
    store.validateField('a')
    expect(store.fields.a.errors).toMatchObject(['ccc'])
    store.setFieldValue({ name: 'a', value: '111' })
    store.validateField('a')
    expect(store.fields.a.errors).toMatchObject(['aaa', 'bbb'])
  })

  it('validateFields会将错误存储在对应的filed.errors上', () => {
    store.setField('a', {
      validates: [
        {
          pattern: /^aaa/,
          message: 'aaa'
        },
        {
          pattern: /^bbb/,
          message: 'bbb'
        }
      ]
    })
    store.setField('b', {
      validates: [
        {
          pattern: /^aaa/,
          message: 'ddd'
        },
        {
          pattern: /^bbb/,
          message: 'eee'
        }
      ]
    })
    store.setFieldsValue([
      { name: 'a', value: '111' },
      { name: 'b', value: '111' }
    ])
    store.validateFields(['a', 'b'])
    expect(store.fields.a.errors).toMatchObject(['aaa', 'bbb'])
    expect(store.fields.b.errors).toMatchObject(['ddd', 'eee'])
  })
})
