<template>
  <!-- 情况 1：同时存在插槽内容且开启了 tooltip -->
  <el-tooltip
    v-if="$slots.default && tooltip"
    placement="top"
  >
    <!-- Tooltip 悬浮提示内容 -->
    <template #content>
      <span><slot /></span>
    </template>

    <!-- 触发 Tooltip 的按钮 (不带文本，仅触发事件) -->
    <el-button
      :class="['bc-button', { mini: mini }]"
      v-bind="$attrs"
      @click="handleClick"
    />
  </el-tooltip>

  <!-- 情况 2：普通按钮 -->
  <el-button
    v-else
    :class="['bc-button', { mini: mini }]"
    v-bind="$attrs"
    @click="handleClick"
  >
    <!-- 如果未开启 tooltip，则正常渲染内部文本/插槽 -->
    <span v-if="!tooltip">
      <slot />
    </span>
  </el-button>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { ElButton, ElMessageBox, ElTooltip } from 'element-plus'
import { buttonProps } from './type'

// 1. 禁用属性透传自动绑定到根节点，确保 v-bind="$attrs" 正确作用于 el-button
defineOptions({
  name: 'BcButton',
  inheritAttrs: false
})

// 2. 定义 Props 和 Emits
const props = defineProps(buttonProps)
const emit = defineEmits(['click'])

// 3. 获取 attrs 用于逻辑判断
const attrs = useAttrs()

// 4. 点击事件与弹窗逻辑
function handleClick(event: MouseEvent) {
  if (props.confirm || attrs.type === 'danger') {
    const confirmText = typeof props.confirm === 'boolean' 
      ? '此操作无法撤销，是否继续？' 
      : props.confirm

    ElMessageBox.confirm(confirmText, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      emit('click', event)
    }).catch(() => ({}))
  } else {
    emit('click', event)
  }
}
</script>
