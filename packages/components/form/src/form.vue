<template>
  <ElForm v-bind="$attrs">
    <slot />
  </ElForm>
</template>

<script lang="ts">
import { ElForm } from 'element-plus'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BcForm',
  components: {
    ElForm,
  },
})
</script>
