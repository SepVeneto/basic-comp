<template>
  <div><el-switch v-model="isDisplay" /></div>
  <bc-radio-group
    v-model="select"
    :options="options"
    :only-display="isDisplay"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const select = ref('vv')
const isDisplay = ref(true)
const options = ref([
  { label: '维托里奥 维内托', value: 'vv' },
  { label: '安德烈亚 多利亚', value: 'Andrea Doria' },
])
</script>
