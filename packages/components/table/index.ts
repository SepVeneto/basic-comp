import { compInstall } from '@basic-comp/utils'
import Table from './src/table.vue'

export const BcTable: typeof Table = compInstall<typeof Table>(Table)
export default BcTable

export * from './src/type'
