<template>
  <bc-table
    id="drag-table"
    row-key="id"
    :config="tableConfig"
    :data="tableData"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useSortable } from '@vueuse/integrations/useSortable'

const tableConfig = [
  { label: '姓名', prop: 'name' },
  { label: '年龄', prop: 'age' },
  { label: '身高', prop: 'height', unit: 'm' },
  { label: '体重', prop: 'weight', unit: 'kg' },
]
const tableData = ref([
  { name: '维内托', age: 18, height: 237.8, weight: 40517, id: 1 },
  { name: '安德烈亚•多利亚', age: 18, height: 186.9, weight: 28700, id: 2 },
])

useSortable('#drag-table tbody', tableData, {
  animation: 150,
})
</script>

<style scoped>
#drag-table:deep(tbody > tr) {
  cursor: move;
}
#drag-table:deep(.sortable-ghost) {
  opacity: 0.4;
}
</style>

