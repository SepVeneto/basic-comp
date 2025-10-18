<template>
  <bc-search
    v-model="params"
    :config="searchConfig"
    :search="handleSearch"
    create
    @create="handleCreate"
    @export="handleExport"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const searchConfig = ref([
  { catalog: 'input', name: '名称', prop: 'param.name' },
  { catalog: 'select', name: '选项', prop: 'param.option', options: [1, 2] },
  { catalog: 'datepicker', type: 'daterange', prop: 'date' },
])
const params = ref({
  param: {}
})

function handleSearch() {
  console.log(params.value)
  console.log('trigger search');
}

function handleExport() {
  console.log('trigger export');
}
function handleCreate() {
  console.log('trigger create', params.value);
}
</script>
