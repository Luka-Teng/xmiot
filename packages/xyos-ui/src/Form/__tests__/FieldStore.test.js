import FieldStore from '../lib/FieldStore'

describe('FieldStore in module(xyos-ui/Form)', () => {
  /* the instance of FieldStore */
  let store

  let getInitialField = name => ({
    name: name,
    dirty: false,
    validates: [],
    value: undefined,
    initialValue: undefined,
    errors: [],
    ref: null
  })

  beforeEach(() => {
    store = new FieldStore()
  })

  it('setField could initialize a new field', () => {
    store.setField('a')
    expect(store.fields.a).toMatchObject(getInitialField('a'))
  })

  it('setField could override an existing field', () => {
    store.setField('a', { initialValue: 'next' })
    expect(store.fields.a.value).toBe('next')
  })

  it('getField须返回field对象，如果发现field存在', () => {
    store.setField('a')
    expect(store.getField('b')).toBeUndefined()
    expect(store.getField('a')).not.toBeUndefined()
  })

  it('resetFieldValue会dirty，error，value三个值进行初始化', () => {
    store.setField('a', {
      dirty: true,
      errors: ['aaa']
    })
    store.setField('a', {
      value: 222
    })
    expect(store.getField('a')).toMatchObject({
      name: 'a',
      dirty: true,
      validates: [],
      value: 222,
      errors: ['aaa'],
      initialValue: undefined,
      ref: null
    })
    store.resetFieldValue('a')
    expect(store.getField('a')).toMatchObject({
      name: 'a',
      dirty: false,
      validates: [],
      value: undefined,
      errors: [],
      initialValue: undefined,
      ref: null
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
