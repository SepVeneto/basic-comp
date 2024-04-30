import Table from './src/table'
import { compInstall } from '@basic-comp/utils'

export const BcTable = compInstall<typeof Table>(Table)
export default BcTable

export * from './src/type'
