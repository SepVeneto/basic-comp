declare module 'vue' {
  export interface GlobalComponents {
    BcButton: typeof import('../packages/basic-comp')['BcButton'],
    BcSearch: typeof import('../packages/basic-comp')['BcSearch'],
    BcTable: typeof import('../packages/basic-comp')['BcTable'],
    BcClipboard: typeof import('../packages/basic-comp')['BcClipboard'],
    BcDialog: typeof import('../packages/basic-comp')['BcDialog'],
    BcInput: typeof import('../packages/basic-comp')['BcInput'],
    BcSelect: typeof import('../packages/basic-comp')['BcSelect'],
    BcMotion: typeof import('../packages/basic-comp')['BcMotion'],
    BcMotionGroup: typeof import('../packages/basic-comp')['BcMotionGroup'],
    BcUplaod: typeof import('../packages/basic-comp')['BcUpload'],
  }
}

export {}