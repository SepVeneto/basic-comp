import { formItemProps } from './formItem'
import type { ExtractPropTypes } from 'vue'

export const formProps = {
  ...formItemProps,
}

export type FormProps = ExtractPropTypes<typeof formProps>
