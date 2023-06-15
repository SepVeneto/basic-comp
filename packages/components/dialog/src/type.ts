import type { Component, ExtractPropTypes, PropType, ShallowRef } from 'vue'
import type { ExtractProps } from '@basic-comp/utils'
import type { ElDialog } from 'element-plus'

export type ConfirmFn = (...args: any[]) => void | Promise<void>

export const dialogProps = {
  /**
   * 是否隐藏底部操作栏
   */
  noFooter: Boolean,
  needFullscreen: Boolean,
  modelValue: Boolean,
  confirm: {
    type: Function as PropType<ConfirmFn>,
    default: undefined,
  },
}

type Instance = abstract new (...args: any) => any
export type DialogProps = ExtractProps<typeof ElDialog> | Partial<ExtractPropTypes<typeof dialogProps>>
export type DialogFn = <T extends Component & Instance>(
  component: T,
  props?: ExtractProps<InstanceType<T>>,
) => {
  open: (
    props?: DialogProps,
    confirmFn?: (exposed?: InstanceType<T>) => void,
    cancelFn?: () => void
  ) => ShallowRef<InstanceType<T> | undefined>,
  close: () => void
}
