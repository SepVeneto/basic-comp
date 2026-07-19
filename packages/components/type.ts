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
export * from './radio-group'
export * from './motionGroup'

export declare interface ApiResponseType<T = unknown> {
  data: T,
  [key: string]: any
}
