import type { ApiResponseType } from '@basic-comp/components/type'
import type { ExtractPropTypes, InjectionKey, PropType, Ref } from 'vue'

export interface ConfigProviderSearchProps {
  export?: boolean,
}
export interface ConfigProviderTableProps {
  arrayName?: string,
  totalName?: string,
}
export interface ConfigProviderSelectProps {
  label?: string,
  value?: string,
  arrayName?: string,
  apis?: Record<string, () => Promise<ApiResponseType>>
}
export interface ConfigProviderPaginationProps {
  pageName?: string
  pageSizeName?: string
}
export interface ConfigProviderDatePicker {
  valueFormat?: string,
}
export const configProviderProps = {
  pagination: {
    type: Object as PropType<ConfigProviderPaginationProps>,
  },
  table: {
    type: Object as PropType<ConfigProviderTableProps>,
  },
  search: {
    type: Object as PropType<ConfigProviderSearchProps>,
  },
  select: {
    type: Object as PropType<ConfigProviderSelectProps>,
  },
  response: {
    type: Object as PropType<{ code?: string, msg?: string, data?: string }>,
  },
  datePicker: {
    type: Object as PropType<ConfigProviderDatePicker>,
    default: (): ConfigProviderDatePicker => ({
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    }),
  },
}
export type ConfigProviderProps = Partial<ExtractPropTypes<typeof configProviderProps>>

export const configProviderContextKey: InjectionKey<Ref<ConfigProviderProps>> = Symbol('configProviderContextKey')
