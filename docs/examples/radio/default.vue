<template>
  <bc-radio-group
    v-model="select"
    :options="options"
    default-value="vv"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const select = ref('')
const options = ref([
  { label: '维托里奥 维内托', value: 'vv' },
  { label: '安德烈亚 多利亚', value: 'Andrea Doria' },
])
</script>
