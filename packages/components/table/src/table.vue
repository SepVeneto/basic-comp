<template>
  <section class="bc-table-wrap">
    <CustomTable
      ref="tableRef"
      v-loading="loading"
      class="bc-table"
      :config="config"
      :data="list"
      :span-method="colspanOptions ? spanMethod : null"
      :hidden-current="!!colspanOptions"
      :body-border="!!colspanOptions"
      :row-selection="rowSelection"
      :row-key="rowKey"
      :empty-text="emptyText"
      v-bind="$attrs"
    >
      <template
        v-for="(_, name) in $slots"
        :key="name"
        #[name]="slotProps"
      >
        <slot
          :name="name"
          v-bind="slotProps || {}"
        />
      </template>
    </CustomTable>
    <template v-if="needShowPagination">
      <CustomPagination
        v-if="simple"
        v-model:current-page="simpleTable.page"
        v-model:page-size="simpleTable.rows"
        :total="tableData.length"
        layout="prev, pager, next"
        v-bind="paginationConfig"
        @update:current-page="handleSimplePageChange"
        @update:page-size="handleSimpleRowsChange"
      />
      <CustomPagination
        v-else
        v-model:current-page="searchModel.page"
        v-model:page-size="searchModel.rows"
        :total="custom ? total : arrayTotal"
        v-bind="paginationConfig"
        @update:current-page="handlePageChange"
        @update:page-size="handleRowsChange"
      />
    </template>
  </section>
</template>

<script lang="ts" setup generic="T extends DefaultRow = DefaultRow, R = any">
import { computed, onActivated, ref, useTemplateRef } from 'vue'
import CustomTable from './customTable.vue'
import type { CellType, DefaultRow, TableProps } from './type'
import CustomPagination from './pagination.vue'
import { useConfigInject } from '@basic-comp/hooks'
import type { ApiResponseType } from '@basic-comp/components/type'

defineOptions({
  name: 'BcTable',
})

const refTable = useTemplateRef('tableRef')
defineExpose({
  getList,
  clearSelection: () => refTable.value?.clearSelection(),
  getRef: () => refTable.value?.getRef(),
})

const params = defineModel<Record<string, any>>({ default: () => ({ page: 1, rows: 20 }) })

const props = withDefaults(defineProps<TableProps & {
  /**
   * 远程数据获取的回调函数，支持promise
   */
  api?: () => Promise<ApiResponseType<R>>,
}>(), {
  immediate: true,
  apiLoad: true,
  total: 0,
  rowSelection: () => ({
    type: 'select',
    selectedRowKeys: [],
    onChange: () => ({}),
  }),
  colspanOptions: () => ({
    includes: [],
    parentProp: null,
  }),
})

const needShowPagination = computed(() => {
  if (typeof props.showPagination === 'boolean') {
    return props.showPagination
  } else {
    return !!props.pagination
  }
})

const responseInject = useConfigInject('response')
const responseWrap = computed(() =>
  responseInject.value?.data || 'data',
)
const tableInject = useConfigInject('table')
const arrayName = computed(() =>
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

const arrayData = ref([])
const arrayTotal = ref(0)
const loading = ref(false)

const searchModel = computed({
  get() {
    const { [pageName.value]: page, [pageSizeName.value]: rows, ...rest } = params.value
    return { page, rows, ...rest }
  },
  set(obj: Record<string, unknown>) {
    updateParams(obj)
  },
})

const paginationConfig = computed(() => {
  if (['string', 'boolean'].includes(typeof props.pagination)) {
    return {}
  } else {
    return props.pagination
  }
})

const simpleTable = ref({ page: 1, rows: 5 })
const simpleData = computed(() => {
  const { page, rows } = simpleTable.value
  const start = (page - 1) * rows
  const end = page * rows
  return props.data?.slice(start, end) || []
})
const tableDataName = computed(() => {
  return (props.arrayName || arrayName.value) ?? ''
})
const tableData = computed<Record<string, unknown>[]>(() => {
  if (props.data && props.data.length > 0) {
    return props.data || []
  } else {
    return props.filter ? props.filter(arrayData.value) : arrayData.value
  }
})

const list = computed(() => {
  if (props.simple) {
    return simpleData.value
  } else {
    return tableData.value
  }
})

const totalColumn = computed(() => {
  const { includes = [], parentProp = null } = props.colspanOptions
  const totalColumn: Record<string, { index: number, num: number }> = {}
  const whiteList: Record<string, number> = {}
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

if (props.activatedUpdate) {
  onActivated(() => {
    init()
  })
} else {
  init()
}

function init() {
  if (props.custom) {
    props.api && props.immediate && props.api()
  } else {
    if (props.apiLoad && props.immediate && props.api) {
      loading.value = true
    }
    props.api && props.immediate && getList()
  }
}
function spanMethod<T extends DefaultRow>({ row, column, rowIndex }: CellType<T>) {
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

function handleSimplePageChange(page: number) {
  simpleTable.value.page = page
}

function handleSimpleRowsChange(rows: number) {
  simpleTable.value.rows = rows
}

function getList() {
  if (!props.custom && props.load) {
    loading.value = true
  }
  const wrap = responseWrap.value
  const array = tableDataName.value
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

function handlePageChange(page: number) {
  searchModel.value.page = page
  updateParams(searchModel.value)
  props.custom ? props.api?.() : getList()
}
function handleRowsChange(rows: number) {
  searchModel.value.rows = rows
  handlePageChange(1)
}

function updateParams(params: Record<string, unknown>) {
  const { page, rows, ...args } = params
  params.value = {
    ...args,
    [pageName.value]: page,
    [pageSizeName.value]: rows,
  }
}
</script>
