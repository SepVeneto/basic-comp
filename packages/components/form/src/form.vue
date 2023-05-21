<template>
  <ElForm v-bind="$attrs">
    <slot />
  </ElForm>
</template>

<script lang="ts" setup>
import { ElForm } from 'element-plus'

defineOptions({
  name: 'BcForm',
})
</script>
