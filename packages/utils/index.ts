export * from './tools'
export * from './renderUnit'
export * from '@basic-comp/hooks/useConfigInject'

export type CompInstall<T> = T & Plugin

export function compInstall<T>(comp: T) {
  (comp as CompInstall<T>).install = (app: App): void => {
    const _comp = comp as any
    app.component(_comp.name, _comp);
  }
  return comp as CompInstall<T>
}