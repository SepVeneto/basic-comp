<template>
  <ElDialog
    :model-value="visible"
    :close-on-click-modal="false"
    :fullscreen="fullscreen"
    v-bind="$attrs"
    @update:model-value="close"
  >
    <template #header>
      <header class="bc-dialog-header">
        <slot
          v-if="hasHeader"
          name="header"
        />
        <slot
          v-else-if="hasTitle"
          name="title"
        />
        <span
          v-else
          class="text"
        >{{ rawAttrs.title }}</span>
        <ElIcon
          v-if="needFullscreen"
          style="cursor: pointer;"
          @click="handleFullScreen"
        >
          <IconFullScreen />
        </ElIcon>
      </header>
    </template>
    <ElScrollbar :class="scrollbarClass">
      <slot />
    </ElScrollbar>
    <template
      v-if="hasFooter || !noFooter"
      #footer
    >
      <slot name="footer">
        <footer>
          <ElButton @click="handleCancel">
            取消
          </ElButton>
          <ElButton
            :loading="loading"
            @click="handleSubmit"
          >
            确认
          </ElButton>
        </footer>
      </slot>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import {
  ElButton,
  ElDialog,
  ElIcon,
  ElScrollbar,
} from 'element-plus'
import { dialogEmits, dialogProps } from './type'
import { computed, ref, useAttrs, useSlots, watch } from 'vue'
import { FullScreen as IconFullScreen } from '@element-plus/icons-vue'

defineOptions({ name: 'BcDialog' })

const props = defineProps(dialogProps)
const emit = defineEmits(dialogEmits)
const slots = useSlots()
const rawAttrs = useAttrs()
const loading = ref(false)

const visible = ref(false)

watch(() => props.modelValue, (show) => {
  if (show === visible.value) return
  visible.value = show
  emit('update:modelValue', show)
})

const hasHeader = computed(() => !!slots.header)
const hasTitle = computed(() => !!slots.title)
const hasFooter = computed(() => !!slots.footer)

const fullscreen = ref(false)
const isFullscreen = computed(() => {
  if (props.needFullscreen) {
    return fullscreen.value
  } else {
    return !!rawAttrs.fullscreen || rawAttrs.fullscreen === ''
  }
})
const scrollbarClass = computed(() => [
  'bc-dialog-scrollbar',
  isFullscreen.value && 'bc-dialog-is-fullscreen',
])
fullscreen.value = !!rawAttrs.fullscreen

function handleSubmit() {
  if (!props.confirm) {
    emit('submit')
    return
  }
  loading.value = true
  const res = props.confirm()
  if (res instanceof Promise) {
    res.finally(() => {
      loading.value = false
    })
  }
  emit('submit')
}
function close() {
  visible.value = false
  emit('update:modelValue', false)
}
function open() {
  visible.value = true
  emit('update:modelValue', true)
}
function handleFullScreen() {
  fullscreen.value = !fullscreen.value
}
function handleCancel() {
  close()
}
function setLoading(state: boolean) {
  loading.value = state
}

defineExpose({
  open,
  close,
  setLoading,
})
</script>
