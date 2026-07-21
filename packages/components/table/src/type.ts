import type { ApiResponseType } from '@basic-comp/components/type'
import type { CheckboxProps, TableProps as ElTableProps, PaginationProps, RadioProps } from 'element-plus'
import type { TableColumnCtx } from 'element-plus/lib/components/table/src/table-column/defaults'

export interface RowType {
  row: any
  column: TableColumnCtx<Record<string, any>>
  $index: number
}

export interface CellType<T extends DefaultRow> {
  row: T
  rowIndex: number
  column: TableColumnCtx<Record<string, any>>
  columnIndex: number
}

type TableCheckboxOptions = CheckboxProps | RadioProps
export type TableRowSelection<T extends DefaultRow> = {
  type: 'select'
  preserveRowKeys?: boolean
  selectedRowKeys?: PropertyKey[]
  onChange?: (selectedKeys: any[], records: CellType<T>['row']) => void
  getCheckboxProps?: (row: CellType<T>['row']) => TableCheckboxOptions
} | {
  type: 'radio'
  preserveRowKeys?: boolean
  selectedRowKeys?: PropertyKey
  onChange?: (selectedKeys: any, records: CellType<T>['row']) => void
  getCheckboxProps?: (row: CellType<T>['row']) => TableCheckboxOptions
}

export interface Colspanoptions {
  includes: string[]
  parentProp: string | null
}

export type DefaultRow = Record<PropertyKey, any>

/**
 * Application-level table type configuration.
 *
 * Augment this interface when every table response in an application uses the
 * same list field:
 *
 * ```ts
 * declare module '@sepveneto/basic-comp' {
 *   interface GlobalTableProps {
 *     arrayName: 'list'
 *   }
 * }
 * ```
 */
export interface GlobalTableProps {}

export type GlobalTableArrayName = GlobalTableProps extends { arrayName?: infer Name }
  ? Extract<Name, string>
  : never

/** The response data shape selected by a local, global, or default list key. */
export type TableApiData<T extends DefaultRow, Name extends string | undefined = GlobalTableArrayName>
  = [Name] extends [never]
    ? T[]
    : Name extends string
      ? { [K in Name]: T[] }
      : T[]

export type TableApi<T extends DefaultRow, Name extends string | undefined = GlobalTableArrayName>
  = () => Promise<ApiResponseType<TableApiData<T, Name>>>

export type TableApiFunction = () => Promise<ApiResponseType<any>>

/** Extracts the row type from an API response using the resolved list key. */
export type InferTableRow<
  Api extends TableApiFunction | undefined,
  Name extends string | undefined = GlobalTableArrayName,
> = Api extends () => Promise<ApiResponseType<infer Data>>
  ? [Name] extends [never]
      ? Data extends (infer Row)[]
        ? Row extends DefaultRow ? Row : DefaultRow
        : DefaultRow
      : Name extends string
        ? Data extends Record<Name, (infer Row)[]>
          ? Row extends DefaultRow ? Row : DefaultRow
          : DefaultRow
        : DefaultRow
  : DefaultRow

export type TableColumn<T extends DefaultRow> = Record<string, any> & {
  prop?: keyof T & string
  children?: TableColumn<T>[]
  editable?: boolean | ((row: T) => boolean)
}

export interface TableProps<
  T extends DefaultRow,
  Name extends string | undefined = GlobalTableArrayName,
> extends Omit<ElTableProps, 'emptyText'> {
  /**
   * 远程数据获取的回调函数，支持promise
   */
  api?: TableApi<T, Name>
  emptyText?: string | ((val: any, column: Record<string, any>) => string)
  /**
   * 远程获取表格数据的字段名，可通过config-provider全局设置，默认rows
   */
  arrayName?: Name
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
  filter?: (data: T[]) => T[]
  /**
   * 针对远程数据，是否需要自动获取（created阶段请求数据）
   */
  immediate?: boolean
  /**
   * 是否开启分页功能
   */
  showPagination?: boolean
  pagination?: Partial<PaginationProps>
  /**
   * 表格列的配置
   */
  config: TableColumn<T>[]
  /**
   * 常规用法下开启分页功能，需要的总数
   */
  total?: number
  /**
   * 固定底部的横向滚动条（Beta）
   */
  fixXScroll?: boolean
  /**
   * 简易表格，支持本地分页
   */
  simple?: boolean
  /**
   * 是否开启接口请求时的loading过渡
   */
  apiLoad?: boolean
  /**
   * 是否禁用activated时自动触发列表更新
   */
  activatedUpdate?: boolean
  rowSelection?: TableRowSelection<T>
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
