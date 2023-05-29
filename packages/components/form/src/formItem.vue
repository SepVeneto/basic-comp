<template>
  <ElFormItem
    v-bind="{
      ...$attrs,
      rules,
    }"
  >
    <slot />
  </ElFormItem>
</template>

<script lang="ts" setup>
import { ElFormItem, type FormItemRule } from 'element-plus'
import { computed, useAttrs } from 'vue'
import { formItemProps } from './formItem'
const rawAttrs = useAttrs()
const props = defineProps(formItemProps)
defineOptions({
  name: 'BcFormItem',
})

const message = computed(() => {
  if (typeof props.required === 'string') {
    return props.required
  }
  const { label, prop } = rawAttrs
  return `${label || prop}是必填项`
})
const rules = computed<FormItemRule | undefined>(() => {
  if (props.required) {
    return { required: true, message: message.value }
  }
  return undefined
})
</script>
