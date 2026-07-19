<template>
  <section class="bc-search bc-search-wraper">
    <!-- 表单区 -->
    <el-form class="bc-search-containers" :inline="true" @submit="handleSubmit">
      <!-- 动态表单项列表 -->
      <el-form-item v-for="item in searchConfig" :key="item.prop" :label="nameMode === 'label' ? item.name : ''">
        <!-- 使用局部函数组件调用原有的 renderUnit 动态渲染核心交互单元 -->
        <RenderUnitComponent :item="item" />
      </el-form-item>

      <!-- 操作按钮排版区 -->
      <el-form-item>
        <template v-for="item in layout" :key="item">
          <!-- 新增按钮 -->
          <slot name="create" v-if="item === 'create'">
            <bc-button type="primary" @click="emit('create')">
              新增
            </bc-button>
          </slot>

          <!-- 搜索按钮 -->
          <slot name="search" v-if="item === 'search'">
            <bc-button type="primary" @click="handleSearch">
              搜索
            </bc-button>
          </slot>

          <!-- 重置按钮 -->
          <slot name="reset" v-if="item === 'reset'">
            <bc-button type="primary" class="el-icon-refresh" @click="handleReset">
              重置
            </bc-button>
          </slot>

          <!-- 导入/上传按钮 -->
          <slot name="upload" v-if="item === 'upload'">
            <bc-button @click="handleUpload">
              {{ upload?.text || '导入' }}
            </bc-button>
          </slot>

          <!-- 导出按钮 -->
          <slot name="export" v-if="item === 'export' && needExport">
            <bc-button @click="emit('export')">
              导出
            </bc-button>
          </slot>
        </template>

        <!-- 默认插槽 -->
        <slot />
      </el-form-item>
    </el-form>

    <!-- 弹窗上传组件 -->
    <bc-upload v-if="upload" v-model="uploadVisible" v-bind="{ ...upload, ...$attrs }" @success="handleSearch" />
  </section>
</template>

<script setup lang="ts">
import { computed, h, ref, useAttrs, useSlots, watch } from 'vue'
import type { SetupContext } from 'vue'
import { ElForm, ElFormItem } from 'element-plus'
import { useConfigInject } from '@basic-comp/hooks'
import { renderUnit, setValue } from '@basic-comp/utils'
import { BcUpload } from '../../upload'
import BcButton from '../../button/src/button.vue'
import type { RenderInputConfigType } from './type'
import { searchEmits, searchProps } from './type'

// 1. 定义组件选项
defineOptions({
  name: 'BcSearch',
  inheritAttrs: false // 属性透传手动控制在 bc-upload 
})

// 2. 定义 Props 与 Emits
const props = defineProps(searchProps)
const emit = defineEmits(searchEmits)

// 3. 获取 Vue 实例上下文数据
const slots = useSlots()
const attrs = useAttrs()

// 4. 依赖注入与基础响应式状态
const searchInject = useConfigInject('search')
const needExport = computed(() => searchInject.value?.export ?? props.export)

const paginationInject = useConfigInject('pagination')
const pageName = computed(() => paginationInject.value?.pageName || props.pageName)

const uploadVisible = ref(false)
const searchConfig = ref<RenderInputConfigType[]>()
const defaultParams = ref()

// 5. 监听器逻辑转换
watch(() => props.config, (config) => {
  searchConfig.value = [...config]
}, { immediate: true, deep: true })

watch(() => props.defaultValue, (value) => {
  const val = JSON.parse(JSON.stringify(value || props.modelValue))
  defaultParams.value = val
}, { immediate: true })

// 6. 核心业务处理函数
function updateData(key: string, val: string | string[]) {
  const modelValue = { ...props.modelValue }
  setValue(modelValue, key, val)
  emit('update:modelValue', modelValue)
}

function handleUpload() {
  uploadVisible.value = true
}

function handleSubmit(e: Event) {
  e.preventDefault()
}

function handleSearch(params: MouseEvent | Record<string, unknown>) {
  emit('update:modelValue', {
    ...props.modelValue,
    ...(params instanceof MouseEvent ? {} : params),
    [pageName.value]: 1
  })
  props.search?.()
}

function handleReset() {
  const params = { ...defaultParams.value }
  for (const key in props.modelValue) {
    const whiteList = Object.keys(params)
    if (!whiteList.includes(key)) {
      params[key] = Array.isArray(props.modelValue[key]) ? [] : undefined
    } else {
      const val = defaultParams.value[key]
      if (Array.isArray(val)) {
        params[key] = [...val]
      } else if (isObject(val)) {
        params[key] = { ...val }
      } else {
        params[key] = val
      }
    }
  }
  emit('update:modelValue', params)
  emit('reset')
  props.search?.()
}

function isObject(val: unknown) {
  const type = typeof val
  return val != null && (type === 'object' || type === 'function')
}

// 7. 局部函数式组件：衔接外部的 renderUnit 逻辑
const RenderUnitComponent = (localProps: { item: RenderInputConfigType }) => {
  return renderUnit(h, props.modelValue as Record<string, unknown>, localProps.item, {
    nameMode: props.nameMode,
    handleSearch: props.search,
    updateData,
    // 伪造底层 renderUnit 运行时所需的 context 结构
    context: { slots, emit, attrs } as unknown as SetupContext,
  })
}
</script>
