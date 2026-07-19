<template>
  <!-- 只读展示模式 -->
  <span v-if="onlyDisplay">{{ $attrs.modelValue }}</span>

  <!-- 输入框编辑模式 -->
  <el-input
    v-else
    ref="inputRef"
    class="bc-input"
    :class="borderClass"
    :style="{ width: inputWidth }"
    placeholder="请输入"
    :spellcheck="false"
    v-bind="$attrs"
  >
    <!-- 动态透传所有父组件传进来的插槽 (排除特定的 suffix) -->
    <template 
      v-for="(_, slotName) in filteredSlots" 
      v-slot:[slotName]="slotScope" 
      :key="slotName"
    >
      <slot :name="slotName" v-bind="slotScope ?? {}" />
    </template>

    <!-- 劫持并扩展 suffix 插槽 -->
    <template #suffix>
      <!-- 复制按钮逻辑 -->
      <el-tooltip v-if="copy" content="复制">
        <el-icon
          style="cursor: pointer"
          :size="copyOptions.size"
          :color="copyOptions.color"
          @click="handleCopy"
        >
          <slot name="icon">
            <DocumentCopy />
          </slot>
        </el-icon>
      </el-tooltip>
      
      <!-- 透传原有的 suffix 插槽内容 -->
      <slot name="suffix" />
    </template>
  </el-input>
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import { ElInput, ElIcon, ElTooltip, ElMessage } from 'element-plus'
import { DocumentCopy } from '@element-plus/icons-vue'
import { copyText } from '@basic-comp/utils'
import { inputProps } from './type'

// 1. 定义组件选项并禁用默认透传（因为我们要显式绑定到 el-input 上）
defineOptions({
  name: 'BcInput',
  inheritAttrs: false
})

// 2. 定义 Props
const props = defineProps(inputProps)

// 3. 状态与引用
const inputRef = ref<InstanceType<typeof ElInput>>()
const slots = useSlots()

// 4. 计算样式与类名
const inputWidth = computed(() => {
  if (typeof props.width === 'number') {
    return `${props.width}px`
  }
  return props.width
})

const borderClass = computed(() => {
  const map: Record<string, string> = {
    none: 'no-border',
    bottom: 'bottom-border',
    all: '',
  }
  return map[props.border] ?? ''
})

const copyOptions = computed(() => {
  const isBool = typeof props.copy === 'boolean'
  return {
    size: isBool ? 20 : (props.copy?.size ?? 20),
    color: isBool ? undefined : props.copy?.color
  }
})

// 5. 过滤掉无需动态循环的插槽（避免覆盖显式重写的 suffix）
const filteredSlots = computed(() => {
  const allSlots = { ...slots }
  delete allSlots.suffix
  return allSlots
})

// 6. 核心复制方法
async function handleCopy() {
  // 提取 el-input 内部的原生 input 实例的值
  const rawInput = inputRef.value?.input
  if (rawInput) {
    const text = rawInput.value ?? ''
    await copyText(String(text))
    ElMessage.success('复制成功')
  }
}
</script>
