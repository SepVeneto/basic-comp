import type { App, Ref } from 'vue'
import {
  computed,
  getCurrentInstance,
  inject,
  provide,
  ref,
  unref,
} from 'vue'
import type { ConfigProviderProps } from '@basic-comp/components/configProvider'
import {
  configProviderContextKey,
} from '@basic-comp/components/configProvider'
import { logWarn } from '@basic-comp/utils'

const globalConfig = ref<ConfigProviderProps>()

export function useConfigInject<
 N extends keyof ConfigProviderProps,
 D extends ConfigProviderProps[N]
>(
  name: N,
  defaultValue?: D
): Ref<Exclude<ConfigProviderProps[N], undefined> | D>
export function useConfigInject(): Ref<ConfigProviderProps>
export function useConfigInject(
  name?: keyof ConfigProviderProps,
  defaultValue?: any,
) {
  const config =
    getCurrentInstance()
      ? inject(configProviderContextKey, globalConfig)
      : globalConfig

  if (name) {
    return computed(() => config.value?.[name] ?? defaultValue)
  } else {
    return globalConfig
  }
}

export const provideGlobalConfig = (
  config: ConfigProviderProps,
  app?: App,
  global = false,
) => {
  const inSetup = !!getCurrentInstance()
  const oldConfig = inSetup ? useConfigInject() : undefined

  const provideFn = app?.provide ?? (inSetup ? provide : undefined)

  if (!provideFn) {
    logWarn('provideGlobalConfig() can only be used inside setup()')
    return
  }
  const context = computed(() => {
    const cfg = unref(config)
    if (!oldConfig?.value) return cfg
    return mergeConfig(oldConfig.value, cfg)
  })
  // @ts-expect-error: reference ElementPlus
  provideFn(configProviderContextKey, context)

  if (global || !globalConfig.value) {
    globalConfig.value = context.value
  }
  return context
}

function mergeConfig(
  a?: Record<string, any>,
  b?: Record<string, any>,
) {
  if (!a || !b) {
    return a || b
  }
  const obj: Record<string, any> = {}
  if (isObject(a) && isObject(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)])
    for (const key of keys) {
      obj[key] = mergeConfig(a[key], b[key])
    }
  } else if (isObject(a)) {
    Object.assign(obj, a)
  } else if (isObject(b)) {
    Object.assign(obj, b)
  } else {
    return a || b
  }
  return obj
}

function isObject(a: any) {
  return Object.prototype.toString.call(a) === '[object Object]'
}
