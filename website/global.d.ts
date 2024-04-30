import {
  ElForm,
  ElFormItem,
  ElButton,
  ElTable,
  ElDialog,
  ElInput,
  ElSelect,
} from 'element-plus'

type Button = typeof import('@sepveneto/basic-comp')['BcButton']
type Search = typeof import('@sepveneto/basic-comp')['BcSearch']
type Table = typeof import('@sepveneto/basic-comp')['BcTable']
type Clipboard = typeof import('@sepveneto/basic-comp')['BcClipboard']
type Dialog = typeof import('@sepveneto/basic-comp')['BcDialog']
type Input = typeof import('@sepveneto/basic-comp')['BcInput']
type Select = typeof import('@sepveneto/basic-comp')['BcSelect']
type Motion = typeof import('@sepveneto/basic-comp')['BcMotion']
type MotionGroup = typeof import('@sepveneto/basic-comp')['BcMotionGroup']
type Upload = typeof import('@sepveneto/basic-comp')['BcUpload']
type Form = typeof import('@sepveneto/basic-comp')['BcForm']
type FormItem = typeof import('@sepveneto/basic-comp')['BcFormItem']
type Status = typeof import('@sepveneto/basic-comp')['BcStatus']

declare module 'vue' {
  export interface GlobalComponents {
    BcButton: Button,
    BcSearch: Search,
    BcTable: Table,
    BcClipboard: Clipboard,
    BcDialog: Dialog,
    BcInput: Input,
    BcSelect: Select,
    BcMotion: Motion,
    BcMotionGroup: MotionGroup,
    BcUpload: Upload,
    BcForm: Form,
    BcFormItem: FormItem,
    BcStatus: Status,
  }
}

export {}
