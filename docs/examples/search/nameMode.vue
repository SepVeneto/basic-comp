<template>
  <bc-search
    v-model="params"
    :config="searchConfig"
    :search="handleSearch"
    create
    name-mode="label"
    @create="handleCreate"
    @export="handleExport"
  />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import type { RenderInputConfigType } from '@sepveneto/basic-comp'
export default defineComponent({
  name: 'Basic',
})
</script>

<script lang="ts" setup>
import { ref } from 'vue'
const searchConfig = ref<RenderInputConfigType[]>([
  { catalog: 'input', name: '名称', prop: 'param.name', placeholder: '请输入名称' },
  { catalog: 'datepicker', type: 'daterange', prop: 'date', name: '日期范围' },
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
