import { BcButton } from '@basic-comp/components/button'
import { BcInput } from '@basic-comp/components/input'
import { BcTable } from '@basic-comp/components/table'
import { BcSelect } from '@basic-comp/components/select'
import { BcSearch } from '@basic-comp/components/search'
import { BcDialog, createDialog } from '@basic-comp/components/dialog'
import { BcUpload } from '@basic-comp/components/upload'
import { BcClipboard } from '@basic-comp/components/clipboard'
import { BcMotion } from '@basic-comp/components/motion'
import { BcMotionGroup } from '@basic-comp/components/motionGroup'
import { BcSvgIcon } from '@basic-comp/components/svgIcon'
import { BcConfigProvider } from '@basic-comp/components/configProvider'
import { BcStatus } from '@basic-comp/components/status'
import { BcDatePicker } from '@basic-comp/components/date-picker'
import { BcForm, BcFormItem } from '@basic-comp/components/form'

import type { Plugin } from 'vue'

export default [
  BcForm,
  BcFormItem,
  BcStatus,
  BcButton,
  BcInput,
  BcTable,
  BcSelect,
  BcSearch,
  BcDialog,
  BcUpload,
  BcClipboard,
  BcMotion,
  BcMotionGroup,
  BcSvgIcon,
  BcConfigProvider,
  BcDatePicker,

  createDialog,
] as Plugin[]
