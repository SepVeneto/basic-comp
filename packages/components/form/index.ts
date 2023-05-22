import Form from './src/form.vue'
import FormItem from './src/formItem.vue'
import { compInstall } from '@basic-comp/utils'

const _Form = compInstall(Form)
const _FormItem = compInstall(FormItem)

export default _Form
export const BcForm = _Form
export const BcFormItem = _FormItem
export * from './src/constants'
export * from './src/hooks'
