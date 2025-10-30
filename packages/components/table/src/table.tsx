import { computed, defineComponent, onActivated, reactive, ref, watch } from 'vue'
import { useConfigInject } from '@basic-comp/hooks'
import customTable from './customTable'
import customPagination from './pagination.vue'
import { tableEmits, tableProps } from './type'
import type { CellType } from './type'
import type { ApiResponseType } from '@basic-comp/components/type'

export default defineComponent({
  name: 'BcTable',
  components: {
    CustomTable: customTable,
    CustomPagination: customPagination,
  },
  props: tableProps,
  emits: tableEmits,
  setup(props, context) {
    const tableInject = useConfigInject('table')
    const arrayName = computed(() =>
      // @ts-expect-error: vue bug
      tableInject.value?.arrayName || props.arrayName,
    )
    const totalName = computed(() =>
      tableInject.value?.totalName || 'total',
    )

    const paginationInject = useConfigInject('pagination')
    const pageSizeName = computed(() =>
      paginationInject.value?.pageSizeName || 'rows',
    )
    const pageName = computed(() =>
      paginationInject.value?.pageName || 'page',
    )

    const responseInject = useConfigInject('response')
    const responseWrap = computed(() =>
      responseInject.value?.data || 'data',
    )

    const arrayData = ref([])
    const arrayTotal = ref(0)
    const simpleTable = reactive({ page: 1, rows: 5 })
    const loading = ref(false)
    // const tableDataName = ref(arrayName || '');
    const tableConfig = ref<Record<string, unknown>[]>([{}])

    const customTableRef = ref()

    // const configProviderTable = computed(() => table.value)
    // const responseWrap = computed(() => response.value?.data ?? 'data')
    const tableDataName = computed(() => {
      // @ts-expect-error: vue bug
      if (props.arrayName == null) {
        return null
      } else {
        // @ts-expect-error: vue bug
        return (props.arrayName || arrayName.value) ?? ''
      }
    })
    const tableData = computed<Record<string, unknown>[]>(() => {
      // @ts-expect-error: vue bug
      if (props.data && props.data.length > 0) {
        // @ts-expect-error: vue bug
        return props.data || []
      } else {
        // @ts-expect-error: vue bug
        return props.filter ? props.filter(arrayData.value) : arrayData.value
      }
    })

    const totalColumn = computed(() => {
      // @ts-expect-error: vue bug
      const { includes = [], parentProp = null } = props.colspanOptions
      const totalColumn: Record<string, { index: number, num: number }> = {}
      const whiteList: Record<string, number> = {}
      // @ts-expect-error: vue bug
      includes.forEach(item => {
        whiteList[item] = 0
      })
      tableData.value.forEach((row: Record<string, unknown>) => {
        Object.keys(row).forEach(key => {
          if (!Object.keys(whiteList).includes(key)) {
            return
          }
          const spanKey = parentProp
            ? `${row[parentProp]}_${key}_${row[key]}`
            : `${key}_${row[key]}`
          const column = totalColumn[spanKey]
          if (row[key] == null) {
            whiteList[key] += 1
            return
          }
          if (column != null) {
            Object.assign(totalColumn[spanKey], { num: column.num + 1 })
          } else {
            totalColumn[spanKey] = {
              index: whiteList[key],
              num: 1,
            }
          }
          whiteList[key] += 1
        })
      })
      return totalColumn
    })
    const searchModel = computed({
      get() {
        // @ts-expect-error: vue bug
        const { [pageName.value]: page, [pageSizeName.value]: rows, ...params } = props.modelValue
        return { page, rows, ...params }
      },
      set(obj: Record<string, unknown>) {
        updateParams(obj)
      },
    })
    const simpleData = computed(() => {
      const { page, rows } = simpleTable
      const start = (page - 1) * rows
      const end = page * rows
      // @ts-expect-error: vue bug
      return props.data?.slice(start, end)
    })

    // @ts-expect-error: vue bug
    watch(() => props.config, (config: Record<string, unknown>[]) => {
      config && (tableConfig.value = [...config])
    }, { deep: true, immediate: true })

    // @ts-expect-error: vue bug
    if (props.activatedUpdate) {
      onActivated(() => {
        init()
      })
    } else {
      init()
    }
    function init() {
      // @ts-expect-error: vue bug
      if (props.custom) {
        // @ts-expect-error: vue bug
        props.api && props.immediate && props.api()
      } else {
        // @ts-expect-error: vue bug
        if (props.load && props.immediate && props.api) {
          loading.value = true
        }
        // @ts-expect-error: vue bug
        props.api && props.immediate && getList()
      }
    }
    function getList() {
      // @ts-expect-error: vue bug
      if (!props.custom && props.load) {
        loading.value = true
      }
      const wrap = responseWrap.value
      const array = tableDataName.value
      // @ts-expect-error: vue bug
      return props.api?.().then((data: ApiResponseType) => {
        const response = data[wrap] as Record<string, any>
        arrayData.value = (array ? response[array] : data[wrap]) || []
        loading.value = false
        arrayTotal.value = response[totalName.value] || 0
        return Promise.resolve(arrayData.value)
      }).catch(() => {
        loading.value = false
        arrayData.value = []
        arrayTotal.value = 0
      })
    }
    function updateParams(params: Record<string, unknown>) {
      const { page, rows, ...args } = params
      context.emit('update:modelValue', {
        ...args,
        [pageName.value]: page,
        [pageSizeName.value]: rows,
      })
    }
    function spanMethod({ row, column, rowIndex }: CellType) {
      // @ts-expect-error: vue bug
      const { includes = [], parentProp = null } = props.colspanOptions
      const key = column.property
      const spanKey = parentProp
        ? `${row[parentProp]}_${key}_${row[key]}`
        : `${key}_${row[key]}`
      if (!includes.includes(key) || row[key] == null) {
        return {
          colspan: 1,
          rowspan: 1,
        }
      }
      if (rowIndex === totalColumn.value[spanKey].index) {
        return {
          colspan: 1,
          rowspan: totalColumn.value[spanKey].num,
        }
      } else {
        return [0, 0]
      }
    }
    function handlePageChange(page: number) {
      searchModel.value.page = page
      updateParams(searchModel.value)
      // @ts-expect-error: vue bug
      props.custom ? props.api?.() : getList()
    }
    function handleRowsChange(rows: number) {
      searchModel.value.rows = rows
      handlePageChange(1)
    }
    function handleSimplePageChange(page: number) {
      simpleTable.page = page
    }
    function handleSimpleRowsChange(rows: number) {
      simpleTable.rows = rows
    }
    const paginationConfig = computed(() => {
      // @ts-expect-error: vue bug
      if (['string', 'boolean'].includes(typeof props.pagination)) {
        return {}
      } else {
        // @ts-expect-error: vue bug
        return props.pagination
      }
    })

    const pagination = () => {
      // @ts-expect-error: vue bug
      if (!props.pagination) {
        return null
      }
      // @ts-expect-error: vue bug
      return props.simple
        ? (<custom-pagination
            v-models={[
              [simpleTable.page, 'currentPage'],
              [simpleTable.rows, 'pageSize'],
            ]}
            total={tableData.value.length}
            layout="prev, pager, next"
            {...{
              'onUpdate:currentPage': handleSimplePageChange,
              'onUpdate:pageSize': handleSimpleRowsChange,
              ...paginationConfig.value,
            }}
          />)
        : (<custom-pagination
            v-models={[
              [searchModel.value.page, 'currentPage'],
              [searchModel.value.rows, 'pageSize'],
            ]}
            // @ts-expect-error: vue bug
            total={props.custom ? props.total : arrayTotal.value}
            {...{
              'onUpdate:currentPage': handlePageChange,
              'onUpdate:pageSize': handleRowsChange,
              ...context.attrs,
              ...paginationConfig.value,
            }}
          />)
    }
    context.expose({
      getList,
      clearSelection: () => customTableRef.value.clearSelection(),
      getRef: () => customTableRef.value.getRef(),
    })
    return () => (
      <section class="bc-table-wrap">
        <custom-table
          class="bc-table"
          ref={customTableRef}
          config={tableConfig.value}
          // @ts-expect-error: vue bug
          data={props.simple ? simpleData.value : tableData.value}
          // @ts-expect-error: vue bug
          span-method={props.colspanOptions ? spanMethod : null}
          // @ts-expect-error: vue bug
          hidden-current={!!props.colspanOptions}
          // @ts-expect-error: vue bug
          body-border={!!props.colspanOptions}
          // @ts-expect-error: vue bug
          row-selection={props.rowSelection}
          v-loading={loading.value}
          v-slots={context.slots}
          {...context.attrs}
        >
        </custom-table>
        {pagination()}
      </section>
    )
  },
})
