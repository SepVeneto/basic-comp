import type { App, Plugin } from 'vue'
export * from './tools'
export * from './renderUnit'

export type CompInstall<T> = T & Plugin
export type ExtractProps<T extends abstract new (...args: any) => any> = InstanceType<T>['$props']

export function compInstall<T>(comp: T) {
  (comp as CompInstall<T>).install = (app: App): void => {
    const _comp = comp as any
    app.component(_comp.name, _comp)
  }
  return comp as CompInstall<T>
}

export function logWarn(msg: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(msg)
  }
}
