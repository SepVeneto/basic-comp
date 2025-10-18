<template>
  <bc-button @click="visible = true">
    上传
  </bc-button>
  <bc-upload
    v-model="visible"
    :upload-api="upload"
    callback-type="file"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
defineOptions({
  name: 'Basic',
})
const visible = ref(false)
function upload(data: File) {
  // console.log(data.get('file'))
  console.log(data)
  return Promise.reject(new Error('error'))
}
</script>
