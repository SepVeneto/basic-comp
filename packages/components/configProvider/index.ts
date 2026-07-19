import ConfigProvider from './src/configProvider.vue'
import { compInstall } from '@basic-comp/utils'

export const BcConfigProvider = compInstall(ConfigProvider)
export default BcConfigProvider

export * from './src/type'
