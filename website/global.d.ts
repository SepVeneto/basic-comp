import {
  ElButton,
  ElTable,
  ElDialog,
  ElInput,
  ElSelect,
} from 'element-plus'

type Button = typeof ElButton & typeof import('@sepveneto/basic-comp')['BcButton']
type Search = typeof import('@sepveneto/basic-comp')['BcSearch']
type Table = typeof ElTable & typeof import('@sepveneto/basic-comp')['BcTable']
type Clipboard = typeof import('@sepveneto/basic-comp')['BcClipboard']
type Dialog = typeof ElDialog & typeof import('@sepveneto/basic-comp')['BcDialog']
type Input = typeof ElInput & typeof import('@sepveneto/basic-comp')['BcInput']
type Select = typeof ElSelect & typeof import('@sepveneto/basic-comp')['BcSelect']
type Motion = typeof import('@sepveneto/basic-comp')['BcMotion']
type MotionGroup = typeof import('@sepveneto/basic-comp')['BcMotionGroup']
type Upload = typeof import('@sepveneto/basic-comp')['BcUpload']

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
  }
}

export {}
