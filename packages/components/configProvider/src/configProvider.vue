<template>
  <!-- 直接渲染默认插槽内容，不引入多余的 DOM 节点 -->
  <slot />
</template>

<script setup lang="ts">
import { provideGlobalConfig } from '@basic-comp/hooks'
import { reactive, watch } from 'vue'
import { configProviderProps } from './type'

// 1. 定义组件选项
defineOptions({
  name: 'BcConfigProvider',
})

// 2. 接收 Props
const props = defineProps(configProviderProps)

// 3. 构建响应式配置项并实现同步（修复原 JSX 版本的响应式丢失 Bug）
const configProvider = reactive({ ...props })

// 监听 props 的整体变化，确保上层动态更新时，注入的数据源能同步更新
watch(
  () => props,
  (newProps) => {
    Object.assign(configProvider, newProps)
  },
  { deep: true },
)

// 4. 全局依赖注入
provideGlobalConfig(configProvider)
</script>
