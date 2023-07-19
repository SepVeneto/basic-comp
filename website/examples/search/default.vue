<template>
  <pre>{{ params }}</pre>
  <bc-search
    v-model="params"
    :config="searchConfig"
    :search="handleSearch"
    :default-value="defaultValue"
  >
    <bc-button>测试</bc-button>
  </bc-search>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const searchConfig = ref([
  { catalog: 'input', name: '名称', prop: 'name' },
])
const params = ref({
  page: 1,
  size: 10,
  name: 'veneto',
})
const defaultValue = ref({
  page: 1,
  size: 10,
})

function handleSearch() {
  console.log('trigger search')
}
</script>
