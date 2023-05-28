<template>
  <ElForm
    ref="formRef"
    :model="formData"
  >
    <bc-form-item
      label="名称"
      prop="name"
      required
    >
      <bc-input v-model="formData.name" />
    </bc-form-item>
  </ElForm>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElForm } from 'element-plus'
const formData = ref({ name: '' })
const formRef = ref<InstanceType<typeof ElForm>>()

async function getFormData() {
  await formRef.value?.validate()
  return formData.value
}
defineExpose({ getFormData })
</script>
