<template>
  <ElTableColumn
    v-if="config.children && config.children.length > 0"
    v-bind="columnConfig"
  >
    <TableColumn
      v-for="item in config.children"
      :key="item.prop"
      :config="item"
    >
      <template #[`${item.prop}-header`]>
        <slot :name="`${item.prop}-header`" />
      </template>
      <template #[item.prop]="innerScope">
        <slot
          :name="item.prop"
          v-bind="innerScope"
        />
      </template>
    </TableColumn>
  </ElTableColumn>
  <ElTableColumn
    v-else
    v-bind="columnConfig"
  >
    <template #header>
      <slot
        :name="`${config.prop}-header`"
        v-bind="{ column: config }"
      />
    </template>
    <template
      #default="scope"
    >
      <slot
        v-if="config.type === 'expand'"
        name="expand"
        v-bind="scope"
      />

      <CellEdit
        v-else-if="isCellEditable(scope.row, config.editable)"
        :model-value="getValue(scope.row, scope.column.property, config, disableTravel)"
        @save="onSave($event, scope.row, scope.column)"
      />

      <slot
        :name="config.prop"
        v-bind="scope"
      >
        <span>{{ genRealValue(scope.row, scope.column) }}</span>
      </slot>
    </template>
  </ElTableColumn>
</template>

<script lang="ts" setup>
import { ElTableColumn } from 'element-plus'
import type { RowType } from './type'
import CellEdit from './cellEdit'
import { extractObject, getValue, setValue } from '@basic-comp/utils'
import { computed, getCurrentInstance } from 'vue'
defineOptions({
  name: 'CustomTableColumn',
})
const props = defineProps<{
  disableTravel?: boolean,
  emptyText?: string |((val: any, column: any) => string)
  config: Record<string, any>
}>()

const columnConfig = computed(() => extractObject(props.config, ['children'], 'exclude'))

function genRealValue(row: any, column: any) {
  const value = getValue(row, column.property, props.config, props.disableTravel)
  return typeof props.emptyText === 'function'
    ? props.emptyText(value, column)
    : (value === '' ? props.emptyText : value)
}

function isCellEditable(data: RowType['row'], editable: boolean | ((data: RowType['row']) => boolean)) {
  if (typeof editable === 'function') {
    return editable(data)
  } else {
    return !!editable
  }
}

const instance = getCurrentInstance()
function onSave(cell: string, row: any, column: any) {
  setValue(row, column.property, cell)
  instance?.parent?.emit('save', cell, column.property, row)
}
</script>
