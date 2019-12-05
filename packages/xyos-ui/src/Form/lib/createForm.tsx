import { createContext, createRef } from 'react'
import buildForm, { ExportedFunc } from './buildForm'
import buildFormItem from './buildFormItem'

const createForm = (): [
  ReturnType<typeof buildForm>,
  ReturnType<typeof buildFormItem>
] => {
  const FormContext = createContext<ExportedFunc>(null as any)
  const Form = buildForm(FormContext.Provider)
  const FormItem = buildFormItem(FormContext)
  return [Form, FormItem]
}

export const createFormRef = () => {
  return createRef<
    InstanceType<ReturnType<typeof buildForm>> & HTMLDivElement
  >()
}

export default createForm
