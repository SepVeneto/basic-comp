declare module 'vue' {
  export interface GlobalComponents {
    BcButton: typeof import('../packages/basic-components')['BcButton'],
    BcSearch: typeof import('../packages/basic-components')['BcSearch'],
    BcTable: typeof import('../packages/basic-components')['BcTable'],
    BcClipboard: typeof import('../packages/basic-components')['BcClipboard'],
    BcDialog: typeof import('../packages/basic-components')['BcDialog'],
    BcInput: typeof import('../packages/basic-components')['BcInput'],
    BcSelect: typeof import('../packages/basic-components')['BcSelect'],
    BcMotion: typeof import('../packages/basic-components')['BcMotion'],
    BcMotionGroup: typeof import('../packages/basic-components')['BcMotionGroup'],
    BcUplaod: typeof import('../packages/basic-components')['BcUpload'],
  }
}

export {}