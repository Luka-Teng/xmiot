import React, { createContext } from 'react'
import buildForm, { ExportedFunc } from './buildForm'
import buildFormItem from './buildFormItem'

const createForm = (): [ReturnType<typeof buildForm>, ReturnType<typeof buildFormItem>] => {
  const FormContext = createContext<ExportedFunc>(null as any)
  const Form = buildForm(FormContext.Provider)
  const FormItem = buildFormItem(FormContext)
  return [Form, FormItem]
}

export default createForm