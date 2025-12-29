<template>
  <div>
    <bc-select
      v-model="select"
      v-model:label="label"
      width="180px"
      :options="options"
      @change="onChange"
    />

    <bc-select
      v-model="select1"
      width="180px"
      :options="options1"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const select = ref('')
const label = ref('')
const options = ref([
  { label: '维托里奥 维内托', value: 'vv' },
  { label: '安德烈亚 多利亚', value: 'Andrea Doria' },
])
const options1 = ['维托里奥 维内托', '安德烈亚 多利亚']
const select1 = ref('')
function onChange(...args) {
  console.log(args)
}
</script>
