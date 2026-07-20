<template>
  <ElTable
    ref="tableRef"
    class="custom-table"
    :class="[customIcon && 'custom-icon', hiddenCurrent && 'current-hover']"
    :border="bodyBorder"
    :data="data"
    header-cell-class-name="custom-header"
    :row-key="rowKey"
    size="default"
    v-bind="$attrs"
    @select="$emit('select')"
  >
    <template
      v-for="c in tableConfig"
      :key="c.prop || c.type"
    >
      <ElTableColumn
        v-if="c.type === 'select'"
        :key="c.type"
        width="48px"
      >
        <template #header>
          <component :is="renderSelectTop()" />
        </template>
        <template #default="scope">
          <component :is="renderSelect(scope, c)" />
        </template>
      </ElTableColumn>

      <TableColumn
        v-else
        :key="c.prop"
        :config="c"
        :empty-text="emptyText"
        v-bind="$attrs"
      >
        <template #[`${c.prop}-header`]>
          <slot
            :name="`${c.prop}-header`"
            v-bind="{ column: c }"
          />
        </template>
        <template #[c.prop]="scope">
          <slot
            :name="c.prop"
            v-bind="scope"
          />
        </template>
      </TableColumn>
    </template>
  </ElTable>
</template>

<script lang="ts" setup generic="T extends DefaultRow">
import { ElTable, ElTableColumn } from 'element-plus'
import { computed, useTemplateRef } from 'vue'
import { useSelection } from './useSelection'
import type { DefaultRow, TableRowSelection } from './type'
import TableColumn from './TableColumn.vue'

const props = withDefaults(defineProps<{
  bodyBorder?: boolean,
  // eslint-disable-next-line vue/require-default-prop
  emptyText?: string |((val: any, column: Record<string, any>) => string)
  data: T[]
  config: Record<string, any>[],
  customIcon?: boolean,
  hiddenCurrent?: boolean,
  // eslint-disable-next-line vue/require-default-prop
  rowSelection?: TableRowSelection<T>,
  showOverflowTooltip?: boolean,
  // eslint-disable-next-line vue/require-default-prop
  rowKey?: string |((row: T) => string),
}>(), {
  bodyBorder: true,
})
defineEmits(['select'])

const refTable = useTemplateRef('tableRef')

const rowSelection = computed(() => props.rowSelection)

const tableConfig = computed(() => props.config)

const [renderSelect, renderSelectTop] = useSelection<T>(rowSelection, {
  pageData: computed(() => props.data),
  getRowKey,
  getRecordByKey: getRowByKey,
})

function clearSelection() {
  refTable.value?.clearSelection()
}

type DynamicTableSlots<T, K extends string = string> = {
  [P in K]: (scope: { 
    row: T
    column: Record<string, any>
    $index: number 
  }) => any
} & {
  [P in K as `${P}-header`]: (scope: { 
    column: Record<string, any> 
  }) => any
}

defineSlots<DynamicTableSlots<T>>()

defineExpose({
  clearSelection,
  getRef: () => refTable.value,
})

function getRowKey(row: T, rowKey = props.rowKey, index?: number) {
  if (!rowKey) {
    console.warn('没有设置row-key')
    return index
  }
  if (typeof rowKey === 'function') {
    return rowKey(row)
  } else if (row[rowKey]) {
    return row[rowKey]
  } else {
    return false
  }
}

function getRowByKey(key: string) {
  return props.data.find((item) => getRowKey(item) === key)!
}
</script>
