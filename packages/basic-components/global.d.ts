declare module 'vue' {
  export interface GlobalComponents {
    BcButton: typeof import('./index')['BcButton'],
    BcSearch: typeof import('basic-components')['BcSearch'],
    BcTable: typeof import('@sepveneto/basic-comp')['BcTable'],
    BcClipboard: typeof import('basic-components')['BcClipboard'],
    BcDialog: typeof import('basic-components')['BcDialog'],
    BcInput: typeof import('basic-components')['BcInput'],
    BcSelect: typeof import('basic-components')['BcSelect'],
    BcMotion: typeof import('basic-components')['BcMotion'],
    BcMotionGroup: typeof import('basic-components')['BcMotionGroup'],
    BcUplaod: typeof import('basic-components')['BcUpload'],
  }
}

export {}
