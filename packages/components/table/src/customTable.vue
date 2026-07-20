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

<script lang="ts" setup>
import { ElTable, ElTableColumn } from 'element-plus'
import { computed, useTemplateRef } from 'vue'
import { useSelection } from './useSelection'
import type { TableRowSelection } from './type'
import TableColumn from './TableColumn.vue'

const props = withDefaults(defineProps<{
  bodyBorder?: boolean,
  // eslint-disable-next-line vue/require-default-prop
  emptyText?: string |((val: any, column: Record<string, any>) => string)
  data: any[]
  config: Record<string, any>[],
  customIcon?: boolean,
  hiddenCurrent?: boolean,
  // eslint-disable-next-line vue/require-default-prop
  rowSelection?: TableRowSelection,
  showOverflowTooltip?: boolean,
  // eslint-disable-next-line vue/require-default-prop
  rowKey?: string |((row: any) => string),
}>(), {
  bodyBorder: true,
})
defineEmits(['select'])

const refTable = useTemplateRef('tableRef')

const rowSelection = computed(() => props.rowSelection)

const tableConfig = computed(() => props.config)

const [renderSelect, renderSelectTop] = useSelection(rowSelection, {
  pageData: computed(() => props.data),
  getRowKey,
  getRecordByKey: getRowByKey,
})

function clearSelection() {
  refTable.value?.clearSelection()
}

defineSlots<{
  [key: string]: (row: any, column: any, $index: number) => any
}>()

defineExpose({
  clearSelection,
  getRef: () => refTable.value,
})

function getRowKey(row: any, rowKey = props.rowKey, index?: number) {
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
  return props.data.find((item: any) => getRowKey(item) === key)!
}
</script>
