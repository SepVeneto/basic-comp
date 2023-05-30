import type { AppContext, VNode } from 'vue'
import { createVNode, render } from 'vue'
import DialogConstructor from './dialog.vue'
import type { DialogFn, DialogProps } from './type'
import { logWarn } from '@basic-comp/utils'

export const createDialog: DialogFn & { _context?: AppContext } =
function (component, props = {}) {
  const vm = createVNode(component, props)

  const appendTo = document.body
  const container = document.createElement('div')

  let dialog: VNode | null

  function open(
    props?: DialogProps,
    confirmFn?: (...args: any) => void,
    cancelFn?: () => void,
  ) {
    function onSubmit() {
      confirmFn?.(vm.component?.exposed)
    }
    function onCancel() {
      cancelFn?.()
    }
    dialog = createVNode(
      DialogConstructor,
      {
        ...props,
        onSubmit,
        onCancel,
      },
      { default: () => vm },
    )

    dialog.props!.onClosed = () => {
      render(null, container)
    }

    if (createDialog._context) {
      dialog.appContext = createDialog._context
    } else {
      logWarn('[Dialog] 命令式使用缺少上下文，全局注册的组件将无法渲染')
    }

    render(dialog, container)
    appendTo.appendChild(container.firstElementChild!)

      dialog.component!.exposed!.visible.value = true
  }
  function close() {
    if (!dialog) return
    dialog.component!.exposed!.visible.value = false
  }

  return {
    open,
    close,
  }
}
