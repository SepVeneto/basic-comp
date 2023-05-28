import { ElButton, ElDialog, ElScrollbar } from 'element-plus'
import { computed, defineComponent, ref } from 'vue'
import { FullScreen } from '@element-plus/icons-vue'
import { dialogProps } from './type'

export default defineComponent({
  name: 'BcDialog',
  components: {
    ElDialog,
    ElScrollbar,
    ElButton,
    FullScreen,
  },
  props: dialogProps,
  // inheritAttrs: false, // 不被作为props的attributes不会暴露在组件的根元素上
  emits: ['update:modelValue', 'cancel', 'submit'],
  setup(props, context) {
    const visible = computed({
      get() {
        return props.modelValue
      },
      set(val) {
        context.emit('update:modelValue', val)
      },
    })
    const fullscreen = ref(false)
    // const isFullscreen = ref(false);
    const isFullscreen = computed(() => {
      if (props.needFullscreen) {
        return fullscreen.value
      } else {
        return !!context.attrs.fullscreen || context.attrs.fullscreen === ''
      }
    })

    fullscreen.value = !!context.attrs.fullscreen
    // isFullscreen.value = !!context.attrs.fullscreen || context.attrs.fullscreen === '';

    context.expose({
      visible,
    })

    function handleFullScreen() {
      fullscreen.value = !fullscreen.value
    }
    function handleCancel() {
      visible.value = false
      context.emit('cancel')
    }

    const footer = () => (
      <footer>
        <el-button onClick={handleCancel}>取消</el-button>
        <el-button onClick={() => context.emit('submit')}>确认</el-button>
      </footer>
    )
    const header = () => (
      <header class="bc-dialog-header">
        {context.slots.header?.() ?? context.slots.title?.() ?? <span class="text">{context.attrs.title}</span>}
        {props.needFullscreen && <el-icon onClick={handleFullScreen} style="cursor: pointer;"><full-screen /></el-icon>}
      </header>
    )
    const dialog = () => (
      <el-dialog
        close-on-click-modal={false}
        fullscreen={fullscreen.value}
        {...context.attrs}
        {...{
          modelValue: visible.value,
          'onUpdate:modelValue': (show:boolean) => { visible.value = show },
        }}
        v-slots={{
          header,
          footer: () => (!props.noFooter && (context.slots?.footer?.() || footer())),
        }}
      >
        <el-scrollbar
          ref="scrollbar"
          class={[
            'bc-dialog-scrollbar',
            { 'bc-dialog-is-fullscreen': isFullscreen.value },
          ]}>
          {context.slots.default?.()}
        </el-scrollbar>
      </el-dialog>
    )
    return dialog
  },
})
