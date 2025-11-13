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

<script lang="ts">
import type { FormItemRule } from 'element-plus'
import { ElFormItem } from 'element-plus'
import { computed, defineComponent } from 'vue'
import { formItemProps } from './formItem'

export default defineComponent({
  name: 'BcFormItem',
  components: {
    ElFormItem,
  },
  props: formItemProps,
  setup(props, { attrs: rawAttrs }) {
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

    return {
      rules,
      message,
    }
  },
})
</script>
