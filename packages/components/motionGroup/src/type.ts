import type { ExtractPropTypes } from 'vue'

export const motionGroupProps = {
  delay: {
    type: Number,
    default: 0,
  },
  step: {
    type: Number,
    default: 0,
  },
}

export type MotionGroupProps = Partial<ExtractPropTypes<typeof motionGroupProps>>
