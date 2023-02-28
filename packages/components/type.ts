import { Plugin, App } from 'vue'

export * from './table';
export * from './search';
export * from './button';
export * from './input';
export * from './clipboard';
export * from './configProvider';
export * from './dialog';
export * from './select';
export * from './svgIcon';
export * from './upload';
export * from './motion';
export * from './motionGroup';

export declare interface ApiResponseType {
  code: string,
  msg: string,
  data: unknown,
}

export type CompInstall<T> = T & Plugin

export function compInstall<T>(comp: T) {
  (comp as CompInstall<T>).install = (app: App): void => {
    const _comp = comp as any
    app.component(_comp.name, _comp);
  }
  return comp as CompInstall<T>
}