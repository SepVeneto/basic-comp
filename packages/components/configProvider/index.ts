import ConfigProvider from "./src/configProvider";
import { compInstall } from '../type'

export const BcConfigProvider = compInstall(ConfigProvider)
export default BcConfigProvider 

export * from './src/type'