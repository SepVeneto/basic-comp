import { defineComponent } from 'vue'
import { ElButton, ElMessageBox, ElTooltip } from 'element-plus'
import { buttonProps } from './type'

export default defineComponent({
  name: 'BcButton',
  components: {
    ElButton,
    ElTooltip,
  },
  props: buttonProps,
  emits: ['click'],
  setup(props, context) {
    function handleClick(event: MouseEvent) {
      if (props.confirm || context.attrs.type === 'danger') {
        const confirmText = typeof props.confirm === 'boolean' ? '此操作无法撤销，是否继续？' : props.confirm
        ElMessageBox.confirm(confirmText, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          context.emit('click', event)
        }).catch(() => ({}))
      } else {
        context.emit('click', event)
      }
    }
    const tooltip = (node: () => JSX.Element) => (
      <el-tooltip
        placement="top"
        v-slots={{ content: () => <span>{context.slots.default?.()}</span> }}
      >
        <span>{node()}</span>
      </el-tooltip>
    )
    const spanContent = !props.tooltip ? (context.slots.default || null) : null
    const button = () => (
      <ElButton
        class={['bc-button', { mini: props.mini }]}
        {...{
          ...context.attrs,
          onClick: handleClick,
        }}
      >
        <span>{spanContent?.()}</span>
      </ElButton>
    )
    const iconButton = () => (
      <ElButton
        class={['bc-button', { mini: props.mini }]}
        {...{
          ...context.attrs,
          onClick: handleClick,
        }}
      />
    )
    return () => (context.slots.default && props.tooltip)
      ? tooltip(iconButton)
      : button()
  },
})
