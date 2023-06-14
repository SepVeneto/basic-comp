<template>
  <bc-button @click="handleOpen">
    打开对话框
  </bc-button>
  <bc-dialog
    v-model="visible"
    title="对话框"
    @submit="handleSubmit"
  >
    <div>body</div>
  </bc-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const visible = ref(false)
function handleOpen() {
  visible.value = true
}
async function handleSubmit() {
  await mockPost()
  visible.value = false
}
function mockPost() {
  console.log('post')
  return new Promise(resolve => {
    setTimeout(resolve, 2000)
  })
}
</script>
