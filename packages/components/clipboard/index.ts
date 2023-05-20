import Clipboard from './src/clipboard.vue'
import { compInstall } from '@basic-comp/utils'

export const BcClipboard = compInstall(Clipboard)
export default BcClipboard

export * from './src/type'
