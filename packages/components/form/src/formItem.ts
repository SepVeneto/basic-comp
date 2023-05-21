import type { ExtractPropTypes } from 'vue'

export const formItemProps = {
  required: {
    type: [Boolean, String],
    default: undefined,
  },
}

export type FormItemProps = ExtractPropTypes<typeof formItemProps>
