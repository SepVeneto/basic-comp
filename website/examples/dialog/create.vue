<template>
  <bc-button @click="handleOpen">
    open
  </bc-button>
</template>

<script lang="ts" setup>
import { createDialog } from '@sepveneto/basic-comp'
import DialogForm from '../form/basic.vue'

async function handleOpen() {
  const { open, close } = createDialog(DialogForm)
  const instRef = open(
    { title: '命令式', width: '550px' },
    async (res) => {
      const data = await res?.getFormData()
      await mockPost()
      console.log('end')
      console.log(data)
      close()
    },
  )
  console.log(instRef)
}
function mockPost() {
  console.log('post')
  return new Promise(resolve => {
    setTimeout(resolve, 2000)
  })
}
</script>
