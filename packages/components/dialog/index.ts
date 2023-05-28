import Dialog from './src/dialog.vue'
import { createDialog as dialogFn } from './src/createDialog'
import { compInstall, fnInstall } from '@basic-comp/utils'

export const BcDialog = compInstall(Dialog)
export default BcDialog

export const createDialog = fnInstall(dialogFn)

export * from './src/type'
