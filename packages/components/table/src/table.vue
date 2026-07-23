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

<script lang="ts" setup generic="Api extends TableApiFunction | undefined = undefined, Name extends string | undefined = GlobalTableArrayName">
import type { ApiResponseType } from '@basic-comp/components/type'
import type { Ref } from 'vue'
import type { CellType, DefaultRow, GlobalTableArrayName, InferTableRow, TableApi, TableApiFunction, TableProps } from './type'
import { useConfigInject } from '@basic-comp/hooks'
import { computed, onActivated, ref, useTemplateRef } from 'vue'
import CustomTable from './customTable.vue'
import CustomPagination from './pagination.vue'

defineOptions({
  name: 'BcTable',
})

const props = withDefaults(defineProps<TableComponentProps>(), {
  immediate: true,
  apiLoad: true,
  showPagination: undefined,
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
defineSlots<{
  [key: string]: (scope: { row: Row, column: any, $index: number }) => any
}>()
type Row = InferTableRow<Api, Name>
type TableComponentProps = Omit<TableProps<Row, Name>, 'api'> & {
  api?: Api & TableApi<Row, Name>
}

const refTable = useTemplateRef('tableRef')
defineExpose({
  getList,
  clearSelection: () => refTable.value?.clearSelection(),
  getRef: () => refTable.value?.getRef(),
})

const params = defineModel<Record<string, any>>({ default: () => ({ page: 1, rows: 20 }) })

const needShowPagination = computed(() => {
  if (typeof props.showPagination === 'boolean') {
    return props.showPagination
  }
  else {
    return !!props.pagination
  }
})

const responseInject = useConfigInject('response')
const responseWrap = computed(() =>
  responseInject.value?.data || 'data',
)
const tableInject = useConfigInject('table')
const arrayName = computed(() =>
  props.arrayName ?? tableInject.value?.arrayName,
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

// Keep Row intact: Vue's deep Ref unwrapping cannot preserve a conditional
// generic row type in a computed array.
const arrayData = ref<Row[]>([]) as unknown as Ref<Row[]>
const arrayTotal = ref(0)
const loading = ref(false)

const searchModel = computed(() => {
  const { [pageName.value]: page, [pageSizeName.value]: rows, ...rest } = params.value
  return { page, rows, ...rest }
})

const paginationConfig = computed(() => {
  if (['string', 'boolean'].includes(typeof props.pagination)) {
    return {}
  }
  else {
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
  return props.arrayName ?? arrayName.value ?? ''
})
const tableData = computed<Row[]>(() => {
  if (props.data && props.data.length > 0) {
    return props.data || []
  }
  else {
    return props.filter ? props.filter(arrayData.value) : arrayData.value
  }
})

const list = computed(() => {
  if (props.simple) {
    return simpleData.value
  }
  else {
    return tableData.value
  }
})

const totalColumn = computed(() => {
  const { includes = [], parentProp = null } = props.colspanOptions
  const totalColumn: Record<string, { index: number, num: number }> = {}
  const whiteList: Record<string, number> = {}
  includes.forEach((item) => {
    whiteList[item] = 0
  })
  tableData.value.forEach((row) => {
    Object.keys(row).forEach((key) => {
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
      }
      else {
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
}
else {
  init()
}

function init() {
  if (props.custom) {
    props.api && props.immediate && props.api()
  }
  else {
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
  }
  else {
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
  updateParams()
  props.custom ? props.api?.() : getList()
}
function handleRowsChange(rows: number) {
  searchModel.value.rows = rows
  handlePageChange(1)
}

function updateParams() {
  const { page, rows, ...args } = searchModel.value
  params.value = {
    ...args,
    [pageName.value]: page,
    [pageSizeName.value]: rows,
  }
}
</script>
