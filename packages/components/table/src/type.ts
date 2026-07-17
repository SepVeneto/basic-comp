import type { TableColumnCtx } from 'element-plus/lib/components/table/src/table-column/defaults'
import type { CheckboxProps, PaginationProps, RadioProps } from 'element-plus'
import type Table from './table.vue'

export type RowType = {
  row: any,
  column: TableColumnCtx<Record<string, any>>,
  $index: number,
}

export type CellType = {
  row: Record<string, unknown>,
  rowIndex: number,
  column: TableColumnCtx<Record<string, any>>,
  columnIndex: number,
}

type TableCheckboxOptions = CheckboxProps | RadioProps
export type TableRowSelection = {
  type: 'select' | 'radio',
  preserveRowKeys?: boolean
  selectedRowKeys?: any[]
  onChange?: (selectedKeys: any[], records: CellType['row']) => void
  getCheckboxProps?: (row: CellType['row']) => TableCheckboxOptions
}

export type Colspanoptions = {
  includes: string[],
  parentProp: string | null,
}

type DefaultRow = Record<PropertyKey, any>

export interface TableProps<T extends DefaultRow = DefaultRow> {
  emptyText?: string | ((val: any, column: Record<string, any>) => string)
  /**
   * 远程获取表格数据的字段名，可通过config-provider全局设置，默认rows
   */
  arrayName?: string
  /**
   * 列合并的相关设置
   */
  colspanOptions?: Colspanoptions
  /**
   * 表格的内边距
   */
  padding?: boolean
  /**
   * 自定义表格数据（也就是常规的elementui table的用法）
   */
  custom?: boolean
  /**
   * 表格数据
   */
  data?: T[]
  /**
   * 表格数据的过滤器
   */
  filter?: (data: T[]) => any,
  /**
   * 针对远程数据，是否需要自动获取（created阶段请求数据）
   */
  immediate?: boolean
  /**
   * 是否开启分页功能
   */
  showPagination?: boolean
  pagination?: PaginationProps
  /**
   * 远程数据获取的回调函数，支持promise
   */
  api?: () => Promise<any>,
  /**
   * 表格列的配置
   */
  config: Record<string, any>[]
  /**
   * 常规用法下开启分页功能，需要的总数
   */
  total?: number
  /**
   * 固定底部的横向滚动条（Beta）
   */
  fixXScroll?: boolean,
  /**
   * 简易表格，支持本地分页
   */
  simple?: boolean,
  /**
   * 是否开启接口请求时的loading过渡
   */
  load?: boolean,
  /**
   * 是否禁用activated时自动触发列表更新
   */
  activatedUpdate?: boolean
  rowSelection?: TableRowSelection
}
// export const tableProps = {

//   rowSelection: {
//     type: Object as PropType<>,
//     default: () => ({
//       selectedRowKeys: [],
//       onChange: () => ({}),
//     }),
//   },
// }

export const tableEmits = {
  save: (cell: string, prop: string, record: object) => typeof cell === 'string' && typeof prop === 'string' && typeof record === 'object',
}

// export type TableProps = Partial<ExtractPropTypes<typeof tableProps>>
export type TableInstance = InstanceType<typeof Table>
