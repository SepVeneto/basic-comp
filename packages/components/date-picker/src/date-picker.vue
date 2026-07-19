<template>
  <el-date-picker
    :value-format="valueFormat"
    :style="{ width: realWidth }"
    v-bind="finalAttrs"
  >
    <!-- 透传所有可能的插槽（如 Element Plus 提供的 shortcuts 等） -->
    <template v-for="(_, slotName) in slots" :key="slotName" v-slot:[slotName]="slotScope">
      <slot :name="slotName" v-bind="slotScope || {}" />
    </template>
  </el-date-picker>
</template>

<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { ElDatePicker } from 'element-plus'
import { useConfigInject } from '@basic-comp/hooks'

// 1. 定义组件选项
defineOptions({
  name: 'BcDatePicker',
  inheritAttrs: false // 禁用默认透传，全部交由 v-bind="finalAttrs" 控制
})

// 2. 定义 Props
const props = defineProps({
  width: {
    type: [String, Number],
    default: undefined,
  },
  dayEnd: Boolean,
})

const attrs = useAttrs()
const slots = useSlots()

// 3. 配置注入与格式化计算
const datePickerInject = useConfigInject('datePicker') as any

const valueFormat = computed(() => 
  datePickerInject.value?.valueFormat || attrs.valueFormat
)

const realWidth = computed(() => {
  if (typeof props.width === 'string') {
    return props.width
  }
  return props.width ? `${props.width}px` : undefined
})

const type = computed(() => attrs.type as string | undefined)

// 将原配置封装进 computed，确保 dayEnd 或 type 动态改变时能够正确响应
const rangeDefaultConfig = computed(() => ({
  startPlaceholder: '开始时间',
  endPlaceholder: '结束时间',
  rangeSeparator: '至',
  defaultTime: props.dayEnd ? [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)] as [Date, Date] : new Date(2000, 1, 1, 0, 0, 0)
}))

// 4. 合并所有动态配置项与外部透传属性
const finalAttrs = computed(() => {
  const isRange = type.value?.includes('range')
  return {
    ...(isRange ? rangeDefaultConfig.value : {}),
    ...attrs,
  }
})
</script>
