declare module 'vue' {
  export interface GlobalComponents {
    BcConfigProvider: typeof import('@sepveneto/basic-comp')['BcConfigProvider'],
    BcButton: typeof import('@sepveneto/basic-comp')['BcButton'],
    BcSearch: typeof import('@sepveneto/basic-comp')['BcSearch'],
    BcTable: typeof import('@sepveneto/basic-comp')['BcTable'],
    BcClipboard: typeof import('@sepveneto/basic-comp')['BcClipboard'],
    BcDialog: typeof import('@sepveneto/basic-comp')['BcDialog'],
    BcInput: typeof import('@sepveneto/basic-comp')['BcInput'],
    BcSelect: typeof import('@sepveneto/basic-comp')['BcSelect'],
    BcMotion: typeof import('@sepveneto/basic-comp')['BcMotion'],
    BcMotionGroup: typeof import('@sepveneto/basic-comp')['BcMotionGroup'],
    BcUpload: typeof import('@sepveneto/basic-comp')['BcUpload'],
    BcForm: typeof import('@sepveneto/basic-comp')['BcForm'],
    BcFormItem: typeof import('@sepveneto/basic-comp')['BcFormItem'],
    BcStatus: typeof import('@sepveneto/basic-comp')['BcStatus'],
    BcRadioGroup: typeof import('@sepveneto/basic-comp')['BcRadioGroup'],
  }
}

export {}
