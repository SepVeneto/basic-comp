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
function handleSubmit() {
  visible.value = false
}
</script>
