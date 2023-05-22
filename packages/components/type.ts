export * from './table'
export * from './search'
export * from './button'
export * from './input'
export * from './clipboard'
export * from './configProvider'
export * from './dialog'
export * from './select'
export * from './svgIcon'
export * from './upload'
export * from './motion'
export * from './motionGroup'

export declare interface ApiResponseType {
  code: string,
  msg: string,
  data: unknown,
  [key: string]: unknown
}
