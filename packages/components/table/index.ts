import Table from './src/table.vue'
import { compInstall } from '@basic-comp/utils'

export const BcTable: typeof Table = compInstall<typeof Table>(Table)
export default BcTable

export * from './src/type'
