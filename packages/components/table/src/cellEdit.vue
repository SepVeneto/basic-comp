<template>
  <!-- 编辑状态 -->
  <bc-input
    v-if="editing"
    v-focus
    class="bc-table-input"
    :model-value="cell"
    @update:model-value="(val: string) => { cell = val }"
    @focus="handleFocus"
    @blur="handleBlur"
    @keyup.enter="save"
  >
    <template #suffix>
      <ElIcon
        class="bc-table-input--operate"
        color="var(--el-color-success)"
        @click="save"
      >
        <IconSelect />
      </ElIcon>
    </template>
  </bc-input>

  <!-- 展示状态 -->
  <div
    v-else
    class="bc-table-cell-edit"
    @click="toggleEdit"
  >
    {{ modelValue }}{{ unit }}
  </div>
</template>

<script setup lang="ts">
import { Select as IconSelect } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'
import { nextTick, ref } from 'vue'

// 1. 定义组件选项
defineOptions({
  name: 'BcTableCellEdit',
})

// 2. 定义 Props 与 Emits
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  unit: {
    type: String,
    default: undefined,
  },
})

const emit = defineEmits(['save', 'blur'])

// 3. 局部自定义指令声明 (以 v 开头的驼峰变量会被自动识别为指令 v-focus)
const vFocus = {
  mounted: (el: HTMLElement) => {
    // 兼容 element-plus 组件内部渲染延迟，等待下一帧寻找内部 input 聚焦
    nextTick(() => {
      el.querySelector('input')?.focus()
    })
  },
}

// 4. 状态与逻辑控制
const editing = ref(false)
const cell = ref<string | number>('')

function toggleEdit() {
  editing.value = !editing.value
}

function handleFocus() {
  cell.value = props.modelValue
}

function handleBlur() {
  if (editing.value) {
    toggleEdit()
    emit('blur') // 补齐原有隐藏逻辑对应的 blur 事件上报
  }
}

function save() {
  emit('save', cell.value)
  toggleEdit()
}
</script>
