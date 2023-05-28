import type { App, AppContext, Plugin } from 'vue'
export * from './tools'
export * from './renderUnit'

export type CompInstall<T> = T & Plugin
export type CompInstallWithContext<T> = CompInstall<T> & { _context: AppContext | null }
export type ExtractProps<T extends abstract new (...args: any) => any> = InstanceType<T>['$props']

export function compInstall<T>(comp: T) {
  (comp as CompInstall<T>).install = (app: App): void => {
    const _comp = comp as any
    app.component(_comp.name, _comp)
  }
  return comp as CompInstall<T>
}
export function fnInstall<T>(fn: T) {
  (fn as CompInstall<T>).install = (app: App): void => {
    (fn as CompInstallWithContext<T>)._context = app._context
  }
  return fn
}

export function logWarn(msg: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(msg)
  }
}
